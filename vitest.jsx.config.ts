import path from 'node:path'
import { defineConfig } from 'vitest/config'

const srcDir = path.resolve(__dirname, 'src')

export default defineConfig({
  resolve: {
    alias: {
      'tsx-prompt/jsx-runtime': path.join(srcDir, 'jsx-runtime.ts'),
      'tsx-prompt/jsx-dev-runtime': path.join(srcDir, 'jsx-dev-runtime.ts'),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'tsx-prompt',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: 'tsx-prompt',
      },
    },
  },
  test: {
    name: 'jsx-automatic',
    environment: 'node',
    include: ['src/jsx-runtime.spec.tsx'],
  },
})
