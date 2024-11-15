import { factory } from '@zzxming/eslint-config';

export default factory({
  overrides: [
    {
      files: ['docs/index.js'],
      rules: {
        'no-undef': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ],
});
