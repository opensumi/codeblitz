import React, { FC } from 'react';
import { Landing } from './Landing';
import { RootProps } from './types';

// TODO: 后续考虑用 shadow DOM
export class AlexRoot extends HTMLElement {}

customElements.define('alex-root', AlexRoot);

export const Root: FC<RootProps> = (props) => {
  const themeType = props.theme;
  const LandingComponent = props.Landing!;

  // TODO: 可以获取挂载元素的 Rect 来设置宽高
  return (
    <alex-root
      class={`alex-root ${themeType ? `alex-${themeType}` : ''} ${props.className ?? ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      {(props.status === 'loading' || props.status === 'error') && <LandingComponent {...props} />}
      {props.children}
    </alex-root>
  );
};

Root.defaultProps = {
  Landing,
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'alex-root': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { class: string },
        HTMLElement
      >;
    }
  }
}
