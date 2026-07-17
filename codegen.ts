import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../backend/src/schema.gql',
  generates: {
    './src/gql/types.ts': {
      plugins: ['typescript'],
      config: {
        scalars: { DateTime: 'string' },
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
