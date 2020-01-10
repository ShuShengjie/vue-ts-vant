import AxiosHelper from '../helper/axiosHelper';
// tslint:disable-next-line: max-line-length
import { DcvSearchEventInfoDto, DcvEventInfoDto, AlarmYearTrendDto, TerminalQuantityDto, AlarmEventInfoDto } from './alarm_module';
import { pagination } from '../serverModules';
import { AlarmGroup } from '@/siteScript/alarm/AlarmModule';

export const ApiDefine_AlarmInfo_API = {
  getAlarmInfo: '/api/eventinfo/GetPageList',

  /**
   *  获取告警信息
   * @param {DcvSearchEventInfoDto} data 告警搜索信息
   * @param {pagination} page 分页器信息
   * @returns {Promise<DcvEventInfoDto>} 列表 分页信息
   */
  // tslint:disable-next-line: max-line-length
  Action_GetAlarmInfo(data: DcvSearchEventInfoDto, page: pagination): Promise<{ pagination: pagination, res: DcvEventInfoDto[] }> {
    return AxiosHelper.Post<{ pagination: pagination, res: DcvEventInfoDto[] }>(
      `${this.getAlarmInfo}/${page.current}/${page.per_page}`, data);
  },

  /**
   * 获取警告趋势
   * @returns {Promise<YearTrendDto>}
   */
  Action_GetChartsInfo(): Promise<AlarmYearTrendDto> {
    return AxiosHelper.GetRes<AlarmYearTrendDto>(this.getChartsInfo);
  },

