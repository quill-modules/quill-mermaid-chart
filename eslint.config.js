import { factory } from '@zzxming/eslint-config';

export default factory({
  overrides: [
    {
      rules: {
        'unicorn/prefer-global-this': 'off',
        'unicorn/expiring-todo-comments': 'off',
        'ts/no-unused-expressions': ['error', {}],
      },
    },
    {
      files: ['docs/index.js'],
      rules: {
        'no-undef': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ],
});
