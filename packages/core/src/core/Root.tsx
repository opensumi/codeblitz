import React, { FC } from 'react';
import { VERSION } from './env';
import { Landing } from './Landing';
import { RootProps } from './types';

// TODO: 后续考虑用 shadow DOM
export class AlexRoot extends HTMLElement {}

customElements.get('codeblitz-root') ? null : customElements.define('codeblitz-root', AlexRoot);

export const Root: FC<RootProps> = (props) => {
  const themeType = props.theme;
  const LandingComponent = props.Landing || Landing;

  // TODO: 可以获取挂载元素的 Rect 来设置宽高
  return (
    <codeblitz-root
      class={`codeblitz-root ${themeType ? `codeblitz-${themeType}` : ''} ${props.className ?? ''}`}
      style={{ width: '100%', height: '100%' }}
      data-meta-version={VERSION}
    >
      {(props.status === 'loading' || props.status === 'error') && <LandingComponent {...props} />}
      {props.children}
    </codeblitz-root>
  );
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'codeblitz-root': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { class: string },
        HTMLElement
      >;
    }
  }
}
