
# TrueBlocks CodeGen

A code generation wizard for the TrueBlock repos.

## Features

- Desktop app built with Wails, React, TypeScript, and Mantine
- Golang backend
- ESLint & Prettier configured for frontend
- GolangCI-lint configured for backend
- VSCode automatic formatting on save (Go, TS, JS, YAML, TOML)

## Getting Started

### Prerequisites

- Golang >= 1.23.1
- Wails >= 2.10.1
- Yarn (no npm)
- Node.js >= 18.x

### Installation

```bash
git clone https://github.com/TrueBlocks/trueblocks-codeGen.git
cd trueblocks-codeGen
yarn install
cd frontend && yarn install && cd ..
```

### Running in Development

```bash
yarn dev
```

### Linting

```bash
yarn lint
```

### Building for Production

```bash
yarn build
```

## Project Structure

```
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SidebarLeft.tsx
│   │   │   └── SidebarRight.tsx
│   │   └── App.tsx
│   ├── eslint.config.js
│   └── vite.config.ts
├── backend
│   └── main.go
├── wails.json
└── README.md
```

## Contributing

We love contributors. Please see information about our workflow before proceeding.

- Fork this repository into your own repo.
- Create a branch: `git checkout -b <branch_name>`.
- Make changes to your local branch and commit them to your forked repo:  
  `git commit -m '<commit_message>'`
- Push back to the original branch:  
  `git push origin TrueBlocks/trueblocks-core`
- Create the pull request.

## License

[LICENSE](./LICENSE)
