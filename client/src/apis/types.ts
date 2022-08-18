/**
 * 通用 Api 返回结构
 */
export interface ApiRes<T = unknown> {
  /** 错误码 0 为正常，非 0 为失败 */
  errCode: number;
  /** 错误信息 errCode 为 0 是为空 */
  errMsg: string;
  /** 实际返回信息 */
  data: T | null;
}
