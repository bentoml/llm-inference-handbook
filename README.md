# LLM Inference Handbook

This repository contains the source for the
[LLM Inference Handbook](https://handbook.modular.com), a practical guide for
understanding, optimizing, scaling, and operating LLM inference systems.

The handbook is a standalone Docusaurus site styled with the Modular design
language system. Its future canonical source home is
[`modular/llm-inference-handbook`](https://github.com/modular/llm-inference-handbook).

## Local preview

Install dependencies and start the local development server:

```bash
pnpm install
pnpm start
```

The site runs at [http://localhost:3000/](http://localhost:3000/).

To build or serve the production output locally:

```bash
pnpm build
pnpm serve
```

## Contributing

Contributions are welcome! Feel free to open issues, suggest improvements, or
submit pull requests.

### Markdown linting

Markdown files are linted with [rumdl](https://rumdl.dev/). Prose is wrapped at
80 characters. Run the same checks as CI locally:

```bash
pnpm lint:md       # check for issues
pnpm lint:md:fix   # auto-fix
```

Some line-length violations (long URLs, API references) may need manual reflow or
`<!-- rumdl-disable MD013 -->` blocks.

## Licenses

This handbook follows the upstream dual-license posture:

- All files in the `docs/` folder are licensed under the
  [Creative Commons Attribution 4.0 International (CC BY 4.0) License](https://creativecommons.org/licenses/by/4.0/).
- All other files are licensed under the
  [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
