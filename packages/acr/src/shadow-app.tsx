import * as React from 'react';
import render from './app';

export const ShadowApp = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      const shadowRoot = ref.current.attachShadow({ mode: 'open' });
      // render(shadowRoot);
    }
  }, []);

  return <div ref={ref} />;
};
