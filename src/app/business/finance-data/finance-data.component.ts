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

declare let echarts;

@Component({
  selector: 'app-finance-data',
  templateUrl: './finance-data.component.html',
  styleUrls: ['./finance-data.component.css']
})
export class FinanceDataComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
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
  public data3d: any;
  // 全国高速服务区分布图
  public optionsMap = {};
  //  业态经营数据前十排名
  public crosswiseBar = {};
  // 全国当日车型日分布分析
  public optionsCarModel = {};
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
    private resolver: ComponentFactoryResolver
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
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

  /**********************************数据*****************************/

  // 全国高速服务区业态数据3d统计
  public packOption3(): any {
    const hours = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const days = ['经营收入', '驻车量', '用电量',  '用水量', '其他'];
    const colorData = ['#313695', '#E30B40', '#3291DD', '#8B489E', '#FEEB23', '#3BF49F', '#01D1DB', '#fdae61', '#f46d43', '#d73027', '#F432AD'];
    this.http.get('assets/data/option3d.json').subscribe(
      (res) => {
        let dataArray = [];
        for (let i = 0; i < 40; i++) {
          dataArray.push([Math.round(Math.random() * 11), Math.round(Math.random() * 4), Math.round(Math.random() * 100)]);
        }
        this.data3d = dataArray;
        this.options3d = {
          title: [
            {
              text: '全国高速服务区业态数据3d统计',
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
              res += `<p style="margin-left: 3px">${days[params.value[1]]}:${params.value[2]}%</p>`;
              return res;
            }
          },
          visualMap: {
            max: 100,
            show: false,
            inRange: {
              color: colorData
            }
          },
          xAxis3D: {
            type: 'category',
            name: '月份',
            data: hours,
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
            data: days,
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
              data: this.data3d.map(function (item) {
                let dada1 = [item[0], item[1], item[2]];
                return {
                  value: dada1
                };
              }),
              shading: 'color',
              label: {
                show: false,
                textStyle: {
                  fontSize: 16,
                  borderWidth: 1
                }
              },
              itemStyle: {
                opacity: 0.4
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
  public china(): any {
    // let that = this;
    // let myChart = echarts.init(document.getElementById('center_map'));
    let geoCoordMap = {
      '海门': [121.15, 31.89],
      '鄂尔多斯': [109.781327, 39.608266],
      '招远': [120.38, 37.35],
      '舟山': [122.207216, 29.985295],
      '齐齐哈尔': [123.97, 47.33],
      '盐城': [120.13, 33.38],
      '赤峰': [118.87, 42.28],
      '青岛': [120.33, 36.07],
      '乳山': [121.52, 36.89],
      '金昌': [102.188043, 38.520089],
      '泉州': [118.58, 24.93],
      '莱西': [120.53, 36.86],
      '日照': [119.46, 35.42],
      '胶南': [119.97, 35.88],
      '南通': [121.05, 32.08],
      '拉萨': [91.11, 29.97],
      '云浮': [112.02, 22.93],
      '梅州': [116.1, 24.55],
      '文登': [122.05, 37.2],
      '上海': [121.48, 31.22],
      '攀枝花': [101.718637, 26.582347],
      '威海': [122.1, 37.5],
      '承德': [117.93, 40.97],
      '厦门': [118.1, 24.46],
      '汕尾': [115.375279, 22.786211],
      '潮州': [116.63, 23.68],
      '丹东': [124.37, 40.13],
      '太仓': [121.1, 31.45],
      '曲靖': [103.79, 25.51],
      '烟台': [121.39, 37.52],
      '福州': [119.3, 26.08],
      '瓦房店': [121.979603, 39.627114],
      '即墨': [120.45, 36.38],
      '抚顺': [123.97, 41.97],
      '玉溪': [102.52, 24.35],
      '张家口': [114.87, 40.82],
      '阳泉': [113.57, 37.85],
      '莱州': [119.942327, 37.177017],
      '湖州': [120.1, 30.86],
      '汕头': [116.69, 23.39],
      '昆山': [120.95, 31.39],
      '宁波': [121.56, 29.86],
      '湛江': [110.359377, 21.270708],
      '揭阳': [116.35, 23.55],
      '荣成': [122.41, 37.16],
      '连云港': [119.16, 34.59],
      '葫芦岛': [120.836932, 40.711052],
      '常熟': [120.74, 31.64],
      '东莞': [113.75, 23.04],
      '河源': [114.68, 23.73],
      '淮安': [119.15, 33.5],
      '泰州': [119.9, 32.49],
      '南宁': [108.33, 22.84],
      '营口': [122.18, 40.65],
      '惠州': [114.4, 23.09],
      '江阴': [120.26, 31.91],
      '蓬莱': [120.75, 37.8],
      '韶关': [113.62, 24.84],
      '嘉峪关': [98.289152, 39.77313],
      '广州': [113.23, 23.16],
      '延安': [109.47, 36.6],
      '太原': [112.53, 37.87],
      '清远': [113.01, 23.7],
      '中山': [113.38, 22.52],
      '昆明': [102.73, 25.04],
      '寿光': [118.73, 36.86],
      '盘锦': [122.070714, 41.119997],
      '长治': [113.08, 36.18],
      '深圳': [114.07, 22.62],
      '珠海': [113.52, 22.3],
      '宿迁': [118.3, 33.96],
      '咸阳': [108.72, 34.36],
      '铜川': [109.11, 35.09],
      '平度': [119.97, 36.77],
      '佛山': [113.11, 23.05],
      '海口': [110.35, 20.02],
      '江门': [113.06, 22.61],
      '章丘': [117.53, 36.72],
      '肇庆': [112.44, 23.05],
      '大连': [121.62, 38.92],
      '临汾': [111.5, 36.08],
      '吴江': [120.63, 31.16],
      '石嘴山': [106.39, 39.04],
      '沈阳': [123.38, 41.8],
      '苏州': [120.62, 31.32],
      '茂名': [110.88, 21.68],
      '嘉兴': [120.76, 30.77],
      '长春': [125.35, 43.88],
      '胶州': [120.03336, 36.264622],
      '银川': [106.27, 38.47],
      '张家港': [120.555821, 31.875428],
      '三门峡': [111.19, 34.76],
      '锦州': [121.15, 41.13],
      '南昌': [115.89, 28.68],
      '柳州': [109.4, 24.33],
      '三亚': [109.511909, 18.252847],
      '自贡': [104.778442, 29.33903],
      '吉林': [126.57, 43.87],
      '阳江': [111.95, 21.85],
      '泸州': [105.39, 28.91],
      '西宁': [101.74, 36.56],
      '宜宾': [104.56, 29.77],
      '呼和浩特': [111.65, 40.82],
      '成都': [104.06, 30.67],
      '大同': [113.3, 40.12],
      '镇江': [119.44, 32.2],
      '桂林': [110.28, 25.29],
      '张家界': [110.479191, 29.117096],
      '宜兴': [119.82, 31.36],
      '北海': [109.12, 21.49],
      '西安': [108.95, 34.27],
      '金坛': [119.56, 31.74],
      '东营': [118.49, 37.46],
      '牡丹江': [129.58, 44.6],
      '遵义': [106.9, 27.7],
      '绍兴': [120.58, 30.01],
      '扬州': [119.42, 32.39],
      '常州': [119.95, 31.79],
      '潍坊': [119.1, 36.62],
      '重庆': [106.54, 29.59],
      '台州': [121.420757, 28.656386],
      '南京': [118.78, 32.04],
      '滨州': [118.03, 37.36],
      '贵阳': [106.71, 26.57],
      '无锡': [120.29, 31.59],
      '本溪': [123.73, 41.3],
      '克拉玛依': [84.77, 45.59],
      '渭南': [109.5, 34.52],
      '马鞍山': [118.48, 31.56],
      '宝鸡': [107.15, 34.38],
      '焦作': [113.21, 35.24],
      '句容': [119.16, 31.95],
      '北京': [116.46, 39.92],
      '徐州': [117.2, 34.26],
      '衡水': [115.72, 37.72],
      '包头': [110, 40.58],
      '绵阳': [104.73, 31.48],
      '乌鲁木齐': [87.68, 43.77],
      '枣庄': [117.57, 34.86],
      '杭州': [120.19, 30.26],
      '淄博': [118.05, 36.78],
      '鞍山': [122.85, 41.12],
      '溧阳': [119.48, 31.43],
      '库尔勒': [86.06, 41.68],
      '安阳': [114.35, 36.1],
      '开封': [114.35, 34.79],
      '济南': [117, 36.65],
      '德阳': [104.37, 31.13],
      '温州': [120.65, 28.01],
      '九江': [115.97, 29.71],
      '邯郸': [114.47, 36.6],
      '临安': [119.72, 30.23],
      '兰州': [103.73, 36.03],
      '沧州': [116.83, 38.33],
      '临沂': [118.35, 35.05],
      '南充': [106.110698, 30.837793],
      '天津': [117.2, 39.13],
      '富阳': [119.95, 30.07],
      '泰安': [117.13, 36.18],
      '诸暨': [120.23, 29.71],
      '郑州': [113.65, 34.76],
      '哈尔滨': [126.63, 45.75],
      '聊城': [115.97, 36.45],
      '芜湖': [118.38, 31.33],
      '唐山': [118.02, 39.63],
      '平顶山': [113.29, 33.75],
      '邢台': [114.48, 37.05],
      '德州': [116.29, 37.45],
      '济宁': [116.59, 35.38],
      '荆州': [112.239741, 30.335165],
      '宜昌': [111.3, 30.7],
      '义乌': [120.06, 29.32],
      '丽水': [119.92, 28.45],
      '洛阳': [112.44, 34.7],
      '秦皇岛': [119.57, 39.95],
      '株洲': [113.16, 27.83],
      '石家庄': [114.48, 38.03],
      '莱芜': [117.67, 36.19],
      '常德': [111.69, 29.05],
      '保定': [115.48, 38.85],
      '湘潭': [112.91, 27.87],
      '金华': [119.64, 29.12],
      '岳阳': [113.09, 29.37],
      '长沙': [113, 28.21],
      '衢州': [118.88, 28.97],
      '廊坊': [116.7, 39.53],
      '菏泽': [115.480656, 35.23375],
      '合肥': [117.27, 31.86],
      '武汉': [114.31, 30.52],
      '大庆': [125.03, 46.58]
    };
    let data = [
      {name: '海门', value: 9},
      {name: '鄂尔多斯', value: 12},
      {name: '招远', value: 12},
      {name: '舟山', value: 12},
      {name: '齐齐哈尔', value: 14},
      {name: '盐城', value: 15},
      {name: '赤峰', value: 16},
      {name: '青岛', value: 18},
      {name: '乳山', value: 18},
      {name: '金昌', value: 19},
      {name: '泉州', value: 21},
      {name: '莱西', value: 21},
      {name: '日照', value: 21},
      {name: '胶南', value: 22},
      {name: '南通', value: 23},
      {name: '拉萨', value: 24},
      {name: '云浮', value: 24},
      {name: '梅州', value: 25},
      {name: '文登', value: 25},
      {name: '上海', value: 25},
      {name: '攀枝花', value: 25},
      {name: '威海', value: 25},
      {name: '承德', value: 25},
      {name: '厦门', value: 26},
      {name: '汕尾', value: 26},
      {name: '潮州', value: 26},
      {name: '丹东', value: 27},
      {name: '太仓', value: 27},
      {name: '曲靖', value: 27},
      {name: '烟台', value: 28},
      {name: '福州', value: 29},
      {name: '瓦房店', value: 30},
      {name: '即墨', value: 30},
      {name: '抚顺', value: 31},
      {name: '玉溪', value: 31},
      {name: '张家口', value: 31},
      {name: '阳泉', value: 31},
      {name: '莱州', value: 32},
      {name: '湖州', value: 32},
      {name: '汕头', value: 32},
      {name: '昆山', value: 33},
      {name: '宁波', value: 33},
      {name: '湛江', value: 33},
      {name: '揭阳', value: 34},
      {name: '荣成', value: 34},
      {name: '连云港', value: 35},
      {name: '葫芦岛', value: 35},
      {name: '常熟', value: 36},
      {name: '东莞', value: 36},
      {name: '河源', value: 36},
      {name: '淮安', value: 36},
      {name: '泰州', value: 36},
      {name: '南宁', value: 37},
      {name: '营口', value: 37},
      {name: '惠州', value: 37},
      {name: '江阴', value: 37},
      {name: '蓬莱', value: 37},
      {name: '韶关', value: 38},
      {name: '嘉峪关', value: 38},
      {name: '广州', value: 38},
      {name: '延安', value: 38},
      {name: '太原', value: 39},
      {name: '清远', value: 39},
      {name: '中山', value: 39},
      {name: '昆明', value: 39},
      {name: '寿光', value: 40},
      {name: '盘锦', value: 40},
      {name: '长治', value: 41},
      {name: '深圳', value: 41},
      {name: '珠海', value: 42},
      {name: '宿迁', value: 43},
      {name: '咸阳', value: 43},
      {name: '铜川', value: 44},
      {name: '平度', value: 44},
      {name: '佛山', value: 44},
      {name: '海口', value: 44},
      {name: '江门', value: 45},
      {name: '章丘', value: 45},
      {name: '肇庆', value: 46},
      {name: '大连', value: 47},
      {name: '临汾', value: 47},
      {name: '吴江', value: 47},
      {name: '石嘴山', value: 49},
      {name: '沈阳', value: 50},
      {name: '苏州', value: 50},
      {name: '茂名', value: 50},
      {name: '嘉兴', value: 51},
      {name: '长春', value: 51},
      {name: '胶州', value: 52},
      {name: '银川', value: 52},
      {name: '张家港', value: 52},
      {name: '三门峡', value: 53},
      {name: '锦州', value: 54},
      {name: '南昌', value: 54},
      {name: '柳州', value: 54},
      {name: '三亚', value: 54},
      {name: '自贡', value: 56},
      {name: '吉林', value: 56},
      {name: '阳江', value: 57},
      {name: '泸州', value: 57},
      {name: '西宁', value: 57},
      {name: '宜宾', value: 58},
      {name: '呼和浩特', value: 58},
      {name: '成都', value: 58},
      {name: '大同', value: 58},
      {name: '镇江', value: 59},
      {name: '桂林', value: 59},
      {name: '张家界', value: 59},
      {name: '宜兴', value: 59},
      {name: '北海', value: 60},
      {name: '西安', value: 61},
      {name: '金坛', value: 62},
      {name: '东营', value: 62},
      {name: '牡丹江', value: 63},
      {name: '遵义', value: 63},
      {name: '绍兴', value: 63},
      {name: '扬州', value: 64},
      {name: '常州', value: 64},
      {name: '潍坊', value: 65},
      {name: '重庆', value: 66},
      {name: '台州', value: 67},
      {name: '南京', value: 67},
      {name: '滨州', value: 70},
      {name: '贵阳', value: 71},
      {name: '无锡', value: 71},
      {name: '本溪', value: 71},
      {name: '克拉玛依', value: 72},
      {name: '渭南', value: 72},
      {name: '马鞍山', value: 72},
      {name: '宝鸡', value: 72},
      {name: '焦作', value: 75},
      {name: '句容', value: 75},
      {name: '北京', value: 79},
      {name: '徐州', value: 79},
      {name: '衡水', value: 80},
      {name: '包头', value: 80},
      {name: '绵阳', value: 80},
      {name: '乌鲁木齐', value: 84},
      {name: '枣庄', value: 84},
      {name: '杭州', value: 84},
      {name: '淄博', value: 85},
      {name: '鞍山', value: 86},
      {name: '溧阳', value: 86},
      {name: '库尔勒', value: 86},
      {name: '安阳', value: 90},
      {name: '开封', value: 90},
      {name: '济南', value: 92},
      {name: '德阳', value: 93},
      {name: '温州', value: 95},
      {name: '九江', value: 96},
      {name: '邯郸', value: 98},
      {name: '临安', value: 99},
      {name: '兰州', value: 99},
      {name: '沧州', value: 100},
      {name: '临沂', value: 103},
      {name: '南充', value: 104},
      {name: '天津', value: 105},
      {name: '富阳', value: 106},
      {name: '泰安', value: 112},
      {name: '诸暨', value: 112},
      {name: '郑州', value: 113},
      {name: '哈尔滨', value: 114},
      {name: '聊城', value: 116},
      {name: '芜湖', value: 117},
      {name: '唐山', value: 119},
      {name: '平顶山', value: 119},
      {name: '邢台', value: 119},
      {name: '德州', value: 120},
      {name: '济宁', value: 120},
      {name: '荆州', value: 127},
      {name: '宜昌', value: 130},
      {name: '义乌', value: 132},
      {name: '丽水', value: 133},
      {name: '洛阳', value: 134},
      {name: '秦皇岛', value: 136},
      {name: '株洲', value: 143},
      {name: '石家庄', value: 147},
      {name: '莱芜', value: 148},
      {name: '常德', value: 152},
      {name: '保定', value: 153},
      {name: '湘潭', value: 154},
      {name: '金华', value: 157},
      {name: '岳阳', value: 169},
      {name: '长沙', value: 175},
      {name: '衢州', value: 177},
      {name: '廊坊', value: 193},
      {name: '菏泽', value: 194},
      {name: '合肥', value: 229},
      {name: '武汉', value: 273},
      {name: '大庆', value: 279}
    ];
    let convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    };
    let convertedData = [
      convertData(data),
      convertData(data.sort(function (a, b) {
        return b.value - a.value;
      }).slice(0, 6))
    ];
    let option = {
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicInOut',
      animationDurationUpdate: 1000,
      animationEasingUpdate: 'cubicInOut',
      title: [
        {
          text: '全国主要高速服务区分布及流量统计',
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
        map: this.mapName,
        left: 'center',
        // right: 'center',
        center: [101.74, 36.56],
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
          name: '车辆驻车量',
          type: 'scatter',
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
    return option;
    // myChart.setOption(option);
    // this.eventsService.eventBus.subscribe((value) => {
    //   myChart.resize();
    // });
    /* window.addEventListener('resize', function() {
       myChart.resize();
     });*/
  }

  // 全国业态经营数据前十排名
  public backCrosswiseBar(): any {
    return {
      title: [
        {
          text: '全国业态经营数据前十排名',
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
        data: ['第十名', '第九名', '第八名', '第七名', '第六名', '第五名', '第四名', '第三名', '第二名', '第一名'],
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
          data: [120, 140, 160, 180, 200, 220, 240, 260, 280, 300],
          color: '#FBB034',
        }
      ]
    };
  }

  // 当日服务区驻车量排名
  public packOption(): any {
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
  }

  // 当日服务区收入排名
  public packOption1(): any {
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
  }

  // 图表更新
  public updataEcharts(): void {

    // 3D柱状图
    this.packOption3();

    //  高速服务区分布散点统计
    this.optionsMap = this.china();

    // 业态经营数据前十排名
    this.crosswiseBar = this.backCrosswiseBar();

    // 全国当日车型日分布类型占比分析
    this.optionsCarModel = {
      title: [
        {
          text: '全国当日车型日分布类型占比分析',
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

    // 全国当日收入类型占比分析
    this.optionsIncomeModel = {
      title: [
        {
          text: '全国当日收入类型占比分析',
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

    // 服务区当日停车量排名
    this.optionsRetention = this.packOption();

    // 服务区当日收入排名
    this.optionsIncome = this.packOption1();

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
    console.log(params);
    if (params.componentSubType === 'scatter') {
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
  public eventClick():void {
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

  public provinceMouseEnter() {
    this.cityShow = true;
    this.http.get('assets/data/city.json').subscribe(
      (res) => {
        this.city = res[0].children;
        this.citeDate = res[0].province;
      }
    );
  }

  public provinceDataClick(item) {
    if (item.name === 'china') {
      this.mapName = 'china';
      this.mapCenter = [117.98561551896913, 31.205000490896193];
      this.mapZoom = 0.8;
      this.mapLeft = '5%';
      this.mapRight = '15%';
      this.china();
    } else {
      this.mapName = '贵州';
      this.mapLeft = '5%';
      this.mapRight = '0%';
      this.mapCenter = [106.682234, 26.626655];
      this.mapZoom = 0.5;
      this.china();
    }
    this.selectDate = item.province;
    this.provinceShow = false;
    this.cityShow = false;
  }

  public cityDataClick(item) {
    if (item.name === 'china') {
      this.mapName = 'china';
      this.mapCenter = [117.98561551896913, 31.205000490896193];
      this.mapZoom = 0.8;
      this.mapLeft = '5%';
      this.mapRight = '15%';
      this.china();
    } else {
      this.mapName = '贵州';
      this.mapLeft = '5%';
      this.mapRight = '0%';
      this.mapCenter = [106.682234, 26.626655];
      this.mapZoom = 0.5;
      this.china();
    }
    this.selectDate = this.citeDate + item.city;
    this.provinceShow = false;
    this.cityShow = false;
  }

  public provinceMouseLeave() {
  }
}
