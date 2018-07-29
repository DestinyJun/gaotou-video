import {
  Component, ElementRef,
  OnInit,
} from '@angular/core';
import {Data3dService} from '../../common/services/data3d.service';
import {DiagramService} from '../../common/services/diagram.service';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../../common/services/data.service';
declare let BMap;
declare let BMapLib;
declare let BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW;

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

@Component({
  selector: 'app-service-data',
  templateUrl: './service-data.component.html',
  styleUrls: ['./service-data.component.css']
})
export class ServiceDataComponent implements OnInit {
  /***********************基础信息************************/
  // 服务区名称
  public serviceZoneTitle: string;
  // 服务区坐标
  public serviceZonePoint: string;
  public citys = ['贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔东南苗族侗族自治州', '黔南布依族苗族自治州', '黔西南布依族苗族自治州'];
  public business = ['住宿', '汽修', '商超', '小吃', '西式快餐', '中式快餐'];

  /***********************左边************************/
    //  高速服液态数据3d统计
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
    '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3',
    '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3 ', '#29AAE3'
  ];
  public arryPie = [];

  // 车辆收入数值表现
  public vehicleAmount = [];

  // 服务区车型日分布分析
  public optionsCarModel = {};
  public alertCarShow = false;
  public carTableData: any;
  public carExcelShow = false;
  public arryCarPie = [];
  public alertCarTitle = '小车';
  public carExportType: CarExportType;

  /***********************中部************************/
  public incomeData: any;

  /***********************右边************************/
  // 业态经营数据前十排名
  public crosswiseBar = {};
  public crosswiseBarDate = '当日';
  public barStatus1 = true;
  public barStatus2 = false;
  public barStatus3 = false;
  public dataStatus = '业态收入';
  public crosswiseBarInstance: any;
  // 另外收入排名+表格导出
  public alertCrosswiseShow = false;
  public crosswiseExcelShow = false;
  public CrosswiseExportType: IncomeExportType;

  // 实时收入
  public incomeAmount = [];

 // 当日收入类型占比分析
  public optionsIncomeModel = {};
  // 收入类型弹窗
  public alertIncomeShow = false;
  public alertIncomeTitle = '收入总数';
  public optionsIncomeTypes = {};
  public IncomeAreaName = '贵州省';
  public IncomeTableData: any;
  public arryIncomePie = [];
  public incomeExcelShow = false;
  public incomeExportType: IncomeExportType;

  constructor(
    private el: ElementRef,
    private data3dS: Data3dService,
    private diagrams: DiagramService,
    private routerInfo: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // 导出表格数据初始化
    this.carExportType = {
      carNumType: '',
      carArea: '',
      carDate: ''
    };
    this.CrosswiseExportType = {
      incomeNumType: '',
      incomeArea: '',
      incomeDate: ''
    };
    this.incomeExportType = {
      incomeNumType: '',
      incomeArea: '',
      incomeDate: ''
    };
    // 路由接受参数
    this.routerInfo.params.subscribe(
      (params) => {
        this.serviceZoneTitle = params.name;
        this.serviceZonePoint = params.point.split(',');
        // console.log(this.serviceZonePoint);
      }
    );
    this.upData();
  }
  /************************左边***************************/
  // 3D柱状图图表配置
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
  //  D柱状图的相关点击事件
  public barClick(e): void {
    const that = this;
    this.alertBarShow = true;
    document.body.className = 'ui-overflow-hidden';
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
    this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
      this.arryPie.push({value: val, name: this.business[index]});
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
    document.body.className = '';
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
      '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3',
      '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3', '#29AAE3 ', '#29AAE3'
    ];
    this.colorList[e.dataIndex] = 'red';
    this.options3dBarInstance.setOption(this.options3dBar);
    this.arryPie = [];
    this.dataService.getrandomPie(9, 900, 50).map((val, index) => {
      this.arryPie.push({value: val, name: this.business[index]});
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

  // 车辆类型占比图表配置
  public CarTypes() {
    this.diagrams.getCarTypes().subscribe(
      (value) => {
        this.optionsCarModel = {
          title: [
            {
              text: this.serviceZoneTitle + value.title,
              left: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
          ],
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
              color: ['#FBB034', '#E30B40', '#3291DD', '#8B489E'],
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
    this.carTableData = this.dataService.getJsonObj(8, 1000, 100, this.alertCarTitle);
  }
  public closeCarShow(): void {
    document.body.className = '';
    this.alertCarShow = false;
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
          text: `贵州省各市所有服务区今日${this.alertCarTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertCarTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertCarTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertCarTitle}占比统计`,
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


  /************************中部***************************/
  // 百度地图
  /*  public ionViewWillEnter() {
    let that;
    that = this;
    const map = new BMap.Map('servicesMap');
    const point = new BMap.Point(this.serviceZonePoint[0], this.serviceZonePoint[1]);
    map.centerAndZoom(point, 19);
    map.setMapStyle({
      styleJson: [
        // 地图背景颜色
        {
          'featureType': 'background',
          'elementType': 'all',
          'stylers': {
            'color': '#002240'
          }
        },
      ]
    });

    function addPolyline() {
      // 设置自定义market图标
      const myIcon = new BMap.Icon('/assets/images/car.png', new BMap.Size(150, 150));
      const point1 = new BMap.Point(106.706063, 26.901682);
      const marker2 = new BMap.Marker(point1, {icon: myIcon});  // 创建标注
      map.addOverlay(marker2);
    }
    setInterval(() => {
      addPolyline();
      const timerOut = setTimeout(() => {
        map.clearOverlays();
        clearTimeout(timerOut);
      }, 1000);
    }, 3000);


    /!*const polyline = new BMap.Polyline(points, {
      enableEditing: false, // 是否启用线编辑，默认为false
      enableClicking: true, // 是否响应点击事件，默认为true
      icons: [icons],
      strokeWeight: '8', // 折线的宽度，以像素为单位
      strokeOpacity: 0.8, // 折线的透明度，取值范围0 - 1
      strokeColor: '#18a45b' // 折线颜色
    });
    map.addOverlay(polyline); // 增加折线*!/

    // 添加弧线覆盖物
   /!* const curve = new BMapLib.CurveLine(points, {strokeColor: 'blue', strokeWeight: 3, strokeOpacity: 0.5});
    map.addOverlay(curve);*!/

    // 地址解析器
    const geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
      const geoc = new BMap.Geocoder();
      geoc.getLocation(r.point, function (rs) {
        that.locationTxt = rs.address;
        that.locationState = true;
      });
    }, {enableHighAccuracy: true});
  }*/
  // 中部服务区数据展示
  public backCenterDate() {
  this.incomeData = this.dataService.getServiceData(1000, 200);
}

  /************************右边***************************/
  // 业态经营数据前十排名
  public backCrosswiseBar() {
    /*const value = this.dataService.getIncomerStore(this.dataStatus);
    this.crosswiseBar = {
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '19%',
        // top: '20%',
        bottom: '20%'
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
            formatter: '{c}',
            textBorderColor: '#333',
            textBorderWidth: 2,
          },
        },

      ]
    };*/
    const IncomeValue = this.dataService.getIncome(9, 1000, 200);
    this.crosswiseBar = {
      title: [
        {
          text: `${this.serviceZoneTitle}${this.crosswiseBarDate}业态数据前十排名`,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
      ],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['业态收入（元）', '车流量（辆）', '客流量（人次）'],
        left: 'center',
        top: '6%',
        textStyle: {
          color: 'white'
        }
      },
      grid: {
        top: '18%',
        left: '1%',
        right: '4%',
        bottom: '11%',
        containLabel: true
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
        data: IncomeValue.serviceZone,
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
          name: '业态收入（元）',
          type: 'bar',
          stack: '总量',
          color: '#FF2600',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: IncomeValue.Income,
        },
        {
          name: '车流量（辆）',
          type: 'bar',
          stack: '总量',
          color: '#FFC000',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: IncomeValue.car,
        },
        {
          name: '客流量（人次）',
          type: 'bar',
          stack: '总量',
          color: '#00AD4E',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: IncomeValue.person,
        }
      ]
    };
  }
  // 业态经营数据前十排名相关操作
 /* public crosswiseBarInit(ec) {
    this.crosswiseBarInstance = ec;
  }
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
  }*/

  // 收入类型排名相关操作
  public crosswiseClick(): void {
    this.alertCrosswiseShow = true;
    document.body.className = 'ui-overflow-hidden';
    this.backCrosswiseBar();
  }
  public closeCrosswiseShow(): void {
    document.body.className = '';
    this.alertCrosswiseShow = false;
  }
  public crosswiseBtnClick(e): void {
    if (e.srcElement.innerText === '当日') {
      this.crosswiseBarDate = '当日';
      this.backCrosswiseBar();
    }
    else if (e.srcElement.innerText === '月度') {
      this.crosswiseBarDate = '月度';
      this.backCrosswiseBar();
    }
    else if (e.srcElement.innerText === '年度') {
      this.crosswiseBarDate = '年度';
      this.backCrosswiseBar();
    }
  }
  // 表格导出
  public crosswiseDateChange(e) {
    this.CrosswiseExportType.incomeDate = e.srcElement.value;
  }
  public crosswiseTypeChange(e) {
    this.CrosswiseExportType.incomeNumType = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public crosswiseAreaChange(e) {
    this.CrosswiseExportType.incomeArea = e.srcElement.options[e.srcElement.selectedIndex].innerText;
  }
  public crosswiseExportClick() {
    if (!(this.CrosswiseExportType.incomeDate === '') || !(this.CrosswiseExportType.incomeNumType === '') || !(this.CrosswiseExportType.incomeArea === '')) {
      this.crosswiseExcelShow = false;
      console.log(this.CrosswiseExportType);
      // 导出表格数据初始化
      this.CrosswiseExportType = {
        incomeNumType: '',
        incomeArea: '',
        incomeDate: ''
      };
    } else {
      window.alert('请把数据选择全在提交');
    }
  }
  public openCrosswiseExcel() {
    this.crosswiseExcelShow = true;
  }
  public closecrosswiseExcel() {
    this.crosswiseExcelShow = false;
  }

  // 收入类型占比图表配置
  public IncomeTypes() {
    this.diagrams.getIncomeTypes().subscribe(
      (value) => {
        this.optionsIncomeModel = {
          title: [
            {
              text: this.serviceZoneTitle + value.title,
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
  public closeIncomeShow(): void {
    document.body.className = '';
    this.alertIncomeShow = false;
  }
  // 收入类型弹窗
  public optionsIncomePieInit(ec): void {
    this.optionsCarPieInstance = ec;
  }
  public optionsIncomePieClick(e) {
    this.IncomeAreaName = e.name;
    this.IncomeTableData = this.dataService.getIncomeObj(8, 1000, 100, this.alertIncomeTitle);
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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
          text: `贵州省各市所有服务区今日${this.alertIncomeTitle}占比统计`,
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


  /*********************************其他*****************************/
  // 返回上级路由
  public goBack(): void {
    history.back();
  }
  // 数据更新加载
  public upData() {
    /************************左边***************************/
    //  高速服液态数据3d统计
    this.packOption3();
    // 贵阳收入实时监控
    this.amount();
    // 高速服务区车辆日分布类型占比分析
    this.CarTypes();

    /************************中部***************************/
    // 贵阳业态经营数据前十排名
    // this.backCrosswiseBar();
    this.backCenterDate();

    /************************右边***************************/
    // 当日收入类型占比分析
    this.IncomeTypes();
  }
}
