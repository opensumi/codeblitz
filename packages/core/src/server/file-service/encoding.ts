// TODO: 暂时只支持 utf8，引入 iconv-lite-umd 支持更多的编码，通过配置项懒加载资源

import { Buffer } from '../node';
import { URI } from '@ali/ide-core-common';
import { SUPPORTED_ENCODINGS } from '@ali/ide-core-common/lib/const';
import { EncodingInfo } from '@ali/ide-file-service/lib/common/encoding';

export const UTF8 = 'utf8';
export const UTF8_WITH_BOM = 'utf8bom';
export const UTF16BE = 'utf16be';
export const UTF16LE = 'utf16le';
export const UTF16BE_BOM = [0xfe, 0xff];
export const UTF16LE_BOM = [0xff, 0xfe];
export const UTF8_BOM = [0xef, 0xbb, 0xbf];

export function detectEncodingByBOMFromBuffer(buffer: Buffer | null): string | null {
  if (!buffer || buffer.length < 2) {
    return null;
  }

  const b0 = buffer.readUInt8(0);
  const b1 = buffer.readUInt8(1);

  // UTF-16 BE
  if (b0 === UTF16BE_BOM[0] && b1 === UTF16BE_BOM[1]) {
    return UTF16BE;
  }

  // UTF-16 LE
  if (b0 === UTF16LE_BOM[0] && b1 === UTF16LE_BOM[1]) {
    return UTF16LE;
  }

  if (buffer.length < 3) {
    return null;
  }

  const b2 = buffer.readUInt8(2);

  // UTF-8 BOM
  if (b0 === UTF8_BOM[0] && b1 === UTF8_BOM[1] && b2 === UTF8_BOM[2]) {
    return UTF8_WITH_BOM;
  }

  return null;
}

export function detectEncodingByBuffer(buffer: Buffer): string | null {
  // TODO:
  return UTF8;
}

export function detectEncodingByURI(uri: URI): string | null {
  // TODO:
  return UTF8;
}

export function getEncodingInfo(encoding: string | null): null | EncodingInfo {
  if (!encoding) {
    return null;
  }
  const result = SUPPORTED_ENCODINGS[encoding] || {};

  return {
    id: encoding,
    labelLong: result.labelLong || encoding,
    labelShort: result.labelShort || encoding,
  };
}

export function decode(buffer: Buffer, encoding: string): string {
  return buffer.toString(encoding as BufferEncoding);
}

export function encode(content: string, encoding: string, options?: { addBOM?: boolean }): Buffer {
  return Buffer.from(content, encoding as BufferEncoding);
}

export function encodingExists(encoding: string): boolean {
  return encoding === UTF8;
}

export function decodeStream(encoding: string | null): NodeJS.ReadWriteStream {
  throw new Error('not support decodeStream');
}

export function encodeStream(
  encoding: string,
  options?: { addBOM?: boolean }
): NodeJS.ReadWriteStream {
  throw new Error('not support encodeStream');
}
