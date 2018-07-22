import {
  Component, ElementRef,
  OnInit,
} from '@angular/core';
import {Data3dService} from '../../common/services/data3d.service';
import {DiagramService} from '../../common/services/diagram.service';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../common/services/data.service';
declare let BMap;

@Component({
  selector: 'app-service-data',
  templateUrl: './service-data.component.html',
  styleUrls: ['./service-data.component.css']
})
export class ServiceDataComponent implements OnInit {
  /***********************头部************************/
  // 服务区名称
  public serviceZoneTitle: string;

  /***********************左边************************/
    //  高速服液态数据3d统计
  public options3d = {};
  public options3dArray: any;

  /***********************右边************************/
  // 全国业态经营数据前十排名
  public crosswiseBar = {};
  public barStatus1 = true;
  public barStatus2 = false;
  public barStatus3 = false;
  public dataStatus = '业态收入';

  /***********************其他************************/
  // 服务区名称
  public serviceZonePoint: string;
  // 服务区车型日分布分析
  public optionsCarModel = {};
  // 车辆收入数值表现
  public vehicleAmount = [];
  public incomeAmount = [];
  // 全国当日收入类型占比分析
  public optionsIncomeModel = {};

  /**********************弹窗部分**********************/
    // 3D柱状图弹窗
  public alertBarShow = false;
  public alertBarTitle: string;
  public options3dBar = {};
  public options3dBarInstance: any;
  public options3dPie = {};
  public options3dPieInstance: any;
  public colorList = [
    '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3',
    '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3 ', '#29AAE3'
  ];
  public arryPie = [];

  /**********************基础数据部分**********************/
  public citys = ['贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔东南苗族侗族自治州', '黔南布依族苗族自治州', '黔西南布依族苗族自治州'];

  constructor(
    private el: ElementRef,
    private data3dS: Data3dService,
    private diagrams: DiagramService,
    private routerInfo: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // 路由接受参数
    this.routerInfo.params.subscribe(
      (params) => {
        this.serviceZoneTitle = params.name;
        this.serviceZonePoint = params.point.split(',');
        // console.log(this.serviceZonePoint);
      }
    );
    // 百度地图
    this.ionViewWillEnter();
    //  高速服液态数据3d统计
    this.packOption3();
    // 贵阳业态经营数据前十排名
    this.backCrosswiseBar();
    // 贵阳高速服务区日分布类型占比分析
    this.CarTypes();
    // 贵阳收入实时监控
    this.amount();
    // 贵阳当日收入类型占比分析
    this.IncomeTypes();
  }
  /************************图表配置***************************/
  // 高速服务区业态数据3d统计
  public packOption3() {
    this.data3dS.get3dData().subscribe(
      (value) => {
        this.options3dArray = value;
        const hours = this.options3dArray.hours;
        const days = this.options3dArray.days;
        this.options3d = {
          title: [
            {
              text: this.serviceZoneTitle + this.options3dArray.data3dTitle,
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

  // 业态经营数据前十排名
  public backCrosswiseBar() {
    this.diagrams.getIncomerRankedGuiYang().subscribe(
      (value) => {
        const nums = [];
        const merchants = [];
        function test(params, merchant): any {
          return `<p>${params.name}：<span>${merchant[params.dataIndex]}</p></span>
                  <p>收入：<span>${params.value}元</p></span>
`;
        }
        value.data.map((v, i) => {
          nums.push(v.num);
          merchants.push(v.merchant);
        });
        this.crosswiseBar =   {
          title: [
            {
              text: this.serviceZoneTitle,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return test(params, merchants);
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
              name: '经营收入',
              type: 'bar',
              data: nums,
              color: '#F52C11',
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
    );
  }
  /*********************************函数操作*****************************/
  // 返回上级路由
  public goBack(): void {
    history.back();
  }
  //  3D柱状图的相关点击事件
  public barClick(e): void {
    const that = this;
    this.alertBarShow = true;
    const yType = ['经营收入', '驻车量', '用电量', '用水量', '客流量'];
    this.colorList = [
      '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3',
      '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3 ', '#29AAE3'
    ];
    this.colorList[e.data.value[0]] = 'red';
    const yAxis = e.data.value[1];
    this.alertBarTitle = yType[yAxis];
    const barData = this.dataService.get3dOption(12);
    const pieDataName = barData[e.data.value[0]];
    this.arryPie = [];
    this.dataService.getrandomPie(9).map((val, index) => {
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
          text: `${this.serviceZoneTitle}年度${types(yAxis)}统计`,
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
        text: `${this.serviceZoneTitle}年度${types(yAxis)}类型占比统计`,
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
          name: `${types(yAxis)}总计：${pieDataName}`,
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
  public closeBarShow() {
    this.alertBarShow = false;
  }

  // 横向柱状图数据排名相关操作
  public clickBtn(e): void {
    if (e.srcElement.innerText === '业态收入') {
      this.dataStatus = '业态收入';
      this.barStatus1 = true;
      this.barStatus2 = false;
      this.barStatus3 = false;
      this.backCrosswiseBar();
    } else if (e.srcElement.innerText === '车流量') {
      this.dataStatus = '车流量';
      this.barStatus1 = false;
      this.barStatus2 = true;
      this.barStatus3 = false;
      this.backCrosswiseBar();
    } else {
      this.dataStatus = '客流量';
      this.barStatus1 = false;
      this.barStatus2 = false;
      this.barStatus3 = true;
      this.backCrosswiseBar();
    }
  }
  public rankingClick(e) {
    // this.router.navigate(['/home/serzone', {name: e.name, point: [116.39737, 39.935076]}]);
  }



  /********************************其他*********************/

  // 贵阳高速服务区日分布类型占比分析
  public CarTypes() {
    this.diagrams.getCarTypesGuiYang().subscribe(
      (value) => {
        this.optionsCarModel = {
          title: [
            {
              text: this.serviceZoneTitle,
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
    let a = 500;
    let b = 10000;
    setInterval(() => {
      a += Math.round(Math.random() * 100);
      b += Math.round(Math.random() * 100);
      this.vehicleAmount = a.toString().split('');
      this.incomeAmount = b.toString().split('');
    }, 3000);

  }
  // 全国当日收入类型占比分析
  public IncomeTypes() {
    this.diagrams.getIncomeTypesGuiYang().subscribe(
      (value) => {
        this.optionsIncomeModel = {
          title: [
            {
              text: this.serviceZoneTitle,
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

  /************************百度地图***************************/
  public ionViewWillEnter() {
    let that;
    that = this;
    const map = new BMap.Map('baiduMap');
    const point = new BMap.Point(this.serviceZonePoint[0], this.serviceZonePoint[1]);
    map.centerAndZoom(point, 19);
    /*map.setMapStyle({
      styleJson: [
        {
          'featureType': 'water',
          'elementType': 'all',
          'stylers': {
            'color': '#021019'
          }
        },
        {
          'featureType': 'highway',
          'elementType': 'geometry.fill',
          'stylers': {
            'color': '#000000'
          }
        },
        {
          'featureType': 'highway',
          'elementType': 'geometry.stroke',
          'stylers': {
            'color': '#147a92'
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
          'featureType': 'land',
          'elementType': 'all',
          'stylers': {
            'color': '#08304b'
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
            'color': '#857f7f'
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
            'color': '#1e1c1c'
          }
        },
        {
          'featureType': 'manmade',
          'elementType': 'geometry',
          'stylers': {
            'color': '#022338'
          }
        },
        {
          'featureType': 'all',
          'elementType': 'labels.icon',
          'stylers': {
            'visibility': 'off'
          }
        },
        {
          'featureType': 'all',
          'elementType': 'labels.text.fill',
          'stylers': {
            'color': '#ffffffff',
            'visibility': 'on'
          }
        }
      ]
    });*/
    const geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
      const geoc = new BMap.Geocoder();
      geoc.getLocation(r.point, function (rs) {
        that.locationTxt = rs.address;
        that.locationState = true;
      });
    }, {enableHighAccuracy: true});
  }


  /*********************************弹窗部分函数操作*****************************/
  // 3D柱状图弹窗操作
  public options3dBarInit(ec) {
    this.options3dBarInstance = ec;
  }
  public options3dPieInit(ec) {
    this.options3dPieInstance = ec;
  }
  public options3dBarClick(e) {
    this.colorList = [
      '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3',
      '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3 ', '#29AAE3'
    ];
    this.colorList[e.dataIndex] = 'red';
    this.options3dBarInstance.setOption(this.options3dBar);
    this.arryPie = [];
    this.dataService.getrandomPie(9).map((val, index) => {
      this.arryPie.push({value: val, name: this.citys[index]});
    });
    console.log(this.arryPie);
    this.options3dPie = {
      title: {
        text: `${this.serviceZoneTitle}年度${e.name}类型占比统计`,
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
}
