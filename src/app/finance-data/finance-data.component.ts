import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxEchartsService} from 'ngx-echarts';
import * as echarts from 'echarts';
// declare let echarts;
@Component({
  selector: 'app-finance-data',
  templateUrl: './finance-data.component.html',
  styleUrls: ['./finance-data.component.css']
})
export class FinanceDataComponent implements OnInit {
  // 加载动画状态:
  public mapLoaded = false;
  // 地图:
  public optionsMap = {};
  // 车辆流量监控
  public optionsCar = {};
  // 车辆滞留是时间
  public optionsRetention = {};
  // 车型日分布分析
  public optionsCarModel = {};
  // 月度收入分析
  public optionsMonth = {};
  //  阅读收入前五名排名对比
  public optionsIncome = {};

  constructor(
    public http: HttpClient,
    private es: NgxEchartsService
  ) {}

  ngOnInit() {
    // 中部车辆地图
    this.http.get('assets/data/lines-bus.json').subscribe(
      (data: any[]) => {
        const hStep = 300 / (data.length - 1);
        const busLines = [].concat.apply([], data.map((busLine, idx) => {
          let prevPt;
          const points = [];
          for (let i = 0; i < busLine.length; i += 2) {
            let pt = [busLine[i], busLine[i + 1]];
            if (i > 0) {
              pt = [
                prevPt[0] + pt[0],
                prevPt[1] + pt[1]
              ];
            }
            prevPt = pt;

            points.push([pt[0] / 1e4, pt[1] / 1e4]);
          }
          return {
            coords: points,
            lineStyle: {
              normal: {
                color: this.es.echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
              }
            }
          };
        }));
        // 隐藏 loading:
        this.mapLoaded = true;
        // 更新options数据:
        this.optionsMap = {
          bmap: {
            center: [116.46, 39.92],
            zoom: 10,
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
                    'color': '#000102'
                  }
                },
                {
                  'featureType': 'highway',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'off'
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
                    'visibility': 'off'
                  }
                }
              ]
            }
          },
          series: [
            {
              type: 'lines',
              coordinateSystem: 'bmap',
              polyline: true,
              data: busLines,
              silent: true,
              lineStyle: {
                normal: {
                  opacity: 0.2,
                  width: 1
                }
              },
              progressiveThreshold: 500,
              progressive: 200
            },
            {
              type: 'lines',
              coordinateSystem: 'bmap',
              polyline: true,
              data: busLines,
              lineStyle: {
                normal: {
                  width: 0
                }
              },
              effect: {
                constantSpeed: 20,
                show: true,
                trailLength: 0.1,
                symbolSize: 1.5
              },
              zlevel: 1
            }
          ]
        };
      }
    );
    // 车辆流量
    this.optionsCar = {
      title: {
        text: '车流实时监控（辆）',
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
      grid: {
        left: '1%',
        top: '3%',
        bottom: '3%',
        right: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23', '23-1', '1-3', '3-5', '5-7'],
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        }
      },
      yAxis: {
        name: '车辆数量',
        type: 'value',
        splitLine: {show: false},
        min: 0,
        interval: 20,
        nameTextStyle: {
          color: 'white'
        },
        axisLine: {
          lineStyle: {
            color: 'white'
          }
        }
      },
      series: [
        {
          name: '车辆数量',
          color: ['#d82c26'],
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 5, // 折线宽度
              },
             /* color: this.es.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 1,
                  color: '#fbfa96' // 0% 处的颜色
               },
                {
                  offset: 0,
                  color: '#f72806' // 100% 处的颜色
                }
              ], false),*/
              opacity: 0.4
            }
          },
          data: [81, 83, 60, 70, 6, 24, 62, 53, 16, 73, 17, 5]
        }

      ]
    };
    // 车辆滞留时间排名
    this.optionsRetention = {
      title: {
        text: '车辆滞留时间排名',
        left: 'center',
        textStyle: {
          color: 'white',
          fontWeight: 500,
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params) {
          console.log(params);
          return params[0].name + ': ' + params[0].value;
        }
      },
      grid: {
        left: '3%',
        top: '3%',
        bottom: '3%',
        right: '3%',
        containLabel: true
      },
      xAxis: {
        data: ['第一名', '第二名', '第三名', '第四名', '第五名'],
        axisTick: {show: false},
        axisLine: {show: false},
        color: 'white',
        axisLabel: {
          textStyle: {
            color: '#E57D0D'
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false}
      },
      series: [
        {
          name: 'hill',
          type: 'pictorialBar',
          barCategoryGap: '-130%',
          color: ['#7E18E7', '#ED5352', '#1874E7', '#E79B18', '#32CC7E'],
          // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
          symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
          itemStyle: {
            normal: {
              opacity: 0.5
            },
            emphasis: {
              opacity: 1
            }
          },
          data: [123, 60, 25, 18, 12],
          z: 10
        },
      ]
    };
    // 车型日分布分析
    this.optionsCarModel = {
      title: {
        text: '当日车型分布分析',
        top: 5,
        right: 'center',
        textStyle: {
          color: 'white',
          fontSize: 12,
          fontWeight: 'normal',
          align: 'center'
        }
      },
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
          data: [
            {
              value: 10,
              name: '轿车',
              itemStyle: {color: '#E64018'}
            },
            {
              value: 15,
              name: '货车',
              itemStyle: {color: '#FBB034'}
            },
            {
              value: 10,
              name: '商务车',
              itemStyle: {color: '#FEEB23'}
            },
            {
              value: 12,
              name: '大客车',
              itemStyle: {color: '#E30B40'}
            },
            {
              value: 6,
              name: '小客车',
              itemStyle: {color: '#3291DD'}
            },
            {
              value: 4,
              name: '其他',
              itemStyle: {color: '#8B489E'}
            },
          ],
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
    // 月度收入分析
    this.optionsMonth = {
      color: ['#00D7F7'],
      title: [
        {
          text: '月度收入走势(万元）',
          left: '1%',
          top: '1%',
          textStyle: {
            color: 'white',
            fontSize: 12,
            fontWeight: 'normal',
            align: 'center'
          }
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '1%',
        top: '16%',
        bottom: '6%',
        containLabel: true
      },
      toolbox: {
        'show': false,
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        'axisLine': {
          lineStyle: {
            color: '#FF4500'
          }
        },
        'axisTick': {
          'show': false
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        boundaryGap: false,
        data: ['一月', '二月', '三月', '四月', '五月', '六月']
      },
      yAxis: {
        'axisLine': {
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#fff'
          }
        },
        'axisTick': {
          'show': false
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        type: 'value'
      },
      series: [
        {
        name: '在大理',
        smooth: true,
        type: 'line',
        symbolSize: 8,
        symbol: 'circle',
        data: [90, 50, 39, 50, 120, 82]
      },
       ]
    };
    //  阅读收入前五名排名对比
    this.optionsIncome = this.packOption();
  }
  public packOption(): any {
    let yAxisMonth = [
      '第一名',
      '第二名',
      '第三名',
      '第四名',
      '第五名',

    ];
    let barData = [
      913,
      894,
      884,
      833,
      785,
    ];
    let barDataTwo = [];
    let coordData2 = [];
    let coordData = [];
    for (let i = 0; i < barData.length; i++) {
      barDataTwo.push(Math.max.apply(Math, barData) + 5000);
      coordData.push({
        'coord': [Number(barData[i]) - 1, i]
      });
      coordData2.push({
        'coord': [Math.max.apply(Math, barData) + 5000, i]
      });
    }
    let option = {
      title: [
        {
          text: '月度收入前五名收入对比(万元）',
          left: '1%',
          top: '1%',
          textStyle: {
            color: 'white',
            fontSize: 12,
            fontWeight: 'normal',
            align: 'center'
          }
        }
      ],
      legend: null,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params) {
          return params[0].name + '<br/>' + '今日总收入: ' + params[0].value + '元';
        }
      },
      grid: {
        left: '19%',
        top: '10%',
        bottom: '6%',
        right: '5%',
        containLabel: true
      },
      yAxis: [{
        data: yAxisMonth,
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 12,
            color: '#42a5c2',
          },
          formatter: function (value) {
            return '{Sunny|' + value + '}';
          },
          rich: {
            value: {
              lineHeight: 30,
            },
            Sunny: {
              // width: 70,
              height: 35,
              padding: [0, 10, 0, 10],
              align: 'center',
              backgroundColor: {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAjCAYAAADsZeb8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIxNzQ2ODFCQkVFNjExRTc4OEU3QzFEMjE5RjExOEZBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIxNzQ2ODFDQkVFNjExRTc4OEU3QzFEMjE5RjExOEZBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjE3NDY4MTlCRUU2MTFFNzg4RTdDMUQyMTlGMTE4RkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjE3NDY4MUFCRUU2MTFFNzg4RTdDMUQyMTlGMTE4RkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7fNMa8AAABg0lEQVR42uzaMUvDQBgG4O+7pJS0ghVBOkknK06dAh38E126uji4iogtzlFBcNTi4urin3CoOHWytpM41aJYxTa2Te4sWgpWA2lufV8I4ULuOB747m44VkrRdIydXoa8bpGZC8Qxm5Sk74fG76D2+Bv/+UdF6BNuDA47N1K/+wTMI7itiAPnPoVobL87JMwSfzxWRadeE+2bJn8+9wj5Pywq5gRv10uR7FdJDpJm/aws3hovEAqXCSLJYZV7rddYzTkBy2wRP2ug65DfT44AL0ASAdHYowwZ8ZLZOD8FR9Ry9twiu0+jTeQea2DkcmZREJ27Gih0EI24LVrXTVBobizstnEO1EVEgAhEICJABCIQgYgAEYhABCICRCACEYhIWERlLSVAoYPo929len0FFDqISl7J1FoOFDqIpnWp5pbzMrW6CI6IiP4hPYxK+sDLbm6BQ2Nj8Y+tMhnx7jBX3gCJzhFHxPIqkV4Y2Ef7cj6L0p4huJ+oLSgqjJuy+jdlvwQYAN1TdkgsoTftAAAAAElFTkSuQmCC'
              }
            }
          }
        }
      },
        {
          data: yAxisMonth,
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
        },
      ],
      xAxis: [{
        type: 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      }, {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      }],
      series: [{
        z: 10,
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: '民警',
        type: 'pictorialBar',
        data: barData,
        barCategoryGap: '80%',
        label: {
          normal: {
            show: true,
            position: 'inside',
            textStyle: {
              fontSize: 12,
              color: '#00ffff'
            }
          }
        },
        symbolRepeat: false,
        symbolSize: ['100%', 33],
        symbolOffset: [-16.5, 0],
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#083e6d',
            },
              {
                offset: 0.5,
                color: '#0272f2',
                opacity: 0.7
              }, {
                offset: 1,
                color: '#083e6d',
                opacity: 0.5
              }
            ], false),
          }
        },
        symbolClip: true,
        symbolPosition: 'end',
        symbol: 'rect',
        // symbol: 'path://M0 0 L0 60 L225 60 L300 0 Z',
        markPoint: {
          data: coordData,
          symbolSize: [33, 33],
          symbolOffset: [-0.5, 0],
          z: 3,
          label: {
            normal: {
              show: false
            }
          },
          symbolClip: true,
          symbol: 'path://M 300 100 L 100 100 L 100 300 z',

        }
      },
        {
          z: 6,
          xAxisIndex: 1,
          yAxisIndex: 1,
          animation: false,
          name: '民警',
          type: 'pictorialBar',
          data: barDataTwo,
          barCategoryGap: '80%',
          label: {
            normal: {
              show: false,
              position: 'inside',
              textStyle: {
                fontSize: 12,
                color: '#00ffff'
              }
            }
          },
          symbolRepeat: false,
          symbolSize: ['100%', 33],
          symbolOffset: [-16.5, 0],
          itemStyle: {
            normal: {
              color: '#00abc5',
              opacity: 0.085
            }
          },
          symbolClip: true,
          symbol: 'rect',
          markPoint: {
            data: coordData2,
            symbolSize: [33, 33],
            symbolOffset: [-0.5, 0],
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#00abc5',
                opacity: 0.085
              }
            },
            symbolClip: true,
            symbol: 'path://M 300 100 L 100 100 L 100 300 z',
            // animationDelay:100
            // animationDuration:1200
            // animation:false
            // animationDurationUpdate :1000
          }
        },
      ]
    };
    return option;
  }

}
