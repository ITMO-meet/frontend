const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  plugins: [
    // ваши плагины, если нужны
  ],
}).catch(() => process.exit(1));