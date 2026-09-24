# Graph Report - placeholder  (2026-09-24)

## Corpus Check
- 12 files · ~11,088 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 141 nodes · 129 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f4db827`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- dependencies
- OWGT Placeholder / Coming Soon Page
- devDependencies
- Implementation Decisions
- package.json
- OWGT Placeholder / Coming Soon Page
- include
- Further Notes
- vercel.json
- layout.tsx
- .eslintrc.json
- postcss.config.mjs
- next.config.ts
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Implementation Decisions` - 12 edges
3. `OWGT Placeholder / Coming Soon Page` - 11 edges
4. `OWGT Placeholder / Coming Soon Page` - 8 edges
5. `Further Notes` - 7 edges
6. `include` - 6 edges
7. `Getting Started` - 6 edges
8. `scripts` - 5 edges
9. `lib` - 4 edges
10. `Testing Decisions` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "dependencies"
Cohesion: 0.12
Nodes (17): drawably, next, dependencies, drawably, next, react, react-dom, @types/node (+9 more)

### Community 2 - "OWGT Placeholder / Coming Soon Page"
Cohesion: 0.12
Nodes (16): Brand Colors, Build, Contact, Deployment, Development, Features, Future Enhancements, Getting Started (+8 more)

### Community 3 - "devDependencies"
Cohesion: 0.15
Nodes (13): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+5 more)

### Community 4 - "Implementation Decisions"
Cohesion: 0.17
Nodes (12): Accessibility Requirements, Animation & Motion, Color System, Component Structure, Drawably Configuration, Form Behavior, Implementation Decisions, Layout Architecture (+4 more)

### Community 5 - "package.json"
Cohesion: 0.17
Nodes (11): author, description, keywords, name, private, scripts, build, dev (+3 more)

### Community 6 - "OWGT Placeholder / Coming Soon Page"
Cohesion: 0.20
Nodes (9): Automated Testing (Future), Manual Testing Checklist, Out of Scope, OWGT Placeholder / Coming Soon Page, Problem Statement, Solution, Testing Decisions, User Stories (+1 more)

### Community 7 - "include"
Cohesion: 0.22
Nodes (8): .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 8 - "Further Notes"
Cohesion: 0.29
Nodes (7): Brand Consistency, Deployment, Design Philosophy, Further Notes, Future Backend Integration, Success Metrics (When Backend Implemented), Timeline Constraints

### Community 9 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, devCommand, framework, installCommand, outputDirectory

## Knowledge Gaps
- **97 isolated node(s):** `extends`, `next/core-web-vitals`, `inter`, `metadata`, `nextConfig` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `inter` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `OWGT Placeholder / Coming Soon Page` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._