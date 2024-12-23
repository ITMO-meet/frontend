import dotenv from 'dotenv';
import esbuild from 'esbuild';
import CssModulesPlugin from 'esbuild-css-modules-plugin';
import sh from 'shelljs';

dotenv.config();

const directory = 'build';

// Clean and create build directory
if (sh.test('-e', directory)) {
  sh.rm('-rf', directory);
}
sh.mkdir(directory);

// Copy main static files
const staticFiles = ['public/index.html', 'public/manifest.json', 'public/favicon.png'];
staticFiles.forEach((file) => {
  if (sh.test('-e', file)) {
    sh.cp(file, directory);
  } else {
    console.warn(`Warning: ${file} not found, skipping.`);
  }
});

// Copy images directory
if (sh.test('-e', 'public/images')) {
  sh.cp('-R', 'public/images', directory);
} else {
  console.warn(`Warning: public/images not found, skipping.`);
}

const config = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: 'browser',
  format: 'esm',
  outdir: directory,
  entryNames: 'bundle',
  outExtension: { '.js': '.js' },
  plugins: [CssModulesPlugin({ inject: false })],
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
