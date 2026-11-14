# 01: Local setup & GitHub

Already installed on this PC (checked 2026-11-14): **Node.js v24**, **npm 11**, **Git 2.46**. Wrangler doesn't need installing globally; the project runs it through `npx`.

## 1. Git identity (one time)

In a terminal:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 2. GitHub account + private repository (recommended)

This gives you an off-site backup and lets Cloudflare deploy automatically on every push (03 §7, option B).

1. Sign up at https://github.com (free).
2. Click **New repository**: name `aminy-phone-repair`, **Private**, and **don't** add a README, .gitignore or licence (the project already has them).
3. After Claude Code finishes Phase 0 (which runs `git init` and the first commit), connect the repo. Type this in Claude Code with the `!` prefix, or in any terminal in the project folder:

```bash
git remote add origin https://github.com/<your-username>/aminy-phone-repair.git
git push -u origin main
```

The first push opens a browser window to sign in to GitHub. That's expected.

## 3. Optional: GitHub CLI

Not required. If you want Claude Code to create the repo and push for you: install from https://cli.github.com, then run `gh auth login`.

## 4. Browser tools for testing (free)

- **axe DevTools** extension (Chrome/Edge): accessibility checks.
- Lighthouse is built into Chrome DevTools (F12 → Lighthouse).
- **NVDA** screen reader (https://www.nvaccess.org): free, for the accessibility check in Phase 1.6. Windows Narrator also works (Ctrl+Win+Enter).
