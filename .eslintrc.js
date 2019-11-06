module.exports = {
  root: false,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
      "indent": ["off", 4],
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow async-await
      'generator-star-spacing': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

      'space-before-function-paren': 0, //函数参数前面要加空格
      'space-before-blocks': 0, //函数块前面要加空格
      'semi': 0, //分号检查；0：忽略，1、warn，2、error
      "one-var": [0, {
          "var": "always", // Exactly one var declaration per function
          "let": "always", // Exactly one let declaration per block
          "const": "always" // Exactly one declarator per const declaration per block
      }],
      'no-useless-call': 0,
      "eqeqeq": [0, "allow-null"],
      "no-unused-vars": [0, {
          // 允许声明未使用变量
          "vars": "local",
          // 参数不检查
          "args": "none"
      }],
      "no-return-assign" : 0,
      "no-redeclare": 1,
      "handle-callback-err": 0,
      //关闭禁止混用tab和空格
      "no-mixed-spaces-and-tabs": 0,
      "no-tabs": 0,
      "no-mixed-operators" : 0,
      "no-sequences": 0,  //禁止使用逗号运算符
      "prefer-promise-reject-errors": 0,
  }
}
