import { RawContextKey } from '@ali/ide-core-browser/lib/raw-context-key';

// 根元素 id
export const RootElementId = 'antcode-cr';

export const ACR_IS_HIGHLIGHT = new RawContextKey<boolean>('acr.isHighlighted', false);
export const ACR_IS_FULLSCREEN = new RawContextKey<boolean>('acr.isFullscreen', false);
