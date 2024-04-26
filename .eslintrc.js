module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  rules: {
    // your rules
    '@typescript-eslint/no-explicit-any': ['off'],
    '@babel/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
  },
};
