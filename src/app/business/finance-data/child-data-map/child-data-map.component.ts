import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-child-data-map',
  templateUrl: './child-data-map.component.html',
  styleUrls: ['./child-data-map.component.css']
})
export class ChildDataMapComponent implements OnInit, OnChanges {

  // 月度总收入统计
  public optionsMonth = {
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
  // 车型日分布分析
  public optionsCarModel = {
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
  // 创建组件传入属性
  public title: string;
  constructor() { }

  ngOnInit() {
    console.log('xxx' + this.title);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('xxx' + this.title);
  }
}
