import { ApiDefine_AlarmInfo_API } from '@/server/alarm/alarm_api';
import { DcvSearchEventInfoDto, DcvEventInfoDto, AlarmEventInfoDto } from '@/server/alarm/alarm_module';
import { pagination } from '@/server/serverModules';
import { copyObjWhenKeyEqual } from '@/kernel/util';
import TimeUtils from '../../kernel/TimeUtils';
import { ViewTableList } from '../UtilModule';
import { AlarmSearchInfo, ActialAlarmGroup, AlarmYearTrend, TerminalQuantity } from './AlarmModule';


export default class AlarmController {
  public static get Inst(): AlarmController {
    if (this._inst == null) {
      this._inst = new AlarmController();
    }
    return this._inst;
  }
  private static _inst: AlarmController;

  /**
   * 获取告警信息
   * @param {AlarmSearchInfo} data 搜索信息
   * @param {pagination} page 分页器信息
   * @returns {Promise<AlarmInfo>}
   * @memberof AlarmController
   */
  public async getAlarmInfo(data: AlarmSearchInfo, page: pagination): Promise<ViewTableList<DcvEventInfoDto>> {
    let postData = copyObjWhenKeyEqual<DcvSearchEventInfoDto, AlarmSearchInfo>(new DcvSearchEventInfoDto(), data);
    if (data.CheckTimeRange.length >= 2) {
      let startTime = data.CheckTimeRange[0];
      let endTime = data.CheckTimeRange[1];

      postData.CheckStartTime = startTime ? TimeUtils.GetZeroTimestamp(new Date(startTime)) : 0;
      postData.CheckEndTime = endTime ? TimeUtils.GetZeroTimestamp(new Date(endTime)) + 24 * 60 * 60 - 1 : 0;
    }
    let info = await ApiDefine_AlarmInfo_API.Action_GetAlarmInfo(postData, page);
    return new ViewTableList<DcvEventInfoDto>(info.pagination, info.res);
  }

  /**
   *  获取告警状态
   * @returns {Promise<string[]>}
   * @memberof AlarmController
   */
  public async getAlarmStates(): Promise<string[]> {
    return await ApiDefine_AlarmInfo_API.Action_GetAlarmStates();
  }
 
}
