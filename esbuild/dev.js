import { exec } from 'child_process';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import CssModulesPlugin from 'esbuild-css-modules-plugin';
import process from 'node:process';

dotenv.config();

const config = {
  logLevel: 'info',
  entryPoints: ['src/index.tsx'],
  outfile: 'public/build/bundle.js',
  bundle: true,
  define: {
    NODE_ENV: 'development',
  },
  minify: false,
  sourcemap: true,
  plugins: [
    CssModulesPlugin({
      force: true,
      emitDeclarationFile: true,
      localsConvention: 'camelCaseOnly',
      namedExports: true,
      inject: false,
    }),
  ],
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
  .context(config)
  .then(async (ctx) => {
    await ctx.watch();
    await ctx.serve({
      servedir: 'public',
      port: 3070,
      onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
        console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
      },
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

// Open the browser after successful build
const openBrowser = (url) => {
  switch (process.platform) {
    case 'win32':
      exec(`start ${url}`);
      break;
    case 'darwin':
      exec(`open ${url}`);
      break;
    case 'linux':
      exec(`xdg-open ${url}`);
      break;
    default:
      console.error('Unsupported platform');
  }
};

openBrowser('http://localhost:3070');
