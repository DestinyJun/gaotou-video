import {
  AfterContentInit, AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef, HostListener,
  OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxEchartsService} from 'ngx-echarts';
import {ChildDataMapComponent} from './child-data-map/child-data-map.component';
import {EventsService} from '../../common/services/events.service';
import {ChildDataListComponent} from './child-data-list/child-data-list.component';
import {Data3dService} from '../../common/services/data3d.service';
import {CentermapService} from '../../common/services/centermap.service';
import {DiagramService} from '../../common/services/diagram.service';
declare let BMap;
declare let BMapLib;
@Component({
  selector: 'app-finance-data',
  templateUrl: './finance-data.component.html',
  styleUrls: ['./finance-data.component.css']
})
export class FinanceDataComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
  // 全国、省级数据切换
  public dataToggle = '贵州省';
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

  // 动态创建组件
  @ViewChild('alertBox', {read: ViewContainerRef})
  alertBox: ViewContainerRef;
  comp1: ComponentRef<ChildDataMapComponent>;

  // 动态创建组件
  @ViewChild('alertDate', {read: ViewContainerRef})
  alertDate: ViewContainerRef;
  comp2: ComponentRef<ChildDataListComponent>;

  /*  // 监听组件点击事件
    @HostListener('click') onComponentClick() {
      if (this.provinceShow === true || this.cityShow === true) {
        this.provinceShow = false;
        this.cityShow = false;
      }
    }*/
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

  ngAfterContentInit(): void {}

  ngAfterViewInit(): void {}

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
        this.optionsMap =  {
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
  // 省级服务区切换
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
    const geoValue =   [
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
        data:  convertData(geoValue),
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
          return  `<div><p>${params.name}高速服务区</p><p>驻车量：${params.value[2]}</p></div>`;
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
  // 百度地图画省边界外
  public centerMap2() {
    const map = new BMap.Map('center_map');
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
            'color': '#0045C4',
            'weight': '0.1',
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
    map.centerAndZoom(new BMap.Point(106.640265, 26.653005), 8);
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
    const b = new BMap.Bounds(new BMap.Point(105.75777, 24.618423), new BMap.Point(109.400435, 30.469081));
    try {
      BMapLib.AreaRestriction.setBounds(map, b);
    } catch (e) {
      alert(e);
    }

    // 编写自定义函数,创建标注
    const pointsMarket = [
      [106.626806, 26.683542, '贵阳服务区', 80],
      [104.842269, 26.625681, '遵义服务区', 150],
      [105.293002, 27.301609, '六盘水服务区', 300],
      [106.93956, 27.760846, '毕节服务区', 781],
      [106.994752, 26.0953, '安顺服务区', 198]
    ];

    function addMarker(point, name, num) {
      var myIcon = new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/fox.gif', new BMap.Size(200, 130));
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      //跳动的动画
      marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      // market事件
      marker.addEventListener('mouseover', function () {
        var sContent =
          `<div style="">
                    <h5>${name}</h5> 
                    <p>驻车量：${num}辆</p> 
                </div>`;
        // 创建信息窗口对象
        var infoWindow = new BMap.InfoWindow(sContent, {enableCloseOnClick: true});
        this.openInfoWindow(infoWindow);
      });
    }

    // 添加5标注
    for (let i = 0; i < pointsMarket.length; i++) {
      const points = new BMap.Point(pointsMarket[i][0], pointsMarket[i][1]);
      addMarker(points, pointsMarket[i][2], pointsMarket[i][3]);
    }

    // 绘制边线轮廓
    function getBoundary(name, color) {
      var bdary = new BMap.Boundary();
      bdary.get(name, function (rs) {       //获取行政区域
        for (var i = 0; i < rs.boundaries.length; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: color,
            fillColor: '',
            // fillOpacity: 0.05
          }); //建立多边形覆盖物
          map.addOverlay(ply);  //添加覆盖物
          // map.setViewport(ply.getPath());    //调整视野
        }
      });
    }

    getBoundary('贵州省', '#00FF00');
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

  // 全国业态经营数据前十排名
  public backCrosswiseBar() {
    this.diagrams.getIncomerRanked().subscribe(
      (value) => {
        /*this.crosswiseBar = {
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
        };*/
        this.crosswiseBar =   {
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

  // 当日服务区驻车量排名
  /*public packOption(): any {
    let yAxisMonth = [
      '瓮安东服务区',
      '桐子服务区',
      '六枝服务区',
      '红果服务区',
      '水城服务区',
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
          text: '当日服务区驻车量排名',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
      ],
      legend: null,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params) {
          return params[0].name + '<br/>' + '今日驻车量: ' + params[0].value + '辆';
        }
      },
      grid: {
        left: '10%',
        top: '10%',
        bottom: '3%',
        right: '5%',
        containLabel: true
      },
      yAxis: [
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
          margin: 10,
          textStyle: {
            fontSize: 12,
            color: '#1ED1D8',
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
      xAxis: [
        {
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
      },
        {
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
      series: [
        {
        z: 10,
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: '车流量排名',
        type: 'pictorialBar',
        data: barData,
        barCategoryGap: '80%',
        label: {
          normal: {
            show: true,
            position: 'inside',
            textStyle: {
              fontSize: 12,
              color: '#002240'
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
              color: '#13BF84',
            },
              {
                offset: 0.5,
                color: '#1ED1D8',
                opacity: 0.7
              }, {
                offset: 1,
                color: '#08A8AE',
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
          name: '车流量排名',
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
  }*/

  // 当日服务区收入排名
  /*public packOption1(): any {
    let yAxisMonth = [
      '红果服务区',
      '水城服务区',
      '桐子服务区',
      '六枝服务区',
      '瓮安东服务区',
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
          text: '当日服务区收入排名',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
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
        left: '10%',
        top: '10%',
        bottom: '3%',
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
        name: '收入排名',
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
          name: '收入排名',
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
  }*/

  // 图表更新
  public updataEcharts(): void {

    // 3D柱状图
    this.packOption3();
    //  高速服务区分布散点统计
    // this.centerMap();
    // this.centerMap1();
    this.centerMap2();
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
    const childComp1 = this.resolver.resolveComponentFactory(ChildDataMapComponent);
    if (params.componentSubType === 'effectScatter') {
      if (this.alertMapBoxShow) {
        this.alertMapBoxShow = false;
        this.comp1 = this.alertBox.createComponent(childComp1);
        this.alertMapTitle = params.name;
      } else {
        this.destoryChild1();
        this.alertMapBoxShow = true;
        /* that.comp1 = that.alertBox.createComponent(childComp1);
         that.alertMapTitle = params.name;*/
      }
    }
  }

  // 驻车量排名相关操作
  public parkClick(e): void {
    const childComp2 = this.resolver.resolveComponentFactory(ChildDataListComponent);
    if (this.alertDateBoxShow) {
      this.alertDateBoxShow = false;
      this.comp2 = this.alertDate.createComponent(childComp2);
      this.comp2.instance.typeTitle = e.seriesName;
      this.alertDateTitle = e.seriesName;
    } else {
      this.destoryChild2();
    }
  }

  // 事件列表相关操作
  public eventClick(): void {
    const childComp2 = this.resolver.resolveComponentFactory(ChildDataListComponent);
    if (this.alertDateBoxShow) {
      this.alertDateBoxShow = false;
      this.comp2 = this.alertDate.createComponent(childComp2);
      this.comp2.instance.typeTitle = '事件监控';
      this.alertDateTitle = '事件监控';
    } else {
      this.destoryChild2();
    }
  }

  // 驻车量排名相关操作
  public incomeClick(e): void {
    const childComp2 = this.resolver.resolveComponentFactory(ChildDataListComponent);
    if (this.alertDateBoxShow) {
      this.alertDateBoxShow = false;
      this.comp2 = this.alertDate.createComponent(childComp2);
      this.comp2.instance.typeTitle = e.seriesName;
      this.alertDateTitle = e.seriesName;
    } else {
      this.destoryChild2();
    }
  }

  // 组建创建相关操作
  public destoryChild1(): void {
    this.alertMapBoxShow = true;
    this.comp1.destroy();
  }
  public destoryChild2(): void {
    this.alertDateBoxShow = true;
    this.comp2.destroy();
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
      this.centerMap1();
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
