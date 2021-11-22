import { RequestOptionsInit } from 'umi-request';
import qs from 'qs';
import { underscoreToCamelcase } from './util';

// copied from antcode repo
interface ApiError extends Error {
  isApiError: true;
  response?: Response;
}

export interface RequestExtraOptions {
  disableBodyConvert?: boolean;
  disableResponseConvert?: boolean;
}

function createApiError(message = '请求出错', response?: Response) {
  const err = new Error(message) as ApiError;
  err.isApiError = true;
  err.response = response;
  return err;
}

export async function request(
  url: string,
  options: RequestOptionsInit,
  extraOptions?: RequestExtraOptions
) {
  if (options === undefined) {
    options = {};
  }
  // 请求带上cookie
  options.credentials = 'include';

  // 请求头带上web访问标记
  if (options.headers === undefined) {
    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  if (options.data !== undefined) {
    options.body = JSON.stringify(options.data);
    delete options.data;
  }

  options.headers['LinkC-Request-Type'] = 'LINKC_WEB_REQUEST';
  options.headers['AntCode-Request-Type'] = 'ANTCODE_WEB_REQUEST';

  const charsetName = (options.params as any)?.charsetName;

  const query = qs.stringify(options.params, {
    addQueryPrefix: true,
    arrayFormat: 'brackets',
  });
  options.params = undefined;

  let response: any;
  try {
    response = await fetch(url + query, options);
  } catch (e: any) {
    throw createApiError(e.message);
  }

  const data = await checkStatus(response, charsetName);
  if (extraOptions?.disableResponseConvert) {
    return data;
  } else {
    return underscoreToCamelcase<any>(data);
  }
}

async function checkStatus(response: any, charsetName?: string) {
  if (response.status === 204) {
    return null;
  }

  if (response.status === 401) {
    // 打开去登陆
    window.open('http://code.test.alipay.net/');
    return;
  }
  let data: any = null;
  const contentType = response.headers?.get('content-type');
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
