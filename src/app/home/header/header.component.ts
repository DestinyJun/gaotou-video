import { Component, OnInit } from '@angular/core';
import {ToolsService} from '../../common/services/tools.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../common/services/local-storage.service';
import {NgxEchartsService} from 'ngx-echarts';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // 路由状态及名称
  public flagState: string;
  public flagName: string;
  // 时间
  public dataTime = new Date();
  // 顶部标题
  public headerTitle: string;
  // 客流量
  public personNum = 60000;
  public persons = [];
  // 弹窗
  public serviceZonePersonAlert = false;
  public cityPersonAlert = false;
  public cityOptions = {};
  constructor(
    private tools: ToolsService,
    private routerInfo: ActivatedRoute,
    private localService: LocalStorageService,
    private es: NgxEchartsService,
  ) { }

  ngOnInit() {
    // this.amount();
    this.personNum.toString().split('').map((value, index) => {
      this.persons.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
    });
    setInterval(() => {
      this.dataTime = new Date();
    });
    // 路由接受参数
    this.routerInfo.params.subscribe(
      (params) => {
        // this.headerTitle = params.name;
        // console.log(this.headerTitle);
        // this.serviceZonePoint = params.point.split(',');
        // console.log(this.serviceZonePoint);
      }
    );
    // 获取url地址
    // this.getUrl();

    // 订阅title以及车流事件
    this.localService.eventBus.subscribe((value) => {
      this.headerTitle = value.title;
      this.flagState = value.flagState;
      this.flagName = value.flagName;
    });
    this.localService.persons.subscribe((value) => {
      this.persons = value;
    });
    // echart图表建立
    this.buildEchart();
  }
  // 客流量实时监控
  public amount(): void {
    setInterval(() => {
      const b = [];
      this.personNum += Math.round(Math.random() * 10);
      this.personNum.toString().split('').map((value, index) => {
        b.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
        this.persons = b;
      });
    }, 3000);
  }
  // 客流量弹窗
  public personClick() {
    if (this.flagState === 'serzone') {
      this.serviceZonePersonAlert = true;
    } else {
      this.cityPersonAlert = true;
    }
  }
  public closePersonAlert() {
      this.serviceZonePersonAlert = false;
      this.cityPersonAlert = false;
  }
  // 省市级地图函数
  public buildEchart() {
    const mapName = 'china';
    const data = [
      {name: '北京', value: 177},
      {name: '天津', value: 42},
      {name: '河北', value: 102},
      {name: '山西', value: 81},
      {name: '内蒙古', value: 47},
      {name: '辽宁', value: 67},
      {name: '吉林', value: 82},
      {name: '黑龙江', value: 66},
      {name: '上海', value: 24},
      {name: '江苏', value: 92},
      {name: '浙江', value: 114},
      {name: '安徽', value: 109},
      {name: '福建', value: 116},
      {name: '江西', value: 91},
      {name: '山东', value: 119},
      {name: '河南', value: 137},
      {name: '湖北', value: 116},
      {name: '湖南', value: 114},
      {name: '重庆', value: 91},
      {name: '四川', value: 125},
      {name: '贵州', value: 62},
      {name: '云南', value: 83},
      {name: '西藏', value: 9},
      {name: '陕西', value: 80},
      {name: '甘肃', value: 56},
      {name: '青海', value: 10},
      {name: '宁夏', value: 18},
      {name: '新疆', value: 67},
      {name: '广东', value: 123},
      {name: '广西', value: 59},
      {name: '海南', value: 14},
    ];
    const geoCoordMap = {};
    const toolTipData = [
      {name: '北京', value: [{name: '文科', value: 95}, {name: '理科', value: 82}]},
      {name: '天津', value: [{name: '文科', value: 22}, {name: '理科', value: 20}]},
      {name: '河北', value: [{name: '文科', value: 60}, {name: '理科', value: 42}]},
      {name: '山西', value: [{name: '文科', value: 40}, {name: '理科', value: 41}]},
      {name: '内蒙古', value: [{name: '文科', value: 23}, {name: '理科', value: 24}]},
      {name: '辽宁', value: [{name: '文科', value: 39}, {name: '理科', value: 28}]},
      {name: '吉林', value: [{name: '文科', value: 41}, {name: '理科', value: 41}]},
      {name: '黑龙江', value: [{name: '文科', value: 35}, {name: '理科', value: 31}]},
      {name: '上海', value: [{name: '文科', value: 12}, {name: '理科', value: 12}]},
      {name: '江苏', value: [{name: '文科', value: 47}, {name: '理科', value: 45}]},
      {name: '浙江', value: [{name: '文科', value: 57}, {name: '理科', value: 57}]},
      {name: '安徽', value: [{name: '文科', value: 57}, {name: '理科', value: 52}]},
      {name: '福建', value: [{name: '文科', value: 59}, {name: '理科', value: 57}]},
      {name: '江西', value: [{name: '文科', value: 49}, {name: '理科', value: 42}]},
      {name: '山东', value: [{name: '文科', value: 67}, {name: '理科', value: 52}]},
      {name: '河南', value: [{name: '文科', value: 69}, {name: '理科', value: 68}]},
      {name: '湖北', value: [{name: '文科', value: 60}, {name: '理科', value: 56}]},
      {name: '湖南', value: [{name: '文科', value: 62}, {name: '理科', value: 52}]},
      {name: '重庆', value: [{name: '文科', value: 47}, {name: '理科', value: 44}]},
      {name: '四川', value: [{name: '文科', value: 65}, {name: '理科', value: 60}]},
      {name: '贵州', value: [{name: '文科', value: 32}, {name: '理科', value: 30}]},
      {name: '云南', value: [{name: '文科', value: 42}, {name: '理科', value: 41}]},
      {name: '西藏', value: [{name: '文科', value: 5}, {name: '理科', value: 4}]},
      {name: '陕西', value: [{name: '文科', value: 38}, {name: '理科', value: 42}]},
      {name: '甘肃', value: [{name: '文科', value: 28}, {name: '理科', value: 28}]},
      {name: '青海', value: [{name: '文科', value: 5}, {name: '理科', value: 5}]},
      {name: '宁夏', value: [{name: '文科', value: 10}, {name: '理科', value: 8}]},
      {name: '新疆', value: [{name: '文科', value: 36}, {name: '理科', value: 31}]},
      {name: '广东', value: [{name: '文科', value: 63}, {name: '理科', value: 60}]},
      {name: '广西', value: [{name: '文科', value: 29}, {name: '理科', value: 30}]},
      {name: '海南', value: [{name: '文科', value: 8}, {name: '理科', value: 6}]},
    ];
    const mapFeatures = this.es.getMap(mapName).geoJson.features;
    mapFeatures.forEach(function(v) {
      // 地区名称
      const name = v.properties.name;
      // 地区经纬度
      geoCoordMap[name] = v.properties.cp;
    });
    const max = 480, min = 9;
    const maxSize4Pin = 100, minSize4Pin = 20;
    const convertData = function (datas) {
      const res = [];
      for (let i = 0; i < datas.length; i++) {
        const geoCoord = geoCoordMap[datas[i].name];
        if (geoCoord) {
          res.push({
            name: datas[i].name,
            value: geoCoord.concat(datas[i].value),
          });
        }
      }
      return res;
    };
    this.cityOptions = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          if (typeof(params.value)[2] === 'undefined') {
            let toolTiphtml = '';
            for (let i = 0; i < toolTipData.length; i++) {
              if (params.name === toolTipData[i].name) {
                toolTiphtml += toolTipData[i].name + ':<br>';
                for (let j = 0; j < toolTipData[i].value.length; j++) {
                  toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + '<br>';
                }
              }
            }
            console.log(toolTiphtml);
            // console.log(convertData(data))
            return toolTiphtml;
          } else {
            let toolTiphtml = '';
            for (let i = 0; i < toolTipData.length; i++) {
              if (params.name === toolTipData[i].name) {
                toolTiphtml += toolTipData[i].name + ':<br>';
                for (let j = 0; j < toolTipData[i].value.length; j++) {
                  toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + '<br>';
                }
              }
            }
            console.log(toolTiphtml);
            // console.log(convertData(data))
            return toolTiphtml;
          }
        }
      },
      visualMap: {
        show: true,
        min: 0,
        max: 200,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        seriesIndex: [1],
        inRange: {
          // color: ['#3B5077', '#031525'] // 蓝黑
          // color: ['#ffc0cb', '#800080'] // 红紫
          // color: ['#3C3B3F', '#605C3C'] // 黑绿
          // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
          // color: ['#23074d', '#cc5333'] // 紫红
          color: ['#00467F', '#A5CC82'] // 蓝绿
          // color: ['#1488CC', '#2B32B2'] // 浅蓝
          // color: ['#00467F', '#A5CC82'] // 蓝绿
          // color: ['#00467F', '#A5CC82'] // 蓝绿
          // color: ['#00467F', '#A5CC82'] // 蓝绿
          // color: ['#00467F', '#A5CC82'] // 蓝绿

        }
      },
      geo: {
        show: true,
        map: mapName,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false,
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#031525',
            borderColor: '#3B5077',
          },
          emphasis: {
            areaColor: '#2B91B7',
          }
        }
      },
      series: [
        {
          name: '散点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          symbolSize: function (val) {
            return val[2] / 10;
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#05C3F9'
            }
          }
        },
        {
          type: 'map',
          map: mapName,
          geoIndex: 0,
          aspectScale: 0.75, // 长宽比
          showLegendSymbol: false, // 存在legend时显示
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: false,
              textStyle: {
                color: '#fff'
              }
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#031525',
              borderColor: '#3B5077',
            },
            emphasis: {
              areaColor: '#2B91B7'
            }
          },
          animation: false,
          data: data
        },
        {
          name: '点',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'pin', // 气 泡
          symbolSize: function (val) {
            const a = (maxSize4Pin - minSize4Pin) / (max - min);
            // const b = minSize4Pin - a * min;
            const b = maxSize4Pin - a * max;
            return a * val[2] + b;
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 9,
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#F62157', // 标志颜色
            }
          },
          zlevel: 6,
          data: convertData(data),
        },
      ]
    };
  }
  // 获取URL，风格URL
  public getUrl(): void {
    const url = window.location.href;
    console.log(url);
   /* const urlString = url.split('#')[1].split('/')[2];
    if (urlString === 'finance') {
      this.headerTitle = '贵州省高速业态大数据';
    } else if (urlString === 'city') {
      this.headerTitle = '贵阳市高速大数据';
    } else if (urlString === 'whole') {
      this.headerTitle = '全国高速业态大数据';
    }*/
  }
}
