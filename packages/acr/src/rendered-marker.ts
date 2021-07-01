/**
 * 标记 ide 组件是否已经做过初次渲染，作为模块级别标记位
 * 用于区分 冷启动 | 热启动
 */
let _isFirstRendered = true;

export const isFirstRendered = () => {
  return _isFirstRendered;
};

export const markFirstRendered = () => {
  _isFirstRendered = false;
};
