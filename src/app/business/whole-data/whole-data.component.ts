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
import {Router} from '@angular/router';

declare let BMap;
declare let BMapLib;

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
    public router: Router
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
          bmap: {
            center: [108.903921, 34.459004],
            zoom: 6,
            roam: false,
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
          /* series: [
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
           ]*/
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

  // 百度地图画省边界外
  public centerMap2() {
    const that = this;
    const map = new BMap.Map('center_map', {minZoom: 5});
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
    map.centerAndZoom(new BMap.Point(108.625087, 31.826263), 5);
    map.enableScrollWheelZoom(false);
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
    /* const b = new BMap.Bounds(new BMap.Point(105.75777, 24.618423), new BMap.Point(109.400435, 30.469081));
     try {
       BMapLib.AreaRestriction.setBounds(map, b);
     } catch (e) {
       alert(e);
     }*/

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
      // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
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
    /* for (let i = 0; i < pointsMarket.length; i++) {
       const points = new BMap.Point(pointsMarket[i][0], pointsMarket[i][1]);
       addMarker(points, pointsMarket[i][2], pointsMarket[i][3]);
     }*/

    // 绘制边线轮廓
    let provinces = [
      '北京市',
      '上海市',
      '天津市',
      '重庆市',
      '河北省',
      '山西省',
      '内蒙古自治区',
      '辽宁省',
      '吉林省',
      '黑龙江省',
      '江苏省',
      '浙江省',
      '安徽省',
      '福建省',
      '江西省',
      '山东省',
      '河南省',
      '湖北省',
      '湖南省',
      '广东省',
      '广西壮族自治区',
      '海南省',
      '四川省',
      '贵州省',
      '云南省,',
      '西藏自治区',
      '陕西省">陕西省',
      '甘肃省',
      '宁夏回族自治区',
      '青海省',
      '新疆',
      '香港特别行政区',
      '澳门特别行政区',
      '台湾省'];
    function getBoundary(name) {
      const bdary = new BMap.Boundary();
      function randomRgbColor() { // 随机生成RGB颜色
        let r = Math.floor(Math.random() * 256); // 随机生成256以内r值
        let g = Math.floor(Math.random() * 256); // 随机生成256以内g值
        let b = Math.floor(Math.random() * 256); // 随机生成256以内b值
        return `rgb(${r},${g},${b})`; // 返回rgb(r,g,b)格式颜色
      }
       let colors = randomRgbColor();
      bdary.get(name, function (rs) {       // 获取行政区域
        for (var i = 0; i < rs.boundaries.length; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 1,
            strokeColor: colors,
            fillColor: colors,
            fillOpacity: 0.3
          }); // 建立多边形覆盖物
          map.addOverlay(ply);  // 添加覆盖物
          // map.setViewport(ply.getPath());    //调整视野
        }
      });
    }

    for (let i = 0; i <= provinces.length; i++) {
      getBoundary(provinces[i]);
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
        const addComp = rs.addressComponents;
        // alert(addComp.province);
        if (addComp.province === '贵州省') {
          that.router.navigate(['/home/finance']);
        } else {
          window.alert(addComp.province + '暂无数据，敬请期待');
        }
      });
    });
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
    // this.centerMap();
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
