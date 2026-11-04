# Lucio Gastellu — portfolio

A server-rendered portfolio built with Next.js, `next-intl` (ES and EN) and Tailwind CSS.

```bash
npm install
npm run dev        # http://localhost:3000/es (or /en)
npm test
npx tsc --noEmit && npm run lint
```

Content lives in `src/json` and `messages/`; pure logic in `src/features/portfolio/lib`, with `node:test` tests.
