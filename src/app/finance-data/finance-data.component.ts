import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxEchartsService} from 'ngx-echarts';

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
        text: '车流实时监控',
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
        left: '8%',
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
      xAxis: {
        data: ['第一名', '第二名', '第三名', '第四名', '第五名'],
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          textStyle: {
            color: '#e54035'
          }
        }
      },
      yAxis: {
        splitLine: {show: false},
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false}
      },
      color: ['red'],
      series: [
        {
          name: 'hill',
          type: 'pictorialBar',
          barCategoryGap: '-130%',
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
  }

}
