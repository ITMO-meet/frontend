import dotenv from 'dotenv';
import esbuild from 'esbuild';
import CssModulesPlugin from 'esbuild-css-modules-plugin';
import sh from 'shelljs';

dotenv.config();

const directory = 'build';

if (sh.test('-e', directory)) {
  sh.rm('-rf', directory);
}
sh.mkdir(directory);

const staticFiles = ['public/index.html', 'public/manifest.json', 'public/favicon.png'];
staticFiles.forEach((file) => {
  if (sh.test('-e', file)) {
    sh.cp(file, directory);
  } else {
    console.warn(`Warning: ${file} not found, skipping.`);
  }
});

const config = {
  logLevel: 'info',
  entryPoints: {
    main: 'src/index.tsx',
  },
  platform: 'node',
  bundle: true,
  define: {
    NODE_ENV: 'production',
  },
  minify: true,
  sourcemap: false,
  plugins: [CssModulesPlugin()],
  loader: {
    '.eot': 'dataurl',
    '.woff': 'dataurl',
    '.woff2': 'dataurl',
    '.ttf': 'dataurl',
    '.svg': 'dataurl',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.gif': 'dataurl',
  },
  outdir: directory,
  entryNames: 'js/[name]-[hash]',
  assetNames: 'static/[name]-[hash]',
  outExtension: {
    '.js': '.mjs',
  },
  pure: ['console.log'],
  format: 'esm',
  splitting: true,
};

esbuild
  .build(config)
  .then(() => {
    console.log('Build completed successfully.');
  })
  .catch((e) => {
    console.error('Build failed:', e);
    process.exit(1);
  });
