import * as fs from 'fs/promises';
import * as path from 'path';

import esbuild from 'esbuild';

import { dtsPlugin } from './plugin.js';
import { Resolver } from './resolver.js';

import type { BundlerOptions, EntryPoint, ExportCondition, ResolvedPackage } from './types.js';

export class Bundler {
  private resolver: Resolver;

  constructor(private options: BundlerOptions) {
    this.resolver = new Resolver(options.configFilepath);
  }

  async bundle({ mode = 'production' }: Pick<BundlerOptions, 'mode'> = {}): Promise<void> {
    const packages = await this.findPackages();
    const entryPoints = this.getEntryPoints(packages);

    await fs.rm(this.options.outdir, { force: true, recursive: true });
    await esbuild.build({
      bundle: true,
      entryPoints: entryPoints,
      format: 'esm',
      keepNames: true,
      minify: mode === 'production',
      outdir: this.options.outdir,
      platform: 'browser',
      plugins: [
        dtsPlugin({
          configFilepath: this.options.configFilepath,
          entryPoints,
          outdir: this.options.outdir,
          packages
        })
      ],
      sourcemap: mode === 'development' ? 'inline' : false,
      sourcesContent: mode === 'development',
      splitting: true,
      target: 'es2022'
    });
  }

  private async findPackages(): Promise<ResolvedPackage[]> {
    const packages: ResolvedPackage[] = [];
    for (const packageName of this.options.include) {
      const pkg = await this.resolver.resolve(packageName);
      packages.push(pkg);
    }
    return packages;
  }

  private getEntryPoints(packages: ResolvedPackage[]): EntryPoint[] {
    const entryPoints: EntryPoint[] = [];
    for (const pkg of packages) {
      for (const key in pkg.exports) {
        if (key === './package.json') {
          continue;
        }
        const conditions = pkg.exports[key]!;
        const runtimePackageName = pkg.name.split('__').join('@');
        const out = path.join(runtimePackageName, key === '.' ? 'index' : key);
        for (const condition of ['import', 'default'] satisfies ExportCondition[]) {
          if (conditions[condition]) {
            entryPoints.push({
              in: conditions[condition],
              out
            });
            break;
          }
        }
        if (conditions.types) {
          entryPoints.push({
            in: conditions.types,
            out: out + '.d'
          });
        }
      }
    }
    return entryPoints;
  }
}