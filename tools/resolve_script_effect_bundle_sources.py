#!/usr/bin/env python3
"""Extract conservative faction -> effect bundle assignments from WH3 Lua scripts.

Only statically provable `cm:apply_effect_bundle(...)` calls are emitted. The
resolver accepts a literal bundle key and resolves the faction argument when it
is either a literal faction key or a variable that has exactly one literal
assignment in the same file. Dynamic concatenations and ambiguous variables are
reported but never guessed.
"""
import argparse
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

STRING = r'(["\'])(.*?)\1'
ASSIGN_RE = re.compile(r'(?m)^\s*(?:local\s+)?([A-Za-z_][A-Za-z0-9_\.]*)\s*=\s*(["\'])([^"\']+)\2\s*;?\s*(?:--.*)?$')
CALL_RE = re.compile(
    r'cm:apply_effect_bundle\(\s*(["\'])([^"\']+)\1\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\)',
    re.MULTILINE,
)
FACTION_KEY_RE = re.compile(r'^(?:wh|wh2|wh3)_[a-z0-9_]+$')


def resolve_arg(expr, assignments):
    expr = expr.strip()
    literal = re.fullmatch(r'(["\'])([^"\']+)\1', expr)
    if literal:
        return literal.group(2), 'literal'
    values = assignments.get(expr, set())
    if len(values) == 1:
        return next(iter(values)), 'single-file-constant'
    return None, 'dynamic-or-ambiguous'


def scan_file(path, root):
    text = path.read_text(encoding='utf-8', errors='replace')
    assignments = defaultdict(set)
    for match in ASSIGN_RE.finditer(text):
        assignments[match.group(1)].add(match.group(3))

    resolved = []
    unresolved = []
    for match in CALL_RE.finditer(text):
        bundle = match.group(2)
        faction_expr = match.group(3).strip()
        turns_expr = match.group(4).strip()
        faction, resolution = resolve_arg(faction_expr, assignments)
        line = text.count('\n', 0, match.start()) + 1
        source = str(path.relative_to(root)).replace('\\', '/')
        if faction and FACTION_KEY_RE.match(faction):
            resolved.append({
                'faction': faction,
                'effectBundle': bundle,
                'turnsExpression': turns_expr,
                'resolution': resolution,
                'sourceFile': source,
                'sourceLine': line,
            })
        else:
            unresolved.append({
                'effectBundle': bundle,
                'factionExpression': faction_expr,
                'turnsExpression': turns_expr,
                'reason': resolution if faction is None else 'resolved-value-is-not-a-faction-key',
                'sourceFile': source,
                'sourceLine': line,
            })
    return resolved, unresolved


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--scripts-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    if not args.scripts_dir.is_dir():
        raise SystemExit(f'script source resolver failed: missing scripts dir {args.scripts_dir}')

    resolved, unresolved = [], []
    files = sorted(args.scripts_dir.rglob('*.lua'))
    for path in files:
        r, u = scan_file(path, args.scripts_dir)
        resolved.extend(r)
        unresolved.extend(u)

    dedup = {}
    for item in resolved:
        key = (item['faction'], item['effectBundle'], item['sourceFile'], item['sourceLine'])
        dedup[key] = item
    resolved = sorted(dedup.values(), key=lambda x: (x['faction'], x['effectBundle'], x['sourceFile'], x['sourceLine']))

    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'partial',
        'semantics': 'static script assignments only; presence in scripts does not imply the bundle is active on turn 1 unless the call executes during campaign initialisation',
        'assignments': resolved,
        'diagnostics': {
            'luaFilesScanned': len(files),
            'resolvedAssignments': len(resolved),
            'unresolvedCalls': len(unresolved),
            'unresolved': unresolved,
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"resolved {len(resolved)} static faction/bundle assignments from {len(files)} Lua files")


if __name__ == '__main__':
    main()
