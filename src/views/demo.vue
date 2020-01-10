import BaseVue from '@/kernel/baseVue/BaseVue';
import { Component } from 'vue-property-decorator';
import DataSelection from '@/components/dataSelection/DataSelection.vue';
import DataSelectionView from '@/components/dataSelection/DataSelection';
import { AlarmType, AlarmSearchInfo } from '@/siteScript/alarm/AlarmModule';
import AlarmController from '@/siteScript/alarm/AlarmController';
import { ViewTableList } from '@/siteScript/UtilModule';
import { DcvEventInfoDto } from '@/server/alarm/alarm_module';
import TimeUtils from '@/kernel/TimeUtils';
@Component({
  components: {
    DataSelection,
  },
  name: 'AlarmInformation',
})
export default class AlarmInformationView extends BaseVue {
  protected TimeUtils: TimeUtils = TimeUtils;
  // 搜索表单
  private alarmForm: AlarmSearchInfo = new AlarmSearchInfo();

  // 告警级别列表
  private alarmTypes = AlarmType;

  // 告警状态
  private alarmStatus: string[] = [];

  // 告警信息
  private alarmData: ViewTableList<DcvEventInfoDto> = new ViewTableList<DcvEventInfoDto>();


  // 组件实例存储
  private dataSelectionView: DataSelectionView = null;

  // 表格列设置
  private columns = [
    {
      title: '序号',
      type: 'index',
      align: 'center',
    },
    {
      title: 'IP地址',
      key: 'host',
      align: 'center',
    },
    {
      title: '告警级别',
      key: 'level',
      slot: 'level',
      align: 'center',
    },
    {
      title: '主机分组',
      key: 'type',
      align: 'center',
    },
    {
      title: '告警发生时间',
      key: 'arrivaltime',
      slot: 'arrivaltime',
      align: 'center',
    },
    {
      title: '最近检查时间',
      key: 'modifytime',
      slot: 'modifytime',
      align: 'center',
    },
    {
      title: '告警内容',
      key: 'msg',
      align: 'center',
    },
    {
      title: '告警状态',
      key: 'status',
      align: 'center',
    },
  ];

  private mounted() {
    this.getStatus();

    this.dataSelectionView = this.FindRef<DataSelectionView>('dataSelection');
    this.searchAlarm();
    // this.getPageSize();
  }

  /**
   * 获取告警状态
   * @private
   * @returns {Promise<void>}
   * @memberof AlarmInformationView
   */
  private async getStatus(): Promise<void> {
    this.alarmStatus = await AlarmController.Inst.getAlarmStates();
  }

  /**
   * 获取告警信息
   * @private
   * @memberof AlarmInformationView
   */
  private async getAlarmInfo() {
    this.alarmData = await AlarmController.Inst.getAlarmInfo(this.alarmForm, this.alarmData.pagenation);
  }

  /**
   * 搜索
   * @private
   * @memberof AlarmInformationView
   */
  private searchAlarm() {
    this.changeAlarmPage(1);
  }

  /**
   * 重置
   * @private
   * @memberof AlarmInformationView
   */
  private resetAlarmInfo() {
    this.alarmForm = new AlarmSearchInfo();
    // this.dataSelectionView.setSelcted(this.dataSelectionView.time[0]);
    this.dataSelectionView.setSelcted('');
  }

  /**
   * 时间控件
   * @private
   * @param {number[]} date
   * @memberof AlarmInformationView
   */
  private selectedTime(date: number[]): void {
    this.alarmForm.HappenStartTime = date[1];
    this.alarmForm.HappenEndTime = date[0];
    this.changeAlarmPage(1);
  }

  /**
   * 分页器改变页数
   */
  private changeAlarmPage(page: number) {
    this.alarmData.pagenation.current = page;
    this.getAlarmInfo();
    // let current = document.querySelector('.ivu-page-simple .ivu-page-simple-pager input');
    // this.computePageWidth(current);
  }
  // // 分页宽度
  // private getPageSize() {
  //   let page = document.querySelector('.ivu-page-simple .ivu-page-simple-pager input');
  //   page.addEventListener('input', function(this: any) {
  //     this.computePageWidth(page);
  //   });
  // }
  // // 计算宽度
  // private computePageWidth(page: any) {
  //   let textLength = (<any> page).value.toString().length;
  //   let pageWidth = textLength > 0 ? 26 + (textLength - 1) * 8 : 26;
  //   (<any> page).style.width = pageWidth + 'px';
  //   if ((<any> page).value.toString() === '') {
  //     (<any> page).value = 1;
  //   }
  // }
}
