import { message as messageTip } from 'antd';
export interface ApiError extends Error {
  isApiError: true;
  response: Response;
}

export function createApiError(message: string = '请求出错', response?: Response) {
  const err = new Error(message) as ApiError;
  err.isApiError = true;
  err.response = response!;
  return err;
}

export function isApiError(e: any): e is ApiError {
  return e?.isApiError;
}
/**
 * 目前存在一些请求成功也报错的情况
 * 返回值可能情况
 * 1. success === true 此时只提示有 errorMessage 的情况
 * 2. success === false 此时提示包括 message 的信息
 * todo: 目前由于intl使用的是react component注入的方式，这里暂时无法做到国际化，后续等移除 konjac 之后采用全局api方式即可支持国际化
 * @param responseData 返回值，各种可能
 */
export function successErrorMessage(responseData: any) {
  if (responseData) {
    const errorMessage = responseData.error || responseData.errorMessage;
    const message = errorMessage || responseData.message;
    if (responseData.success === false && message) {
      messageTip.error(message);
    } else if (errorMessage) {
      messageTip.error(errorMessage);
    }
  }
}
