import dotenv from 'dotenv';
import esbuild from 'esbuild';
import CssModulesPlugin from 'esbuild-css-modules-plugin';
import { glob } from 'glob';
import process from 'node:process';
import sh from 'shelljs';

dotenv.config();

const directory = 'build';

if (sh.test('-e', directory)) {
  sh.rm('-rf', directory);
}
sh.mkdir(directory);
sh.cp('public/index.html', directory);
sh.cp('public/manifest.json', directory);
sh.cp('public/favicon.png', directory);

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

const run = async () => {
  await esbuild.build(config).catch((e) => {
    console.error(e);
    process.exit(1);
  });

  const jsFile = await glob(`${directory}/js/*.?(m)js`, { posix: true });
  const cssFile = await glob(`${directory}/js/*.css`, { posix: true });

  if (jsFile.length) {
    jsFile.forEach((js) => {
      console.log(js);
      sh.sed('-i', '\./build/bundle\.js', js.replace(directory, '.'), `${directory}/index.html`);
    });
  }

  if (cssFile.length) {
    cssFile.forEach((css) => {
      sh.sed('-i', '\./build/bundle\.css', css.replace(directory, '.'), `${directory}/index.html`);
    });
  }
};

run();
