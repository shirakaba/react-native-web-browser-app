module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [".tsx", ".ts", ".jsx", ".js"],
          alias: {
            "~": "./src",
          }
        }
      ]
    ],
  };
};
