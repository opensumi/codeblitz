import { request, RequestExtraOptions } from './request';

export const apiService = {
  get(url: string, query?: { [key: string]: any }, options: RequestExtraOptions = {}) {
    return request(
      url,
      {
        method: 'GET',
        params: query,
      },
      options
    );
  },

  post(
    url: string,
    query?: { [key: string]: any },
    body?: string | object,
    options: RequestExtraOptions = {}
  ) {
    return request(
      url,
      {
        method: 'POST',
        params: query,
        data: body,
      },
      options
    );
  },

  put(
    url: string,
    query?: { [key: string]: any },
    body?: string | object,
    options: RequestExtraOptions = {}
  ) {
    return request(
      url,
      {
        method: 'PUT',
        params: query,
        data: body,
      },
      options
    );
  },

  delete(url: string, query?: { [key: string]: any }, options: RequestExtraOptions = {}) {
    return request(
      url,
      {
        method: 'DELETE',
        params: query,
      },
      options
    );
  },
};
