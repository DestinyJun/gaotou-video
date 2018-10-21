import {
  Component,
  ComponentFactoryResolver, OnDestroy,
  OnInit,
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxEchartsService} from 'ngx-echarts';
import {EventsService} from '../../common/services/events.service';
import {Data3dService} from '../../common/services/data3d.service';
import {CentermapService} from '../../common/services/centermap.service';
import {DiagramService} from '../../common/services/diagram.service';
import {Router} from '@angular/router';
import {DataService} from '../../common/services/data.service';
import {ConfigModule, WenjunAlertService} from '../../common/wenjun';
import {CityDataService} from '../../common/services/city-data.service';
import {LocalStorageService} from '../../common/services/local-storage.service';

declare let BMap;
declare let BMapLib;

interface CarExportType {
  carNumType: string;
  carArea: string;
  carDate: string;
}
interface IncomeExportType {
  incomeNumType: string;
  incomeArea: string;
  incomeDate: string;
}
interface Bar3dExportType {
  Bar3dNumType: string;
  Bar3dArea: string;
  Bar3dDate: string;
}


@Component({
  selector: 'app-city-data',
  templateUrl: './city-data.component.html',
  styleUrls: ['./city-data.component.css']
})
export class CityDataComponent implements OnInit, OnDestroy {
  /***********************基础信息************************/
  // 组件销毁后清除时钟任务
  public clearTime: any;
    // 实时客流量
  public personNum = 10000;
  public persons = [];
  /****************************左边***************************/
    // 3D柱状图配置
  public options3d = {};
  public options3dArray: any;
  // 3D柱状图弹窗
  public alertBarShow = false;
  public alertBarTitle: string;
  public options3dBar = {};
  public options3dBarInstance: any;
  public options3dPie = {};
  public options3dPieInstance: any;
  public colorList = [
    '#356981', '#356981', '#356981', '#356981', '#356981', '#356981',
    '#356981', '#356981', '#356981', '#356981', '#356981 ', '#356981'
  ];
  public arryPie = [];
  public bar3dExcelShow = false;
  public bar3dExportType: Bar3dExportType;

  // 车流量实时数值
  public vehicleAmount = [];
  public incomeAmount = [];

  // 车辆类型分布
  public optionsCarModel = {};
  // 车辆类型弹窗
  public alertCarShow = false;
  public alertCarTitle = '总数';
  public optionsCarType = {};
  public arryCarPie = [];
  public carTableData: any;
  public carAreaName = '贵阳市';
  public optionsCarPieInstance: any;
  public carExcelShow = false;
  public carExportType: CarExportType;
  public CarTypeisShow = true;

  /*****************************中部**************************/
    // 省市联动
  public dataToggle = '贵阳市';
  public selectDate = '贵州省贵阳市';
  public province: any;
  public city: any;
  public citeDate: string;
  public provinceShow = false;
  public cityShow = false;
  public flag: string;

  // 弹出框的标题及显影控制
  public alertMapBoxShow = true;
  public alertMapTitle: string;
  public alertDateBoxShow = true;
  public alertDateTitle: string;

  // 全国高速服务区分布图
  public optionsMap = {};

  // 事件类数据
  public eventTypes: any;
  // 事件弹窗
  public eventConfig: ConfigModule;
  // 办公类数据
  public officeTypes: any;
  // 办公信息弹窗
  public alertOfficeShow = false;
  // 个人信息数据
  public personOfficeTypes: any;
  // 个人信息弹窗
  public alertPersonShow = false;

  /*****************************右边***************************/
    // 全国业态经营数据前十排名
  public crosswiseBar = {};
  public barStatus1 = true;
  public barStatus2 = false;
  public barStatus3 = false;
  public dataStatus = '业态收入/万元';

  // 全国当日收入类型占比分析
  public optionsIncomeModel = {};
  // 收入类型弹窗
  public alertIncomeShow = false;
  public alertIncomeTitle = '收入总数';
  public optionsIncomeTypes = {};
  public IncomeAreaName = '贵阳市';
  public IncomeTableData: any;
  public arryIncomePie = [];
  public incomeExcelShow = false;
  public incomeExportType: IncomeExportType;
  public incomeTypeisShow = true;

  /**********************基础数据部分**********************/
  public citys = ['久长服务区', '石阡服务区', '虹桥服务区', '玉屏服务区', '荔波服务区', '六枝服务区', '盘县服务区', '红果服务区', '老马服务区', '乌江服务区'];
  // 时间初始化
  public rangeDates: Date[];
  public minDate: Date;
  public maxDate: Date;
  public esDate: any;
  public invalidDates: Array<Date>;
  public value: Date; // 时间选择器
  public date6: Date;
  /**********************暂时不知道的分布**********************/
    // 当日服务区停车量排名
  public optionsRetention = {};
  // 服务区当日收入排名
  public optionsIncome = {};
  // 服务区地图分布
  public mapName = 'china';
  public mapCenter = [101.74, 36.56];
  public mapZoom = 0.8;
  public mapLeft = '';
  public mapRight = '';
  // 图表加载状态状态:+
  public echartsIntance: any;
  // 车月度所有服务区车辆流量柱状图统计
  public optionsCar = {};

  constructor(
    private http: HttpClient,
    private es: NgxEchartsService,
    private eventsService: EventsService,
    private resolver: ComponentFactoryResolver,
    private data3dS: Data3dService,
    private centerMapS: CentermapService,
    private diagrams: DiagramService,
    private dataService: DataService,
    public router: Router,
    private wenJunAlertService: WenjunAlertService,
    private cityDataService: CityDataService,
    private localService: LocalStorageService
  ) {}

  ngOnInit() {
    // 时间初始化
    this.esDate = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      today: '今天',
      clear: '清除'
    };
    // 发射也太数据名称
    this.localService.eventBus.next({title: '贵阳市高速业态大数据',  flagState: 'city', flagName: this.dataToggle});
    // 导出表格数据初始化
    this.bar3dExportType = {
      Bar3dNumType: '',
      Bar3dArea: '',
      Bar3dDate: ''
    };
    this.carExportType = {
      carNumType: '',
      carArea: '',
      carDate: ''
    };
    this.incomeExportType = {
      incomeNumType: '',
      incomeArea: '',
      incomeDate: ''
    };
    this.amount();
    // 图表更行
    this.updataEcharts();
    // 全屏点击事件
    window.document.addEventListener('click', (e) => {
      this.flag = e.srcElement.parentElement.className;
      if ((this.provinceShow || this.cityShow) && !(this.flag === 'location')) {
        this.provinceShow = false;
        this.cityShow = false;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.clearTime) {
      clearInterval(this.clearTime);
    }
  }

  /**********************************左边*****************************/
  // 3D柱状图图表配置
  public packOption3() {
    this.data3dS.get3dData().subscribe(
      (value) => {
        this.options3dArray = value;
        const hours = this.options3dArray.hours;
        const days = this.options3dArray.days;
        this.options3d = {
          /*title: [
            {
              text: this.dataToggle + this.options3dArray.data3dTitle,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],*/
          tooltip: {
            show: true,
            trigger: 'item',
            axisPointer: {
              type: 'cross',
              axis: 'auto',
            },
            formatter: function (params) {
              let res = `<p>${hours[params.value[0]]}:</p>`;
              res += `<p style='margin-left:3px'>${days[params.value[1]]}:${params.value[2]}%</p>`;
              return res;
            }
          },
          /*visualMap: {
            max: 100,
            show: false,
            inRange: {
              color: this.options3dArray.colorData
            }
          },*/
          xAxis3D: {
            type: 'category',
            name: '月份',
            data: this.options3dArray.hours,
            splitLine: {show: false},
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          yAxis3D: {
            type: 'category',
            data: this.options3dArray.days,
            name: '类型',
            splitLine: {show: false},
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          zAxis3D: {
            type: 'value',
            name: '%',
            splitLine: {show: false},
            nameTextStyle: {
              top: '3%',
              left: '5%',
              show: false,
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          grid3D: {
            boxWidth: 200,
            boxDepth: 80,
            light: {
              main: {
                intensity: 1.2
              },
              ambient: {
                intensity: 0.3
              }
            },
            viewControl: {
              distance: 350,
            }
          },
          series: [
            {
              type: 'bar3D',
              barWidth: 30, // 柱图宽度
              data: this.data3dS.data3dFac().map(function (item) {
                return {
                  value: [item[0], item[1], item[2]]
                };
              }),
              // 柱状图阴影
              shading: 'lambert',
              label: {
                // 柱状图的数值是否显示
                show: false,
                textStyle: {
                  fontSize: 16,
                  borderWidth: 1
                }
              },
              // 柱状图主子的样式
              itemStyle: {
                opacity: 0.9,
                color: function (params) {
                  return ['#9B90D5', '#46E7E2', '#78F991', '#0B38D8', '#027405'][params.value[1]];
                },
              },
              emphasis: {
                label: {
                  textStyle: {
                    fontSize: 20,
                    color: '#900'
                  }
                },
                itemStyle: {
                  color: '#900'
                }
              }
            }
          ]
        };
      }
    );
  }
  // 3D柱状图的相关点击事件
  public barClick(e): void {
    const that = this;
    document.body.className = 'ui-overflow-hidden';
    this.alertBarShow = true;
    const yType = ['经营收入', '客流量', '车流量', '用水量', '用电量'];
    this.colorList = [
      '#356981', '#356981', '#356981', '#356981', '#356981', '#356981',
      '#356981', '#356981', '#356981', '#356981', '#356981 ', '#356981'
    ];
    this.colorList[e.data.value[0]] = '#D43839';
    const yAxis = e.data.value[1];
    this.alertBarTitle = yType[yAxis];
    const barData = this.dataService.get3dOption(12);
    const pieDataName = barData[e.data.value[0]];
    this.arryPie = [];
    this.dataService.getrandomPie(9, 1000, 200).map((val, index) => {
      this.arryPie.push({value: val, name: this.citys[index]});
    });
    function types(value): string {
      let typeValue = '';
      switch (value) {
        case 0:
          typeValue = yType[0];
          break;
        case 1:
          typeValue = yType[1];
          break;
        case 2:
          typeValue = yType[2];
          break;
        case 3:
          typeValue = yType[3];
          break;
        case 4:
          typeValue = yType[4];
          break;
      }
      return typeValue;
    }

    this.options3dBar = {
      title: [
        {
          text: `${this.dataToggle}所有服务区年度${types(yAxis)}统计`,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
      ],
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '5%',
        right: '3%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        splitLine: {show: false},
        nameTextStyle: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        },
      },
      yAxis: {
        type: 'value',
        name: '数值',
        splitLine: {show: false},
        nameTextStyle: {
          align: 'left',
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        },
      },
      series: [
        {
          data: barData,
          type: 'bar',
          label: {
            // 柱状图的数值是否显示
            show: true,
            textStyle: {
              fontSize: 16,
              borderWidth: 1
            }
          },
          itemStyle: {
            color: function (params) {
              return that.colorList[params.dataIndex];
            },
          }
        }]
    };
    // 类型占比统计
    this.options3dPie = {
      title: {
        text: `${this.dataToggle}各县服务区年度${types(yAxis)}类型占比统计`,
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      /*legend: {
        orient: 'vertical',
        left: 'left',
        data: ['贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔东南苗族侗族自治州', '黔南布依族苗族自治州','黔西南布依族苗族自治州'],
        textStyle: {
          color: 'white'
        }
      },*/
      series: [
        {
          name: `${types(yAxis)}总计：${pieDataName}`,
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: this.arryPie,
          itemStyle: {
            color: function (params) {
              return ['#D43839', '#3B4F74', '#7BEBDF', '#01FFCC', '#09D5D6', '#3C75BA', '#2407EF', '#2796C4', '#676AB1'][params.dataIndex];
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  public closeBarShow() {
    document.body.className = '';
    this.alertBarShow = false;
  }
  // 3D柱状图弹窗操作
  public options3dBarInit(ec) {
    this.options3dBarInstance = ec;
  }
  public options3dPieInit(ec) {
    this.options3dPieInstance = ec;
  }
  public options3dBarClick(e) {
    this.colorList = [
      '#356981', '#356981', '#356981', '#356981', '#356981', '#356981',
      '#356981', '#356981', '#356981', '#356981', '#356981 ', '#356981'
    ];
    this.colorList[e.dataIndex] = '#D43839';
    this.options3dBarInstance.setOption(this.options3dBar);
    this.arryPie = [];
    this.dataService.getrandomPie(9, 1000, 200).map((val, index) => {
      this.arryPie.push({value: val, name: this.citys[index]});
    });
    this.options3dPie = {
      title: {
        text: `贵州省各市所有服务区年度${e.name}类型占比统计`,
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {d}%'
      },
      /*legend: {
        orient: 'vertical',
        left: 'left',
        data: ['贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔东南苗族侗族自治州', '黔南布依族苗族自治州','黔西南布依族苗族自治州'],
        textStyle: {
          color: 'white'
        }
      },*/
      series: [
        {
          name: `${e.name}总计：${e.value}`,
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: this.arryPie,
          itemStyle: {
            color: function (params) {
              return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  public options3dPieClick(e): void {
    this.router.navigate(['/home/serzone', {name: e.name}]);
  }
  // 表格导出
  public bar3dDateChange(e) {
    this.bar3dExportType.Bar3dDate = e.srcElement.value;
  }
  public bar3dTypeChange(e) {
    this.bar3dExportType.Bar3dNumType = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public bar3dAreaChange(e) {
    this.bar3dExportType.Bar3dArea = e.srcElement.options[e.srcElement.selectedIndex].innerText;
    console.log(this.bar3dExportType.Bar3dArea);
  }
  public bar3dExportClick() {
    if (!(this.bar3dExportType.Bar3dDate === '') || !(this.bar3dExportType.Bar3dNumType === '') || !(this.bar3dExportType.Bar3dArea === '')) {
      this.bar3dExcelShow = false;
      console.log(this.bar3dExportType);
      // 导出表格数据初始化
      this.bar3dExportType = {
        Bar3dNumType: '',
        Bar3dArea: '',
        Bar3dDate: ''
      };
    } else {
      window.alert('请把数据选择全在提交');
    }
  }
  public open3dBarExcel() {
    this.bar3dExcelShow = true;
  }
  public close3dBarExcel() {
    this.bar3dExcelShow = false;
  }

  // 车型日分布类型占比饼状图
  public CarTypes() {
    this.diagrams.getCarTypes().subscribe(
      (value) => {
        this.optionsCarModel = {
          /*title: [
            {
              text: this.dataToggle + value.title,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],*/
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {d}%'
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {d}%',
                color: 'white',
                align: 'center',
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: 12
                  }
                }
              },
              color: ['#00CAE2', '#2307EF', '#4791D8'],
              data: value.data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
      }
    );
  }
  // 车型日分布类型占比饼状图相关点击事件
  public parkClick(e): void {
    this.alertCarShow = true;
    document.body.className = 'ui-overflow-hidden';
    this.arryCarPie = [];
    this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
      this.arryCarPie.push({value: val, name: this.citys[index]});
    });
    this.optionsCarType = {
      title: {
        text: `${this.dataToggle}各县所有服务区今日${e.name}占比统计`,
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {d}%'
      },
      series: [
        {
          name: `${e.name}`,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.arryCarPie,
          itemStyle: {
            color: function (params) {
              return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
  }
  public closeCarShow(): void {
    document.body.className = '';
    this.alertCarShow = false;
  }
  // 车型日分布类型占比饼状图弹窗
  public optionsCarPieInit(ec): void {
    this.optionsCarPieInstance = ec;
  }
  public optionsCarPieClick(e) {
    // this.carAreaName = e.name;
    this.router.navigate(['/home/serzone', {name: e.name}]);
    this.CarTypeisShow = false;
    // this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
  }
  public carBtnClick(e): void {
    if (e.srcElement.innerText === '小车') {
      this.alertCarTitle = '小车';
      this.arryCarPie = [];
      this.carTableData = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryCarPie.push({value: val, name: this.citys[index]});
      });
      this.optionsCarType = {
        title: {
          text: `${this.dataToggle}各县所有服务区今日${this.alertCarTitle}占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertCarTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryCarPie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
    } else if (e.srcElement.innerText === '总数') {
      this.alertCarTitle = '总数';
      this.arryCarPie = [];
      this.carTableData = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryCarPie.push({value: val, name: this.citys[index]});
      });
      this.optionsCarType = {
        title: {
          text: `${this.dataToggle}各县所有服务区今日${this.alertCarTitle}占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertCarTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryCarPie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
    } else if (e.srcElement.innerText === '客车') {
      this.alertCarTitle = '客车';
      this.arryCarPie = [];
      this.carTableData = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryCarPie.push({value: val, name: this.citys[index]});
      });
      this.optionsCarType = {
        title: {
          text: `${this.dataToggle}各县所有服务区今日${this.alertCarTitle}占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertCarTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryCarPie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
    } else if (e.srcElement.innerText === '货车') {
      this.alertCarTitle = '货车';
      this.arryCarPie = [];
      this.carTableData = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryCarPie.push({value: val, name: this.citys[index]});
      });
      this.optionsCarType = {
        title: {
          text: `${this.dataToggle}各县所有服务区今日${this.alertCarTitle}占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertCarTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryCarPie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
    }
  }
  public carTableClick(e) {
    this.router.navigate(['/home/serzone', {name: e}]);
  }
  public echartBtn(e): void {
    this.CarTypeisShow = true;
    this.carAreaName = e.srcElement.innerText;
    this.arryCarPie = [];
    this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
      this.arryCarPie.push({value: val, name: this.citys[index]});
    });
    this.optionsCarType = {
      title: {
        text: `贵州省各市所有服务区今日${e.name}占比统计`,
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {d}%'
      },
      series: [
        {
          name: `${e.name}`,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.arryCarPie,
          itemStyle: {
            color: function (params) {
              return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
  }
  // 表格导出
  public carDateChange(e) {
    this.carExportType.carDate = e.srcElement.value;
  }
  public carTypeChange(e) {
    this.carExportType.carNumType = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public carAreaChange(e) {
    this.carExportType.carArea = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public carExportClick() {
    if (!(this.carExportType.carDate === '') || !(this.carExportType.carNumType === '') || !(this.carExportType.carArea === '')) {
      this.carExcelShow = false;
      console.log(this.carExportType);
      // 导出表格数据初始化
      this.carExportType = {
        carNumType: '',
        carArea: '',
        carDate: ''
      };
    } else {
      window.alert('请把数据选择全在提交');
    }
  }
  public openCarExcel() {
    this.carExcelShow = true;
  }
  public closeCarExcel() {
    this.carExcelShow = false;
  }

  /*********************************中部*****************************/
  // 中部服务区分布图
  public centerMap() {
    this.centerMapS.getCenterMapData().subscribe(
      (value) => {
        const convertData = function (datas) {
          const res = [];
          for (let i = 0; i < datas.length; i++) {
            const geoCoord = value.geoCoordMap[datas[i].name];
            if (geoCoord) {
              res.push({
                name: datas[i].name,
                value: geoCoord.concat(datas[i].value)
              });
            }
          }
          return res;
        };
        const convertedData = [
          convertData(value.data),
          convertData(value.data.sort(function (a, b) {
            return b.value - a.value;
          }).slice(0, 6))
        ];
        this.optionsMap = {
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicInOut',
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'cubicInOut',
          backgroundColor: '#04243E',
          title: [
            {
              text: this.dataToggle + value.title,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
            {
              id: 'statistic',
              right: 120,
              top: 40,
              width: 100,
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            }
          ],
          toolbox: {
            iconStyle: {
              normal: {
                borderColor: '#fff'
              },
              emphasis: {
                borderColor: '#b1e4ff'
              }
            }
          },
          geo: {
            map: value.address,
            left: 'center',
            // right: 'center',
            center: value.center,
            zoom: 1.3,
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },
          tooltip: {
            trigger: 'item'
          },
          /*grid: {
            right: 40,
            top: 100,
            bottom: 40,
            width: '30%'
          },
          xAxis: {
            type: 'value',
            scale: true,
            position: 'top',
            boundaryGap: false,
            splitLine: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
          },
          yAxis: {
            type: 'category',
            name: 'TOP 20',
            nameGap: 16,
            axisLine: {show: false, lineStyle: {color: '#ddd'}},
            axisTick: {show: false, lineStyle: {color: '#ddd'}},
            axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
            data: []
          },*/
          series: [
            {
              name: '服务区驻车量',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: convertedData[0],
              symbolSize: function (val) {
                return Math.max(val[2] / 10, 8);
              },
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#ddb926'
                }
              }
            },
          ]
        };
      }
    );
  }
  // 中部省级服务区切换
  public centerMap1() {
    const geoCoordMap = {
      '贵阳': [106.645382, 26.655177],
      '遵义': [106.924791, 27.73378],
      '铜仁': [109.194557, 27.752195],
      '毕节': [105.29893, 27.305249],
      '六盘水': [104.834398, 26.612807],
      '安顺': [105.956633, 26.269129],
      '凯里': [107.994134, 26.579727],
      '都匀': [107.529602, 26.256688],
      '兴义': [105.206943, 25.457651],
    };
    const geoValue = [
      {name: '贵阳', value: 150},
      {name: '遵义', value: 130},
      {name: '铜仁', value: 100},
      {name: '毕节', value: 98},
      {name: '六盘水', value: 155},
      {name: '安顺', value: 103},
      {name: '凯里', value: 60},
      {name: '都匀', value: 55},
      {name: '兴义', value: 156},
    ];
    const convertData = function (data) {
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    };
    let series = [
      {
        name: '服务区驻车量',
        type: 'effectScatter',
        effectType: 'ripple',
        coordinateSystem: 'bmap',
        data: convertData(geoValue),
        symbolSize: function (val) {
          return Math.max(val[2] / 5, 8);
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
    ];
    this.optionsMap = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `<div><p>${params.name}高速服务区</p><p>驻车量：${params.value[2]}</p></div>`;
        }
      },
      legend: {
        orient: 'vertical',
        y: 'bottom',
        x: 'right',
        data: ['pm2.5'],
        textStyle: {
          color: '#fff'
        }
      },
      visualMap: {
        min: 0,
        max: 200,
        calculable: true,
        show: false,
        inRange: {
          color: ['#FEC93F', '#2796C4', '#B171BF', '#F52C11']
        },
        textStyle: {
          color: '#fff'
        }
      },
      bmap: {
        center: [106.648831, 26.652078],
        zoom: 8,
        roam: true,
        mapStyle: {
          'styleJson': [
            {
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#031628'
              }
            },
            {
              'featureType': 'land',
              'elementType': 'geometry',
              'stylers': {
                'color': '#2A333D'
              }
            },
            {
              'featureType': 'highway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'on'
              }
            },
            {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'arterial',
              'elementType': 'geometry.stroke',
              'stylers': {
                'color': '#0b3d51'
              }
            },
            {
              'featureType': 'local',
              'elementType': 'geometry',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'railway',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'railway',
              'elementType': 'geometry.stroke',
              'stylers': {
                'color': '#08304b'
              }
            },
            {
              'featureType': 'subway',
              'elementType': 'geometry',
              'stylers': {
                'lightness': -70
              }
            },
            {
              'featureType': 'building',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'all',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#01D1DB'
              }
            },
            {
              'featureType': 'all',
              'elementType': 'labels.text.stroke',
              'stylers': {
                'color': '#000000'
              }
            },
            {
              'featureType': 'building',
              'elementType': 'geometry',
              'stylers': {
                'color': '#022338'
              }
            },
            {
              'featureType': 'green',
              'elementType': 'geometry',
              'stylers': {
                'color': '#062032'
              }
            },
            {
              'featureType': 'boundary',
              'elementType': 'all',
              'stylers': {
                'color': '#465b6c'
              }
            },
            {
              'featureType': 'manmade',
              'elementType': 'all',
              'stylers': {
                'color': '#022338'
              }
            },
            {
              'featureType': 'label',
              'elementType': 'all',
              'stylers': {
                'visibility': 'on'
              }
            }
          ]
        }
      },
      series: series
    };
  }
  // 中部百度地图画省边界外
  public centerMap2() {
    const that = this;
    const map = new BMap.Map('center_map', {minZoom: 10, maxZoom: 13});
    map.setMapStyle({
      styleJson: [
        // 城市名字的颜色
        /*{
            "featureType": "city",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#aedce2ff",
                "visibility": "on"
            }
        },*/
        // 地图背景颜色
        {
          'featureType': 'background',
          'elementType': 'all',
          'stylers': {
            'color': '#002240'
          }
        },
        // 高速配置
        {
          'featureType': 'highway',
          'elementType': 'all',
          'stylers': {
            'color': '#0045C4',
            'visibility': 'on'
          }
        },
        {
          'featureType': 'highway',
          'elementType': 'geometry',
          'stylers': {
            'color': '#B3BDC6',
            'weight': '0.6',
            'visibility': 'on'
          }
        },
        {
          'featureType': 'local',
          'elementType': 'all',
          'stylers': {
            'visibility': 'on'
          }
        },
        {
          'featureType': 'railway',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        },
        // 配置区县不显示
        {
          'featureType': 'district',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }
      ]
    });
    map.centerAndZoom(new BMap.Point(106.705336, 26.85979), 8);
    map.enableScrollWheelZoom(true);
    map.disableDoubleClickZoom(false);
    // 创建一个右键菜单
    const menu = new BMap.ContextMenu();
    // 定义右键菜单的内容
    const txtMenuItem = [
      {
        text: '放大',
        callback: function () {
          console.log('地图放大');
        }
      },
      {
        text: '缩小',
        callback: function () {
          console.log('地图缩小');
        }
      }
    ];
    // 给右键菜单里面添加东西
    for (let i = 0; i < txtMenuItem.length; i++) {
      // 右键菜单里面添加的内容格式是一个MenuItem类
      menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
    }

    // 控制地图显示范围
    /*  const b = new BMap.Bounds(new BMap.Point(105.75777, 24.618423), new BMap.Point(109.400435, 30.469081));
      try {
        BMapLib.AreaRestriction.setBounds(map, b);
      } catch (e) {
        alert(e);
      }*/

    // 编写自定义函数,创建标注
    const pointsMarket = [];
    this.cityDataService.getServiceNamePoint().subscribe(
      (val) => {
        val.data.map((val1, index1) => {
          let a = [];
          // console.log(val1.name);
          // pointsMarket.push([])
          val1.attributeValueList.map((val2, index2) => {
            if (val2.attributeDesc === '经度') {
              a.push(val2.attributeValue);
            } else if (val2.attributeDesc === '纬度')
              a.push(val2.attributeValue);
          });
          if (a) {
            a.push(val1.name);
          }
          pointsMarket.push(a);
        });
        if (pointsMarket) {
          console.log(pointsMarket);
          for (let i = 0; i < pointsMarket.length; i++) {
            const points = [pointsMarket[i][0], pointsMarket[i][1]];
            // addMarker(points, pointsMarket[i][2], pointsMarket[i][3]);
            addMarker(points, pointsMarket[i][2]);
          }
        }
      });

    function addMarker(point, name) {
      // const myIcon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/fox.gif', new BMap.Size(200, 130));
      const myIcon = new BMap.Icon('assets/images/s1.png', new BMap.Size(10, 10), {
        offset: new BMap.Size(0, 10),
      });
      const points = new BMap.Point(point[0], point[1]);
      const marker = new BMap.Marker(points, {icon: myIcon});
      map.addOverlay(marker);

      // 跳动的动画
      // marker.setAnimation(BMAP_ANIMATION_BOUNCE);

      // market事件
      marker.addEventListener('mouseover', function () {
        // 信息窗口
        const sContent = `<div style="background: red;"><h5>${name}</h5></div>`;
        const infoWindow = new BMap.InfoWindow(sContent, {enableCloseOnClick: true});
        this.openInfoWindow(infoWindow);
      });
      marker.addEventListener('click', function () {
          if (name === '久长服务区') {
            that.router.navigate(['/home/serzone', {name: name, point: point}]);
          } else {
            window.alert('此服务区暂无数据');
          }
      });
    }

    // 添加5标注
    for (let i = 0; i < pointsMarket.length; i++) {
      const points = [pointsMarket[i][0], pointsMarket[i][1]];
      addMarker(points, pointsMarket[i][2]);
    }

    // 绘制边线轮廓rankingClick
    let citys = ['贵阳市'];

    function getBoundary(name) {
      const bdary = new BMap.Boundary();

      function randomRgbColor() { // 随机生成RGB颜色
        const r = Math.floor(Math.random() * 256); // 随机生成256以内r值
        const g = Math.floor(Math.random() * 256); // 随机生成256以内g值
        const b = Math.floor(Math.random() * 256); // 随机生成256以内b值
        return `rgb(${r},${g},${b})`; // 返回rgb(r,g,b)格式颜色
      }

      const colors = randomRgbColor();
      if (name === '贵州省') {
        bdary.get(name, function (rs) {       // 获取行政区域
          for (let i = 0; i < rs.boundaries.length; i++) {
            const ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 3,
              strokeColor: 'white',
              fillColor: '',
              fillOpacity: 0
            }); // 建立多边形覆盖物
            map.addOverlay(ply);  // 添加覆盖物
            // map.setViewport(ply.getPath());    // 调整视野
          }
        });
      }
      bdary.get(name, function (rs) {       // 获取行政区域
        for (let i = 0; i < rs.boundaries.length; i++) {
          const ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 1,
            strokeColor: colors,
            fillColor: colors,
            fillOpacity: 0.5
          }); // 建立多边形覆盖物
          map.addOverlay(ply);  // 添加覆盖物
          // map.setViewport(ply.getPath());    // 调整视野
        }
      });
    }

    for (let i = 0; i <= citys.length; i++) {
      getBoundary(citys[i]);
    }
    // getBoundary('贵阳',"#F9EB08");
    // getBoundary('遵义',"#00FF00");
    // getBoundary('毕节',"#00FF00");
    /* getBoundary('安顺市',"#01D867");
     getBoundary('铜仁地区',"#00FF00");

     getBoundary('六盘市',"#00FF00");

     getBoundary('黔西南布依族苗族自治州',"#00FF00");
     getBoundary('黔东南苗族侗族自治州',"#00FF00");
     getBoundary('黔南布依族苗族自治州',"#00FF00");*/

    // 地图事件，逆地址解析
    const geoc = new BMap.Geocoder();
    map.addEventListener('click', function (e) {
      const pt = e.point;
      geoc.getLocation(pt, function (rs) {
        /*var addComp = rs.addressComponents;
        alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);*/
      });
    });
  }
  // 中部地图省市联动
  public provinceClick() {
    this.provinceShow = true;
    this.http.get('assets/data/province.json').subscribe(
      (res) => {
        this.province = res;
      }
    );
  }
  public provinceMouseEnter(item) {
    if (item === '全国') {
      this.cityShow = false;
      return;
    } else if (item === '贵州省') {
      this.cityShow = true;
      this.http.get('assets/data/guizhoucity.json').subscribe(
        (res) => {
          this.city = res[0].children;
          this.citeDate = res[0].province;
        }
      );
    } else if (item === '云南省') {
      this.cityShow = true;
      this.http.get('assets/data/yunnancity.json').subscribe(
        (res) => {
          this.city = res[0].children;
          this.citeDate = res[0].province;
        }
      );
    } else {
      this.cityShow = true;
      this.city = [{city: '暂未开通'}];
      this.citeDate = '暂未开通';
    }
  }
  public provinceDataClick(item) {
    this.selectDate = item.province;
    if (item.name === '全国') {
      this.dataToggle = '全国';
      this.router.navigate(['/home/whole']);
    } else if (item.name === '贵州') {
      this.dataToggle = '贵州';
      this.router.navigate(['/home/finance']);
    } else {
      window.confirm('此地区暂未开通');
    }
  }
  public cityDataClick(item) {
    if (!(item.city === '贵阳市')) {
      window.confirm('此地区暂未开通');
    }
  }

  // 事件处理函数
  public tableEventClick(name): void {
    // 弹窗配置
    this.eventConfig = {
      alertTitle: name,
      width: 80,
      height: 60,
    };
    this.wenJunAlertService.openAlertShow();
    console.log(name);
  }
  // 办公室信息处理函数
  public tableOfficeClick(): void {
    this.alertOfficeShow = true;
  }
  public closeOfficeShow() {
    this.alertOfficeShow = false;
  }
  // 个人信息处理
  public tablePersonClick() {
    this.alertPersonShow = true;
  }
  public closePersonShow() {
    this.alertPersonShow = false;
  }

  /*********************************右边*****************************/
  // 业态经营数据前十排名
  public backCrosswiseBar(title) {
    const IncomeValue = this.dataService.getIncome(9, 1000, 200, title);
    const barData = [];
    console.log(IncomeValue);
    IncomeValue.map((val, index) => {
      barData.push(
        {
          name: val.title,
          type: 'bar',
          stack: '总量',
          color: val.color,
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: val.data,
        }
      );
    });
    this.crosswiseBar = {
     /* title: [
        {
          text: `${this.dataToggle}业态数据前十排名`,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
      ],*/
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      /*legend: {
        data: ['业态收入（元）', '车流量（辆）', '客流量（人次）'],
        left: 'center',
        top: '6%',
        textStyle: {
          color: 'white'
        }
      },*/
      grid: {
        top: '5%',
        left: '1%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        splitLine: {show: false},
        axisLabel: {
          formatter: '{value}'
        },
        nameTextStyle: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        },
      },
      yAxis: {
        type: 'category',
        // name: '万元/辆/人次',
        inverse: false,
        splitLine: {show: false},
        data: IncomeValue[0].serviceZone,
        axisLabel: {
          margin: 20,
        },
        nameTextStyle: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        },
      },
      series: barData
    };
    /*this.diagrams.getIncomerRanked(this.dataStatus).subscribe(
      (value) => {
        this.crosswiseBar = {
          title: [
            {
              text: value.title,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '15%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            splitLine: {show: false},
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          yAxis: {
            type: 'category',
            name: '万元',
            data: value.ranked,
            splitLine: {show: false},
            nameTextStyle: {
              align: 'left',
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          series: [
            {
              name: '2018年',
              type: 'bar',
              data: value.data1,
              color: '#FBB034',
            }
          ]
        };
        this.crosswiseBar = {
          title: [
            {
              text: this.dataToggle + value.title,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '19%',
            // top: '20%',
            bottom: '5%'
          },
          xAxis: {
            type: 'value',
            name: '数值',
            splitLine: {show: false},
            axisLabel: {
              formatter: '{value}'
            },
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          yAxis: {
            type: 'category',
            name: '万元/辆/人次',
            inverse: false,
            splitLine: {show: false},
            data: value.ranked,
            axisLabel: {
              margin: 20,
            },
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                color: 'white'
              }
            },
          },
          series: [
            {
              name: value.name,
              type: 'bar',
              data: value.data,
              color: value.color,
              label: {
                show: true,
                formatter: '{a}: {c}',
                textBorderColor: '#333',
                textBorderWidth: 2,
              },
            },

          ]
        };
      }
    );*/
  }
  // 业态经营数据前十排名相关操作
  public clickBtn(e): void {
    console.log(e.srcElement.innerText);
    if (e.srcElement.innerText === '业态收入/万元') {
      this.dataStatus = '业态收入/万元';
      this.barStatus1 = true;
      this.barStatus2 = false;
      this.barStatus3 = false;
      this.backCrosswiseBar(this.dataStatus);
    } else if (e.srcElement.innerText === '车流量/辆') {
      this.dataStatus = '车流量/辆';
      this.barStatus1 = false;
      this.barStatus2 = true;
      this.barStatus3 = false;
      this.backCrosswiseBar(this.dataStatus);
    } else {
      this.dataStatus = '客流量/人次';
      this.barStatus1 = false;
      this.barStatus2 = false;
      this.barStatus3 = true;
      this.backCrosswiseBar(this.dataStatus);
    }
  }
  public rankingClick(e) {
    this.router.navigate(['/home/serzone', {name: e.name, point: [116.39737, 39.935076]}]);
  }

  // 流量收入实时监控
  public amount(): void {
    this.localService.persons.next(this.personNum.toString().split(''));
    let a = 100000;
    let b = 200000;
    this.clearTime = setInterval(() => {
      const c = [];
      this.personNum += Math.round(Math.random() * 10);
      this.personNum.toString().split('').map((value, index) => {
        c.push({number: value});
        this.persons = c;
      });
      this.localService.persons.next(this.persons);
      a += Math.round(Math.random() * 100);
      b += Math.round(Math.random() * 100);
      this.vehicleAmount = a.toString().split('');
      this.incomeAmount = b.toString().split('');
    }, 3000);

  }

  // 收入类型占比图表配置
  public IncomeTypes() {
    this.diagrams.getIncomeTypes().subscribe(
      (value) => {
        this.optionsIncomeModel = {
         /* title: [
            {
              text: this.dataToggle + value.title,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],*/
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {d}%',
                color: 'white',
                align: 'center',
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: 12
                  }
                }
              },
              color: ['#01CBE3', '#2A58DF', '#1B94E3', '#3B4F74', '#D33939', '#2407EF'],
              data: value.data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
      }
    );
  }
  // 收入类型相关操作
  public incomeClick(e): void {
    this.alertIncomeShow = true;
    document.body.className = 'ui-overflow-hidden';
    this.arryIncomePie = [];
    this.dataService.getrandomPie(9, 1000, 100).map((val, index) => {
      this.arryIncomePie.push({value: val, name: this.citys[index]});
    });
    this.optionsIncomeTypes = {
      title: {
        text: `${this.dataToggle}各县所有服务区当日${e.name}类型占比统计`,
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          name: `${e.name}`,
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: this.arryIncomePie,
          itemStyle: {
            color: function (params) {
              return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
  }
  public closeIncomeShow(): void {
    document.body.className = '';
    this.alertIncomeShow = false;
  }
  // 收入类型弹窗
  public optionsIncomePieInit(ec): void {
    this.optionsCarPieInstance = ec;
  }
  public optionsIncomePieClick(e) {
    // this.IncomeAreaName = e.name;
    this.incomeTypeisShow = false;
    this.router.navigate(['/home/serzone', {name: e.name}]);
    // this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
  }
  public IncomeBtnClick(e): void {
    if (e.srcElement.innerText === '收入总数') {
      this.alertIncomeTitle = '收入总数';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
    else if (e.srcElement.innerText === '小吃') {
      this.alertIncomeTitle = '小吃';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
    else if (e.srcElement.innerText === '中式快餐') {
      this.alertIncomeTitle = '中式快餐';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
    else if (e.srcElement.innerText === '西式快餐') {
      this.alertIncomeTitle = '西式快餐';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
    else if (e.srcElement.innerText === '商超') {
      this.alertIncomeTitle = '商超';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
    else if (e.srcElement.innerText === '住宿') {
      this.alertIncomeTitle = '住宿';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
    else if (e.srcElement.innerText === '汽修') {
      this.alertIncomeTitle = '汽修';
      this.arryIncomePie = [];
      this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
        this.arryIncomePie.push({value: val, name: this.citys[index]});
      });
      this.optionsIncomeTypes = {
        title: {
          text: `${this.dataToggle}各县所有服务区当日${this.alertIncomeTitle}类型占比统计`,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        series: [
          {
            name: `${this.alertIncomeTitle}`,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.arryIncomePie,
            itemStyle: {
              color: function (params) {
                return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
    }
  }
  public IncomeTableClick(e): void {
    this.router.navigate(['/home/serzone', {name: e}]);
  }
  public echarIncomeBtn(e): void {
    this.incomeTypeisShow = true;
    this.IncomeAreaName = e.srcElement.innerText;
    this.arryIncomePie = [];
    this.dataService.getrandomPie(9, 1000, 100).map((val, index) => {
      this.arryIncomePie.push({value: val, name: this.citys[index]});
    });
    this.optionsIncomeTypes = {
      title: {
        text: `贵州省各市所有服务区当日${e.name}类型占比统计`,
        x: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          name: `${e.name}`,
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: this.arryIncomePie,
          itemStyle: {
            color: function (params) {
              return ['#CE2D79', '#BDD139', '#78E77D', '#09D4D6', '#3C75B9', '#6769B1', '#FF8C9D', '#2796C4', '#E57D0D'][params.dataIndex];
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
  }
  // 表格导出
  public incomeDateChange(e) {
    this.incomeExportType.incomeDate = e.srcElement.value;
  }
  public incomeTypeChange(e) {
    this.incomeExportType.incomeNumType = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public incomeAreaChange(e) {
    this.incomeExportType.incomeArea = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public incomeExportClick() {
    if (!(this.incomeExportType.incomeDate === '') || !(this.incomeExportType.incomeNumType === '') || !(this.incomeExportType.incomeArea === '')) {
      this.incomeExcelShow = false;
      console.log(this.incomeExportType);
      // 导出表格数据初始化
      this.incomeExportType = {
        incomeNumType: '',
        incomeArea: '',
        incomeDate: ''
      };
    } else {
      window.alert('请把数据选择全在提交');
    }
  }
  public openIncomeExcel() {
    this.incomeExcelShow = true;
  }
  public closeincomeExcel() {
    this.incomeExcelShow = false;
  }

  // 图表更新
  public updataEcharts(): void {

    // 3D柱状图
    this.packOption3();
    //  高速服务区分布散点统计
    // this.centerMap();
    // this.centerMap1();

    /**************************中部****************************/
    this.centerMap2();
    // 事件
    this.eventTypes = this.dataService.eventTypes;
    // 办公
    this.officeTypes = this.dataService.officeTypes;
    // 个人
    this.personOfficeTypes = this.dataService.personOfficeTypes;

    // 业态经营数据前十排名
    this.backCrosswiseBar(this.dataStatus);

    // 全国当日车型日分布类型占比分析
    this.CarTypes();

    // 全国当日收入类型占比分析
    this.IncomeTypes();

    // 月度所有服务区车辆流量柱状图统计
    this.optionsCar = {
      title: {
        text: '月度车流量实时监控（辆）',
        left: 'center',
        textStyle: {
          color: 'white',
          fontWeight: 500,
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      grid: {
        left: '5%',
        top: '15%',
        bottom: '3%',
        right: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        },
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        name: '车辆数量',
        type: 'value',
        splitLine: {show: false},
        nameTextStyle: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        },
      },
      series: [
        {
          type: 'bar',
          name: '车辆数量',
          color: ['#d82c26'],
          smooth: true,
          data: [120, 200, 150, 80, 70, 110],
        }
      ]
    };
  }

}
