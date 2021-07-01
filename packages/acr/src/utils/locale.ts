export const getLocale = () => (document.cookie.indexOf('LOCALE=en_US') > -1 ? 'en-US' : 'zh-CN');
