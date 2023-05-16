import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
const appContainer = document.createElement('div')
appContainer.style.width = '100%'
appContainer.style.height = '100%'

let appMounted = false

export const KeepAlive: React.FC<{ visible: boolean }> = (props) => {
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!appMounted) {
      appMounted = true
      ReactDOM.render(<>{props.children}</>, appContainer)
    }
  }, [])

  useEffect(() => {
    if (props.visible) {
      anchorRef?.current?.insertAdjacentElement('afterend', appContainer)
    }

    // return () => {
    //   try {
    //     if (anchorRef?.current?.parentNode !== null) {
    //       anchorRef?.current?.parentNode.removeChild(appContainer);
    //     }
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
  }, [props.visible])

  return <div ref={anchorRef} />
}