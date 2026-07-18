# Features

This directory contains feature-based modules. Each feature is a self-contained
module with its own components, hooks, types, and utilities.

## Structure Example

```
features/
├── content-bank/
│   ├── components/
│   ├── hooks/
│   ├── types.ts
│   └── index.ts
├── scheduler/
│   ├── components/
│   ├── hooks/
│   ├── types.ts
│   └── index.ts
```

Each feature module exports its public API through an `index.ts` barrel file.
