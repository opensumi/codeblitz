export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

export interface RequestOptions extends RequestInit {
  data?: any;
  params?: Record<string, any> | URLSearchParams;
  baseURL?: string;
  headers?: Record<string, string>;
  responseType?: ResponseType;
}

export interface Request {
  <T = any>(url: string, options?: RequestOptions): Promise<T>;
  get: Request;
  post: Request;
  delete: Request;
  put: Request;
  patch: Request;
  head: Request;
  options: Request;
}

export class RequestError extends Error {
  constructor(name: string, message: string, public response: Response) {
    super(message);
    this.name = name;
  }
}

const toString = Object.prototype.toString;

const requestImpl: any = async (url: string, options: RequestOptions) => {
  const { data, params, responseType, baseURL, ...requestInit } = options;

  requestInit.method = options.method ? options.method.toUpperCase() : 'GET';
  requestInit.credentials = requestInit.credentials || 'same-origin';

  const headers = requestInit.headers || {};

  if (baseURL) {
    url = `${baseURL}${url}`;
  }

  if (params) {
    const queryString = serialize(params);
    if (queryString) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + queryString;
    }
  }

  if (['post', 'put', 'patch', 'delete'].indexOf(requestInit.method.toLowerCase()) > -1 && data) {
    if (toString.call(data) === '[object Object]') {
      requestInit.body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json;charset=utf-8';
    } else if (typeof data === 'string') {
      requestInit.body = data;
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    requestInit.headers = headers;
  }

  const response = await fetch(url, requestInit);

  if (response.status >= 200 && response.status < 300) {
    try {
      if (responseType) {
        return response[responseType]();
      } else {
        return response as any;
      }
    } catch (err) {
      throw new RequestError('ParseError', String(err?.message || ''), response);
    }
  }

  throw new RequestError('ResponseError', 'http error', response);
};

const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
METHODS.forEach((method) => {
  requestImpl[method] = (url: string, options: RequestOptions) =>
    request(url, { ...options, method });
});

export const request: Request = requestImpl;

function serialize(obj: any) {
  if (!obj || typeof obj !== 'object') return '';
  const pairs: string[] = [];
  Object.keys(obj).forEach(function (key) {
    let val = obj[key];
    if (val === null || typeof val === 'undefined') {
      return;
    }

    if (toString.call(val) !== '[object Array]') {
      val = [val];
    }

    val.forEach(function (v) {
      if (toString.call(v) === '[object Date]') {
        v = v.toISOString();
      } else if (typeof v === 'object') {
        v = JSON.stringify(v);
      }
      pairs.push(decodeURIComponent(key) + '=' + decodeURIComponent(v));
    });
  });
  return pairs.join('&');
}
