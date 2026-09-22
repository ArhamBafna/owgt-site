# Browser Automation Tools Review & Evaluation

This document captures the evaluation of browser automation tooling discussed during site inspection and full-page rendering workflows.

---

## 1. Summary of Discussion

During inspection of the Wix site (which uses lazy-loading and dynamic hydration requiring scroll events), we compared three browser automation approaches:

### A. `agent-browser` (CLI Tool)
* **Design**: Command-line based (`open`, `snapshot`, `click`, `scroll`, `eval`, `screenshot`).
* **Strengths**: 
  * Direct terminal execution without writing temporary code files.
  * Accessibility tree snapshots with short labels (`@e1`, `@e2`) make clicking and navigating deterministic.
  * Can scroll (`agent-browser scroll down 600`) and evaluate JS (`agent-browser eval "..."`).
* **Best For**: Fast exploration, navigation, visual verification, form filling, and CLI-driven tasks.

### B. `playwriter` (Agent Playwright Skill)
* **Design**: Agent-level JavaScript evaluation environment connected to a live browser session.
* **Strengths**:
  * Direct programmatic access to the active page context.
  * Evaluates JavaScript snippets interactively without generating local `.py` or `.js` script files.
* **Best For**: Interactive DOM manipulation, complex SPA state interaction, and dynamic page evaluation during active chats.

### C. Raw Playwright (Standalone Python / Node Script)
* **Design**: Direct code library running independent browser automation scripts.
* **Strengths**:
  * Unattended batch pipelines (e.g., execute a 50-step scroll loop, wait for network idle, take full-page screenshot in one shot).
  * Advanced browser internals: request interception/mocking, fake device states/permissions, multi-user parallel contexts.
  * Runs independently of agent chat cycles.
* **Drawbacks**: Requires writing local script files, managing Python/Node packages, and cleanup of temporary scripts.

---

## 2. Consideration for User: Should Raw Playwright be Added to `pick-browser-auto`?

Currently, `/pick-browser-auto` routes strictly between **`agent-browser`** and **`playwriter`**.

### Question to Decide
> **Should we update the `/pick-browser-auto` skill to make it a 3-way routing decision (`agent-browser` vs. `playwriter` vs. `raw-playwright`)?**

### Does It Provide Real Value?

#### YES (Arguments to Add):
1. **Unattended Batch Tasks**: When a task is purely a background pipeline (e.g., "scroll 50 times, wait for dynamic media, save high-res full-page screenshot"), a standalone script is faster and cleaner than back-and-forth CLI or interactive commands.
2. **Capabilities Agent Tools Cannot Match**:
   * Network interception (mocking backend responses or headers).
   * Multi-user / multi-context testing (simultaneous isolated sessions).
   * Device, offline, or geolocation simulation.
3. **CI/CD Readiness**: Produces scripts that can run on headless servers or GitHub Actions without agent presence.

#### NO (Arguments to Keep as 2 Options):
1. **Agent Clutter**: Standalone scripts leave scrap files (`screenshot.py`) that require manual cleanup.
2. **Overkill for Standard Browsing**: Most web tasks (clicking, reading text, scrolling, taking screenshots) are already supported by `agent-browser` (via `scroll` and `eval`) without writing code.
3. **Complexity**: Adds extra cognitive and routing overhead to every simple browser request.

---

## 3. Recommendation

* **If primary use is web inspection, screenshots, and form navigation**: Keep `pick-browser-auto` as two tools (`agent-browser` + `playwriter`). `agent-browser` can handle scroll loops via `eval` or terminal loops without needing script files.
* **If expanding into automated testing, network mocking, or complex batch pipelines**: Add `raw-playwright` as the designated 3rd option in `pick-browser-auto`.
