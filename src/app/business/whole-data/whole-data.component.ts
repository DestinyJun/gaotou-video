import {
  AfterContentInit, AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxEchartsService} from 'ngx-echarts';
import {EventsService} from '../../common/services/events.service';
import {Data3dService} from '../../common/services/data3d.service';
import {CentermapService} from '../../common/services/centermap.service';
import {DiagramService} from '../../common/services/diagram.service';

@Component({
  selector: 'app-whole-data',
  templateUrl: './whole-data.component.html',
  styleUrls: ['./whole-data.component.css']
})
export class WholeDataComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
  // 全国、省级数据切换
  public dataToggle = '全国';
  // 弹出框的标题及显影控制
  public alertMapBoxShow = true;
  public alertMapTitle: string;

  public alertDateBoxShow = true;
  public alertDateTitle: string;

  public alertBarShow = false;
  public alertBarTitle: string;

  // 服务区地图分布
  public mapName = 'china';
  public mapCenter = [101.74, 36.56];
  public mapZoom = 0.8;
  public mapLeft = '';
  public mapRight = '';

  // 图表加载状态状态:
  public echartsIntance: any;
  //  全国高速服务区业态数据3d统计
  public options3d = {};
  public options3dArray: any;
  // 全国高速服务区分布图
  public optionsMap = {};
  //  全国业态经营数据前十排名
  public crosswiseBar = {};
  // 全国当日车型日分布分析
  public optionsCarModel = {};
  // 车辆收入数值表现
  public numberText = ['0', '0', '0'];
  public vehicleAmount = [];
  public incomeAmount = [];
  // 全国当日收入类型占比分析
  public optionsIncomeModel = {};
  // 车月度所有服务区车辆流量柱状图统计
  public optionsCar = {};
  // 当日服务区停车量排名
  public optionsRetention = {};
  // 月度收入分析
  public optionsMonth = {};
  // 服务区当日收入排名
  public optionsIncome = {};
  // 弹窗横向对比数值柱状图
  public optionsLateral = {};
  // 省市联动数据及状态
  public selectDate = '全国';
  public province: any;
  public city: any;
  public citeDate: string;
  public provinceShow = false;
  public cityShow = false;
  public flag: string;

  constructor(
    public http: HttpClient,
    private es: NgxEchartsService,
    private eventsService: EventsService,
    private resolver: ComponentFactoryResolver,
    private data3dS: Data3dService,
    private centerMapS: CentermapService,
    private diagrams: DiagramService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.amount();
    this.updataEcharts();
    // 全屏点击事件
    window.document.addEventListener('click', (e) => {
      this.flag = e.srcElement.parentElement.className;
      if ((this.provinceShow || this.cityShow) && !(this.flag === 'select')) {
        this.provinceShow = false;
        this.cityShow = false;
      }
    });
  }

  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
  }

  /**********************************图表配置*****************************/
  // 全国高速服务区业态数据3d统计
  public packOption3() {
    this.data3dS.get3dData().subscribe(
      (value) => {
        this.options3dArray = value;
        const hours = this.options3dArray.hours;
        const days = this.options3dArray.days;
        this.options3d = {
          title: [
            {
              text: this.dataToggle + this.options3dArray.data3dTitle,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],
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
          visualMap: {
            max: 100,
            show: false,
            inRange: {
              color: this.options3dArray.colorData
            }
          },
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
                opacity: 0.9
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

  // 配色
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
          /* title: [
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
           ],*/
          tooltip: {
            formatter: '{b}'
          },
          visualMap: {
            show: false,
            min: 0,
            max: 2500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
              color: ['#313695', '#E30B40', '#3291DD', '#35DD7B', '#8B489E', '#FEEB23', '#3BF49F', '#01D1DB', '#fdae61', '#f46d43', '#d73027', '#F432AD'],
            }
          },
       /*   geo: {
            map: 'china',
            // left: 'center',
            // center: value.center,
            zoom: 1.2,
            roam: false,
            label: {
              show: true,
              color: 'yellow',
              emphasis: {
                color: '#00ECF1'
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#FDDD31'
              }
            },
            // 单独设置各个省份的颜色
            regions: [{
              name: '广东',
              itemStyle: {
                areaColor: 'red',
                color: 'red'
              }
            }]
          },*/
          series: [
            {
              name: '省份',
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: [
                {name: '北京', value: Math.round(Math.random() * 1000)},
                {name: '天津', value: Math.round(Math.random() * 1000)},
                {name: '上海', value: Math.round(Math.random() * 1000)},
                {name: '重庆', value: Math.round(Math.random() * 1000)},
                {name: '河北', value: Math.round(Math.random() * 1000)},
                {name: '河南', value: Math.round(Math.random() * 1000)},
                {name: '云南', value: Math.round(Math.random() * 1000)},
                {name: '辽宁', value: Math.round(Math.random() * 1000)},
                {name: '黑龙江', value: Math.round(Math.random() * 1000)},
                {name: '湖南', value: Math.round(Math.random() * 1000)},
                {name: '安徽', value: Math.round(Math.random() * 1000)},
                {name: '山东', value: Math.round(Math.random() * 1000)},
                {name: '新疆', value: Math.round(Math.random() * 1000)},
                {name: '江苏', value: Math.round(Math.random() * 1000)},
                {name: '浙江', value: Math.round(Math.random() * 1000)},
                {name: '江西', value: Math.round(Math.random() * 1000)},
                {name: '湖北', value: Math.round(Math.random() * 1000)},
                {name: '广西', value: Math.round(Math.random() * 1000)},
                {name: '甘肃', value: Math.round(Math.random() * 1000)},
                {name: '山西', value: Math.round(Math.random() * 1000)},
                {name: '内蒙古', value: Math.round(Math.random() * 1000)},
                {name: '陕西', value: Math.round(Math.random() * 1000)},
                {name: '吉林', value: Math.round(Math.random() * 1000)},
                {name: '福建', value: Math.round(Math.random() * 1000)},
                {name: '贵州', value: Math.round(Math.random() * 1000)},
                {name: '广东', value: Math.round(Math.random() * 1000)},
                {name: '青海', value: Math.round(Math.random() * 1000)},
                {name: '西藏', value: Math.round(Math.random() * 1000)},
                {name: '四川', value: Math.round(Math.random() * 1000)},
                {name: '宁夏', value: Math.round(Math.random() * 1000)},
                {name: '海南', value: Math.round(Math.random() * 1000)},
                {name: '台湾', value: Math.round(Math.random() * 1000)},
                {name: '香港', value: Math.round(Math.random() * 1000)},
                {name: '澳门', value: Math.round(Math.random() * 1000)}
              ]
            },
          ]
          /* tooltip: {
             trigger: 'item'
           },*/
          /*  series: [
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
            ]*/

        };
      }
    );
  }

  // 全国业态经营数据前十排名
  public backCrosswiseBar() {
    this.diagrams.getIncomerRanked().subscribe(
      (value) => {
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
          legend: {
            top: '5%',
            data: ['业态收入', '车流量', '人流量'],
            textStyle: {
              color: 'white',
            },
            selected: {
              '业态收入': true,
              '车流量': false,
              '人流量': false
            }
          },
          grid: {
            left: '15%',
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
              name: '业态收入',
              type: 'bar',
              data: value.data1,
              color: '#F52C11',
              label: {
                show: true,
                formatter: '{a}: {c}',
                textBorderColor: '#333',
                textBorderWidth: 2,
              },
            },
            {
              name: '车流量',
              type: 'bar',
              color: '#F9F409',
              label: {
                show: true,
                formatter: '{a}: {c}',
                textBorderColor: '#333',
                textBorderWidth: 2,
              },
              data: value.data2
            },
            {
              name: '人流量',
              type: 'bar',
              color: '#32D774',
              label: {
                show: true,
                formatter: '{a}: {c}',
                textBorderColor: '#333',
                textBorderWidth: 2,
              },
              data: value.data3,
            }
          ]
        };
      }
    );
  }

  // 全国当日车型日分布类型占比分析
  public CarTypes() {
    this.diagrams.getCarTypes().subscribe(
      (value) => {
        this.optionsCarModel = {
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
              color: ['#E64018', '#FBB034', '#FEEB23', '#E30B40', '#3291DD', '#8B489E'],
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

  // 流量收入实时监控
  public amount(): void {
    let a = 1000;
    let b = 2000;
    setInterval(() => {
      a += Math.round(Math.random() * 100);
      b += Math.round(Math.random() * 100);
      this.vehicleAmount = a.toString().split('');
      this.incomeAmount = b.toString().split('');
    }, 3000);

  }

  // 全国当日收入类型占比分析
  public IncomeTypes() {
    this.diagrams.getIncomeTypes().subscribe(
      (value) => {
        this.optionsIncomeModel = {
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
              color: ['#72C096', '#FEC93F', '#2796C4', '#22C3F9', '#B171BF', '#FF8C9D'],
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

  // 图表更新
  public updataEcharts(): void {

    // 3D柱状图
    this.packOption3();

    //  高速服务区分布散点统计
    this.centerMap();

    // 业态经营数据前十排名
    this.backCrosswiseBar();

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

    // 月度总收入统计
    this.optionsMonth = {
      title: {
        text: '月度总收入统计',
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
        name: '万元',
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
      series: [{
        name: '总收入：',
        color: ['#FE17F1'],
        smooth: true,
        data: [580, 790, 142, 968, 1200, 350],
        type: 'bar'
      }]
    };
  }

  /*********************************函数操作*****************************/
  //  3D柱状图的相关点击事件、3D图横向对比
  public barClick(): void {
    this.alertBarShow = true;
    this.optionsLateral = {
      title: [
        {
          text: '当日服务区收入排名',
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
        left: '5%',
        right: '3%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
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
        name: '万元',
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
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        color: '#01D1DB',
      }]
    };
  }

  public closeBarShow() {
    this.alertBarShow = false;
  }

  // 全国服务区分布点击事件
  public mapClick(params): void {
    /*if (params.componentSubType === 'effectScatter') {
      if (this.alertMapBoxShow) {
        this.alertMapBoxShow = false;
        this.comp1 = this.alertBox.createComponent(childComp1);
        this.alertMapTitle = params.name;
      } else {
        this.destoryChild1();
        this.alertMapBoxShow = true;
        /!* that.comp1 = that.alertBox.createComponent(childComp1);
         that.alertMapTitle = params.name;*!/
      }
    }*/
  }

  // 驻车量排名相关操作
  public parkClick(e): void {
    /*const childComp2 = this.resolver.resolveComponentFactory(ChildDataListComponent);
    if (this.alertDateBoxShow) {
      this.alertDateBoxShow = false;
      this.comp2 = this.alertDate.createComponent(childComp2);
      this.comp2.instance.typeTitle = e.seriesName;
      this.alertDateTitle = e.seriesName;
    } else {
      this.destoryChild2();
    }*/
  }

  // 事件列表相关操作
  public eventClick(): void {
    /*const childComp2 = this.resolver.resolveComponentFactory(ChildDataListComponent);
    if (this.alertDateBoxShow) {
      this.alertDateBoxShow = false;
      this.comp2 = this.alertDate.createComponent(childComp2);
      this.comp2.instance.typeTitle = '事件监控';
      this.alertDateTitle = '事件监控';
    } else {
      this.destoryChild2();
    }*/
  }

  // 驻车量排名相关操作
  public incomeClick(e): void {
    /* const childComp2 = this.resolver.resolveComponentFactory(ChildDataListComponent);
     if (this.alertDateBoxShow) {
       this.alertDateBoxShow = false;
       this.comp2 = this.alertDate.createComponent(childComp2);
       this.comp2.instance.typeTitle = e.seriesName;
       this.alertDateTitle = e.seriesName;
     } else {
       this.destoryChild2();
     }*/
  }

  // 组建创建相关操作
  public destoryChild1(): void {
    /* this.alertMapBoxShow = true;
     this.comp1.destroy();*/
  }

  public destoryChild2(): void {
    // this.alertDateBoxShow = true;
    // this.comp2.destroy();
  }

  // 省市联动
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
      console.log(this.dataToggle);
      this.centerMap();
    } else if (item.name === '贵州') {
      this.dataToggle = '贵州';
      console.log(this.dataToggle);
      // this.centerMap1();
    } else {
      window.confirm('此地区暂未开通');
    }
  }

  public cityDataClick(item) {
    if (item.name === 'china') {
      this.mapName = 'china';
      this.mapCenter = [117.98561551896913, 31.205000490896193];
      this.mapZoom = 0.8;
      this.mapLeft = '5%';
      this.mapRight = '15%';
    } else {
      this.mapName = '贵州';
      this.mapLeft = '5%';
      this.mapRight = '0%';
      this.mapCenter = [106.682234, 26.626655];
      this.mapZoom = 0.5;
    }
    this.selectDate = this.citeDate + item.city;
    this.provinceShow = false;
    this.cityShow = false;
  }
}
