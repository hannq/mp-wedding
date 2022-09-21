import { getSystemInfoSync } from '@tarojs/taro';
import { SizeType, LARGE_IMG_WINDOW_SIZE_RATIO, MEDIUM_IMG_WINDOW_SIZE_RATIO } from './constants';

/**
 * 获取指定值在给定列表内最近的值
 * @param value 给定制
 * @param list 可选列表
 */
export function getNearestValue<T extends number>(value: number, list: T[]): T {
  return list
    .map(item => ({ raw: item, delta: Math.abs(item - value) }))
    .sort((a, b) => a.delta - b.delta)[0].raw;
}

const { windowWidth, windowHeight } = getSystemInfoSync();
const currentWindowSizeRatio = windowWidth / windowHeight;
const typeMap: Record<number, SizeType> = {
  [LARGE_IMG_WINDOW_SIZE_RATIO]: SizeType.LARGE,
  [MEDIUM_IMG_WINDOW_SIZE_RATIO]: SizeType.MEDIUM,
}
const currentSuitableImageSize = typeMap[getNearestValue(currentWindowSizeRatio, [LARGE_IMG_WINDOW_SIZE_RATIO, MEDIUM_IMG_WINDOW_SIZE_RATIO])]

/**
 * 获取当前屏幕横纵比分类
 */
export function getSuitableWindowSizeType(): SizeType {
  return currentSuitableImageSize
}

/**
 * 根据屏幕横纵比选择合适的图片
 * @param imgSizeMap
 * @returns
 */
export function getSuitableImg(imgSizeMap: Record<SizeType, string>): string {
  return imgSizeMap[currentSuitableImageSize]
}
