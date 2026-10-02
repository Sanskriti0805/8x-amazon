# Capture test

**Tool:** Claude Code (Claude desktop app, Code tab)
**Model:** `claude-sonnet-5-5` (plans and executes; no separate planner)

## Mechanism
Claude Code hooks, configured in `.claude/settings.json`:
- `UserPromptSubmit` runs `node .claude/hooks/capture.js prompt` and logs the prompt verbatim.
- `Stop` runs `node .claude/hooks/capture.js stop`. It reads `transcript_path` from stdin, takes the final assistant text of each turn (text before tool calls is dropped), and back-fills any prompt the prompt hook missed.

Script: `.claude/hooks/capture.js`. Per-session counters live in `.claude/capture-state/` (gitignored).

## Log file
`.agent-logs/2026-10-02_09-22-12_fbcb16ec-e4cc-4a73-a019-c7aacadd8cca.md`

## Canary 1 (session fbcb16ec)
Prompt and response, raw:

```

```

## Second session: NOT VERIFIED
The brief asks for a canary in a second session. I asked for one, and the author reported it landed, but `.agent-logs/` contains only this session's file and no entry from a second session. Capture is confirmed working in session `fbcb16ec` only. The author chose to proceed without re-running it.

## What did not work first
- Offline smoke test with a `/tmp` transcript path: Node on Windows cannot resolve Git Bash `/tmp` paths, so the script exited silently.
- A transcript path written through a heredoc: `	` became a tab character in the path.
- Fixed both by building the path with `path.join(process.env.TEMP, ...)`.
- The first prompt predates the hook install, so it was back-filled from the transcript by the Stop hook rather than captured live.
