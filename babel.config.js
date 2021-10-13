module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '85',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
