import { RequestOptionsInit, extend } from 'umi-request';
import { createApiError, successErrorMessage } from '../utils/api-error';
import { underscoreToCamelcase, camelcaseToUnderscore } from '../utils/camelcase-convert';
import qs from 'qs';

const fetch = extend({
  parseResponse: false,
});

const BASE_URL = '/code-test';

export interface RequestExtraOptions {
  disableBodyConvert?: boolean;
  disableResponseConvert?: boolean;
  getOriginalResponse?: boolean;
  notFoundRedirectReason?: string;
}

export async function request(
  url: string,
  options: RequestOptionsInit,
  extraOptions: RequestExtraOptions
) {
  if (options === undefined) {
    options = {};
  }
  // 请求带上cookie
  options.credentials = 'include';

  // 请求头带上web访问标记
  if (options.headers === undefined) {
    options.headers = {};
  }
  (options.headers as any)['LinkC-Request-Type'] = 'LINKC_WEB_REQUEST';
  (options.headers as any)['AntCode-Request-Type'] = 'ANTCODE_WEB_REQUEST';

  const charsetName = (options.params as any)?.charsetName;

  const query = qs.stringify(camelcaseToUnderscore(options.params), {
    addQueryPrefix: true,
    arrayFormat: 'brackets',
  });
  options.params = undefined;
  if (!extraOptions.disableBodyConvert) {
    options.data = camelcaseToUnderscore(options.data);
  }

  let response: any;
  try {
    response = await fetch(BASE_URL + url + query, options);
  } catch (e: any) {
    throw createApiError(e.message);
  }
  const data = await checkStatus(
    response,
    charsetName,
    extraOptions.getOriginalResponse,
    extraOptions.notFoundRedirectReason
  );
  // 兼容一些报错提示
  successErrorMessage(data);

  if (extraOptions.disableResponseConvert) {
    return data;
  } else {
    return underscoreToCamelcase<any>(data);
  }
}

async function checkStatus(
  response: any,
  charsetName?: string,
  returnOriginal?: boolean,
  notFoundRedirectReason?: string
) {
  if (response.status === 204) {
    return null;
  }

  if (response.status === 401) {
    window.open('http://code.test.alipay.net');
    return;
  }

  if (response.status === 404 && notFoundRedirectReason) {
    window.location.replace(`/404?reason=${notFoundRedirectReason}`);
  }

  if (returnOriginal) {
    return response;
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e: any) {
      throw createApiError(e.message, response);
    }
  } else {
    if (charsetName === 'GBK') {
      const blob = await response.blob();
      data = await readBlobAsGBK(blob);
    } else {
      data = await response.text();
    }
  }
  if (!response.ok) {
    throw createApiError(data?.message, response);
  }
  if (response.headers.has('X-Total')) {
    const total = parseInt(response.headers.get('X-Total'), 10);
    return { total, list: data };
  } else {
    return data;
  }
}

function readBlobAsGBK(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(blob, 'gbk');
  });
}
