import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.ts',
  platform: 'node',
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true,
    codeSplitting: true,
    minify: true,
  },
});
