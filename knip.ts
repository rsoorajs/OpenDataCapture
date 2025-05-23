import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    'apps/api': {
      entry: ['src/main.ts', 'libnest.config.ts'],
      ignoreDependencies: ['@opendatacapture/runtime-v1', 'prisma-json-types-generator', 'lodash-es', 'ts-pattern'],
      project: '**/*.{js,ts}'
    }
  }
};

export default config;
