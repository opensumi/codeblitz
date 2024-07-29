import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

const appContainer = document.createElement('div');
appContainer.className = 'codeblitz-keepalive-portal';
appContainer.style.width = '100%';
appContainer.style.height = '100%';

let appMounted = false;

export const KeepAlive = (props: {
  children: React.ReactNode;
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!appMounted) {
      appMounted = true;
      ReactDOM.createRoot(appContainer).render(
        <>{props.children}</>,
      );
    }

    anchorRef?.current?.insertAdjacentElement('afterend', appContainer);

    return () => {
      try {
        if (anchorRef?.current?.parentNode !== null) {
          anchorRef?.current?.parentNode.removeChild(appContainer);
        }
      } catch (error) {
        console.error('[KeepAlive] unmount container error', error);
      }
    };
  }, []);

  return <div ref={anchorRef} className='codeblitz-keepalive' />;
};
