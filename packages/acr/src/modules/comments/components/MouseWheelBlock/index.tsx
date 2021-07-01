import React from 'react';

function getScrollableElement(_target: Element) {
  let target = _target;
  // 只往上找三级
  let deep = 3;
  while (
    target &&
    deep-- &&
    !(target.nodeName.toUpperCase() === 'TEXTAREA' || target.hasAttribute('data-ide-scrollable'))
  ) {
    // @ts-ignore
    target = target.parentElement;
  }
  return target;
}

export const MouseWheelBlock = ({ children }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  function handleMouseWheel(event: MouseWheelEvent) {
    const target = getScrollableElement(event.target as Element);
    // 在评论输入框里滚动滚动条需要停止冒泡，否则会触发编辑器滚动
    if (target && target.scrollHeight > target.clientHeight) {
      event.stopPropagation();
    }
  }

  React.useEffect(() => {
    ref.current?.addEventListener('mousewheel', handleMouseWheel, true);
    return () => {
      ref.current?.removeEventListener('mousewheel', handleMouseWheel, true);
    };
  }, []);
  return <div ref={ref}>{children}</div>;
};
