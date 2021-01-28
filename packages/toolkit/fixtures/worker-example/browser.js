const React = require('React');

const Component = () => {
  return React.createElement('div', {}, `当前时间戳：${Date.now()}`);
};

exports.Component = Component;
