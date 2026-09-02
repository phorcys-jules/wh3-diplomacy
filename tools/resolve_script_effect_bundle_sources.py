#!/usr/bin/env python3
"""Extract conservative faction -> effect bundle assignments from WH3 Lua scripts.

Only statically provable `cm:apply_effect_bundle(...)` calls are emitted. The
resolver accepts a literal bundle key and resolves the faction argument when it
is either a literal faction key or a variable that has exactly one literal
assignment in the same file. Dynamic concatenations and ambiguous variables are
reported but never guessed.

Calls lexically contained in a `cm:add_first_tick_callback*()` invocation are
marked as first-tick execution evidence. `guardFreeFirstTick=true` is an even
more conservative signal: no `if`, `for`, `while` or `repeat` token occurs
between the start of the enclosing callback and the bundle call. This can miss
valid unconditional calls (false negatives), but it avoids promoting visibly
guarded calls as verified turn-1 effects.

`--exclude-prefix` can be repeated to exclude campaign-specific script trees
that are not part of the requested campaign.
"""
import argparse
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ASSIGN_RE = re.compile(r'(?m)^\s*(?:local\s+)?([A-Za-z_][A-Za-z0-9_\.]*)\s*=\s*(["\'])([^"\']+)\2\s*;?\s*(?:--.*)?$')
CALL_RE = re.compile(
    r'cm:apply_effect_bundle\(\s*(["\'])([^"\']+)\1\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\)',
    re.MULTILINE,
)
FIRST_TICK_RE = re.compile(r'cm:add_first_tick_callback[A-Za-z0-9_]*\s*\(')
CONTROL_FLOW_RE = re.compile(r'\b(?:if\b[^\n]*\bthen\b|for\b[^\n]*\bdo\b|while\b[^\n]*\bdo\b|repeat\b)', re.IGNORECASE)
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


def matching_paren(text, open_index):
    depth = 0
    quote = None
    escaped = False
    i = open_index
    while i < len(text):
        char = text[i]
        if quote:
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == quote:
                quote = None
            i += 1
            continue
        if char in ('"', "'"):
            quote = char
            i += 1
            continue
        if char == '-' and i + 1 < len(text) and text[i + 1] == '-':
            newline = text.find('\n', i + 2)
            if newline == -1:
                return None
            i = newline + 1
            continue
        if char == '(':
            depth += 1
        elif char == ')':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return None


def first_tick_ranges(text):
    ranges = []
    for match in FIRST_TICK_RE.finditer(text):
        open_index = text.find('(', match.start(), match.end())
        if open_index == -1:
            continue
        close_index = matching_paren(text, open_index)
        if close_index is not None:
            ranges.append((match.start(), close_index + 1))
    return ranges


def enclosing_range(index, ranges):
    matches = [(start, end) for start, end in ranges if start <= index < end]
    if not matches:
        return None
    return max(matches, key=lambda item: item[0])


def guard_free_first_tick(text, call_index, tick_range):
    if not tick_range:
        return False
    prefix = text[tick_range[0]:call_index]
    return CONTROL_FLOW_RE.search(prefix) is None


def scan_file(path, root):
    text = path.read_text(encoding='utf-8', errors='replace')
    assignments = defaultdict(set)
    for match in ASSIGN_RE.finditer(text):
        assignments[match.group(1)].add(match.group(3))
    tick_ranges = first_tick_ranges(text)

    resolved = []
    unresolved = []
    for match in CALL_RE.finditer(text):
        bundle = match.group(2)
        faction_expr = match.group(3).strip()
        turns_expr = match.group(4).strip()
        faction, resolution = resolve_arg(faction_expr, assignments)
        tick_range = enclosing_range(match.start(), tick_ranges)
        first_tick = tick_range is not None
        guard_free = guard_free_first_tick(text, match.start(), tick_range)
        line = text.count('\n', 0, match.start()) + 1
        source = str(path.relative_to(root)).replace('\\', '/')
        execution_evidence = 'guard-free-first-tick' if guard_free else ('first-tick-callback' if first_tick else 'script-call')
        record = {
            'effectBundle': bundle,
            'turnsExpression': turns_expr,
            'executionEvidence': execution_evidence,
            'firstTickCallback': first_tick,
            'guardFreeFirstTick': guard_free,
            'sourceFile': source,
            'sourceLine': line,
        }
        if faction and FACTION_KEY_RE.match(faction):
            resolved.append({
                'faction': faction,
                'resolution': resolution,
                **record,
            })
        else:
            unresolved.append({
                'factionExpression': faction_expr,
                'reason': resolution if faction is None else 'resolved-value-is-not-a-faction-key',
                **record,
            })
    return resolved, unresolved


def is_excluded(path, root, prefixes):
    rel = str(path.relative_to(root)).replace('\\', '/')
    return any(rel == prefix or rel.startswith(prefix.rstrip('/') + '/') for prefix in prefixes)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--scripts-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    parser.add_argument('--exclude-prefix', action='append', default=[])
    args = parser.parse_args()

    if not args.scripts_dir.is_dir():
        raise SystemExit(f'script source resolver failed: missing scripts dir {args.scripts_dir}')

    all_files = sorted(args.scripts_dir.rglob('*.lua'))
    excluded_files = [p for p in all_files if is_excluded(p, args.scripts_dir, args.exclude_prefix)]
    files = [p for p in all_files if p not in excluded_files]

    resolved, unresolved = [], []
    for path in files:
        r, u = scan_file(path, args.scripts_dir)
        resolved.extend(r)
        unresolved.extend(u)

    dedup = {}
    for item in resolved:
        key = (item['faction'], item['effectBundle'], item['sourceFile'], item['sourceLine'])
        dedup[key] = item
    resolved = sorted(dedup.values(), key=lambda x: (x['faction'], x['effectBundle'], x['sourceFile'], x['sourceLine']))
    first_tick_count = sum(1 for item in resolved if item['firstTickCallback'])
    guard_free_count = sum(1 for item in resolved if item['guardFreeFirstTick'])

    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'partial',
        'semantics': 'static script assignments scoped to the requested campaign; guardFreeFirstTick is conservative evidence of an unguarded first-tick call, not proof that every external prerequisite is satisfied',
        'assignments': resolved,
        'diagnostics': {
            'luaFilesDiscovered': len(all_files),
            'luaFilesScanned': len(files),
            'excludedLuaFiles': len(excluded_files),
            'excludedPrefixes': args.exclude_prefix,
            'resolvedAssignments': len(resolved),
            'firstTickAssignments': first_tick_count,
            'guardFreeFirstTickAssignments': guard_free_count,
            'unresolvedCalls': len(unresolved),
            'unresolved': unresolved,
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"resolved {len(resolved)} assignments; {first_tick_count} first-tick, {guard_free_count} guard-free first-tick")


if __name__ == '__main__':
    main()
