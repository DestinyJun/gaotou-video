import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  constructor() { }
  // 基础数据部分
  public citys = ['久长服务区', '石阡服务区', '虹桥服务区',
    '玉屏服务区', '荔波服务区', '六枝服务区', '盘县服务区',
    '红果服务区', '老马服务区', '乌江服务区', '思南服务区', '白云服务区', '双龙服务区'
  ];
  // 3D柱状图点击事件随机函数
  public get3dOption(num: number): any {
    const arry = [];
    for (let i = 0; i < num; i++) {
      arry.push(Math.round(Math.random() * 500));
    }
    return arry;
  }

  // 产生和为一百的随机数
  public getrandomPie(num: number): any {
    const arry = [];
    for (let i = 0; i < num; i++) {
      arry.push(Math.round(Math.random() * 100));
    }
    return arry;
  }

  // 产生一盒随机对象
  public getJsonObj(num: number): any {
    const arryObj = [];
    const arry = [];
    for (let i = 0; i < num; i++) {
      arry.push(Math.round(Math.random() * 500));
    }

    // 冒泡排序从大到小
    let i = arry.length - 1;
    while (i > 0) {
      let pos = 0;
      for (let j = 0; j < i; j++) {
        if (arry[j] < arry[j + 1]) {
          pos = j;
          const tmp = arry[j];
          arry[j] = arry[j + 1];
          arry[j + 1] = tmp;
        }
      }
      i = pos;
    }
    arry.map((val, index) => {
      arryObj.push({num: index + 1, value: val, zone: this.citys[Math.round(Math.random() * 12)]});
    });
    return arryObj;
  }
}
