import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://copilotlab.nl',
  output: 'static',
  build: { format: 'preserve' },
  server: { host: '127.0.0.1' },
});
