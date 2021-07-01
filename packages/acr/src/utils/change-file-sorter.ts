import splitRetain from 'split-retain';
import { Path } from '@ali/ide-core-common/lib/path';

interface ItemDTO<T = any> {
  item: T;
  pathTokens: string[];
}

/**
 * 将变更文件进行排序
 * 将文件夹放到前面，文件放到后面
 */
export function sortPathList<T = any>(
  items: T[],
  iteratee: (item: T) => string,
  dirSeparator: string = Path.separator
): T[] {
  const itemDTOs = items.map((item) => getItemDTO<T>(item, iteratee, dirSeparator));

  return itemDTOs.sort(createItemDTOComparator(dirSeparator)).map((itemDTO) => itemDTO.item);
}

export function sortTwoPaths<T = any>(
  a: T,
  b: T,
  iteratee: (item: T) => string,
  dirSeparator: string = Path.separator
) {
  const aItemDTO = getItemDTO<T>(a, iteratee, dirSeparator);
  const bItemDTO = getItemDTO<T>(b, iteratee, dirSeparator);
  return createItemDTOComparator(dirSeparator)(aItemDTO, bItemDTO);
}

export function stringComparator(a: string, b: string): number;
export function stringComparator<T>(a: T, b: T, iteratee?: (item: T) => string): number;
export function stringComparator<T>(a: T, b: T, iteratee?: (item: T) => string): number {
  let aPath: string;
  let bPath: string;
  if (typeof iteratee === 'function') {
    aPath = iteratee(a);
    bPath = iteratee(b);
  } else {
    aPath = (a as unknown) as string;
    bPath = (b as unknown) as string;
  }
  // numeric 参数确保数字为第一排序优先级
  return aPath.localeCompare(bPath, 'kn', { numeric: true });
}

function getItemDTO<T>(item: T, iteratee: (item: T) => string, dirSeparator: string): ItemDTO<T> {
  const path = iteratee(item);
  return {
    item,
    pathTokens: splitRetain(path, dirSeparator),
  } as ItemDTO<T>;
}

function createItemDTOComparator(dirSeparator: string) {
  return (itemDTOa: ItemDTO, itemDTOb: ItemDTO) => {
    const pathTokensA = itemDTOa.pathTokens;
    const pathTokensB = itemDTOb.pathTokens;

    const tokensAIsAFolder = pathTokensA.includes(dirSeparator);
    const tokensBIsAFolder = pathTokensB.includes(dirSeparator);

    // 提前处理: 文件夹排在文件前面
    if (tokensAIsAFolder && !tokensBIsAFolder) {
      return -1;
    }

    if (!tokensAIsAFolder && tokensBIsAFolder) {
      return 1;
    }

    const tokensALens = pathTokensA.length;
    const tokensBLens = pathTokensB.length;
    const lens = Math.max(tokensALens, tokensBLens);
    for (let i = 0; i < lens; i++) {
      if (i > tokensALens) {
        return -1;
      }

      if (i > tokensBLens) {
        return 1;
      }

      const tokenA = pathTokensA[i].toLowerCase();
      const tokenB = pathTokensB[i].toLowerCase();

      if (tokenA === tokenB) {
        continue;
      }

      const tokenAIsAFolder = tokenA[tokenA.length - 1] === dirSeparator;
      const tokenBIsAFolder = tokenB[tokenB.length - 1] === dirSeparator;

      if (tokenAIsAFolder === tokenBIsAFolder) {
        return stringComparator(tokenA, tokenB);
      } else {
        // 文件夹排在文件前面
        return tokenAIsAFolder ? -1 : 1;
      }
    }

    return 0;
  };
}
