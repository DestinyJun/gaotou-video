import {
  Component, ElementRef,
  OnInit,
} from '@angular/core';
import {Data3dService} from '../../common/services/data3d.service';
import {DiagramService} from '../../common/services/diagram.service';
import {ActivatedRoute} from '@angular/router';
declare let BMap;

@Component({
  selector: 'app-service-data',
  templateUrl: './service-data.component.html',
  styleUrls: ['./service-data.component.css']
})
export class ServiceDataComponent implements OnInit {
  // 服务区名称
  public serviceZoneTitle: string;
  // 服务区名称
  public serviceZonePoint: string;
  //  高速服液态数据3d统计
  public options3d = {};
  public options3dArray: any;
  //  服务区业态经营数据前十排名
  public crosswiseBar = {};
  // 服务区车型日分布分析
  public optionsCarModel = {};
  // 车辆收入数值表现
  public vehicleAmount = [];
  public incomeAmount = [];
  // 全国当日收入类型占比分析
  public optionsIncomeModel = {};

  constructor(
    private el: ElementRef,
    private data3dS: Data3dService,
    private diagrams: DiagramService,
    public routerInfo: ActivatedRoute
  ) {}

  ngOnInit() {
    // 路由接受参数
    this.routerInfo.params.subscribe(
      (params) => {
        this.serviceZoneTitle = params.name;
        this.serviceZonePoint = params.point.split(',');
        console.log(this.serviceZonePoint);
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
  /************************统计图***************************/
  // 贵阳高速服务区业态数据3d统计
  public packOption3() {
    this.data3dS.get3dDataGuiYang().subscribe(
      (value) => {
        this.options3dArray = value;
        const hours = this.options3dArray.hours;
        const days = this.options3dArray.days;
        this.options3d = {
          title: [
            {
              text: this.options3dArray.data3dTitle,
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
            formatter: function(params) {
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
              barWidth : 30, // 柱图宽度
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
  // 贵阳业态经营数据前十排名
  public backCrosswiseBar() {
    this.diagrams.getIncomerRankedGuiYang().subscribe(
      (value) => {
        const nums = [];
        const types = [];
        const nums2 = [];
        const types2 = [];
        const nums3 = [];
        const types3 = [];
        value.data1.map((v, i) => {
          nums.push(v.num);
          types.push(v.name);
        });
        value.data2.map((v, i) => {
          nums2.push(v.num);
          types2.push(v.name);
        });
        value.data3.map((v, i) => {
          nums3.push(v.num);
          types3.push(v.name);
        });
        this.crosswiseBar =   {
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
          legend: {
            top: '5%',
            bottom: '2%',
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
              data: nums,
              color: '#F52C11',
              label: {
                show: true,
                formatter: function (params) {
                  return `${params.value}`;
                },
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
              data: nums2
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
              data: nums3,
            }
          ]
        };
        /* let optionTest = {
           title: {
             text: 'Wheater Statistics'
           },
           tooltip: {
             trigger: 'axis',
             axisPointer: {
               type: 'shadow'
             }
           },
           legend: {
             data: ['业态收入', '车流量', '人流量']
           },
           grid: {
             left: 100
           },
           xAxis: {
             type: 'value',
             name: 'Days',
             axisLabel: {
               formatter: '{value}'
             }
           },
           yAxis: {
             type: 'category',
             inverse: true,
             data: ['第一名', '第二名', '第三名'],
             axisLabel: {
               margin: 20,
             }
           },
           series: [
             {
               name: '业态收入',
               type: 'bar',
               data: [165, 170, 30],
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
               label: {
                 show: true,
                 formatter: '{a}: {c}',
                 textBorderColor: '#333',
                 textBorderWidth: 2,
               },
               data: [150, 105, 110]
             },
             {
               name: '人流量',
               type: 'bar',
               label: {
                 show: true,
                 formatter: '{a}: {c}',
                 textBorderColor: '#333',
                 textBorderWidth: 2,
               },
               data: [220, 82, 63]
             }
           ]
         };*/
      }
    );
  }
  // 贵阳高速服务区日分布类型占比分析
  public CarTypes() {
    this.diagrams.getCarTypesGuiYang().subscribe(
      (value) => {
        this.optionsCarModel = {
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
              text: value.title,
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

}
