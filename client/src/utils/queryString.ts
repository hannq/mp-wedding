/**
 * 解析 queryString 字符串
 * @param string 需要被解析的字符串
 */
export function parse<T extends Record<string, string>>(str: string): T {
  str = str.startsWith('?') ? str.slice(1) : str;
  return str
    .split('&')
    .filter(Boolean)
    .reduce((acc, kvChunk) => {
      const [k, v = ''] = kvChunk.split('=');
      // @ts-ignore
      acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as T);
}
