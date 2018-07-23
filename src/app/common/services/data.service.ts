import {Injectable} from '@angular/core';

@Injectable()
export class DataService {
  constructor() {
  }

  // 基础数据部分
  public citys = ['久长服务区', '石阡服务区', '虹桥服务区',
    '玉屏服务区', '荔波服务区', '六枝服务区', '盘县服务区',
    '红果服务区', '老马服务区', '乌江服务区', '思南服务区', '白云服务区', '双龙服务区'
  ];
  public ranked = ['王大妈卤蛋', '小姨妈烧烤', '王老头快餐', '德克士', '坑德基', '小花超市', '王嬢快餐店', '小美汽修', '阿花住宿', '妹妹果汁店'];

  public getIncomerStore(status): any {
    if (status === '业态收入') {
      let arryObj = this.get3dOption(10);
      arryObj = this.bubbleSortBig(arryObj);

      const arryStore = [];
      this.ranked.map((value, index) => {
        arryStore.push(this.ranked[Math.round(Math.random() * 9)]);
      });

      return {ranked: arryStore, data: arryObj,  color: '#D9534F', name: '业态收入'};

    } else if (status === '车流量') {
      let arryObj = this.get3dOption(10);
      arryObj = this.bubbleSortBig(arryObj);

      const arryStore = [];
      this.ranked.map((value, index) => {
        arryStore.push(this.ranked[Math.round(Math.random() * 9)]);
      });
      return {ranked: arryStore, data: arryObj,  color: '#449D44', name: '车流量'};
    } else if (status === '客流量') {
      let arryObj = this.get3dOption(10);
      arryObj = this.bubbleSortBig(arryObj);

      const arryStore = [];
      this.ranked.map((value, index) => {
        arryStore.push(this.ranked[Math.round(Math.random() * 9)]);
      });
      return {ranked: arryStore, data: arryObj,  color: '#31B0D5', name: '客流量'};
    }
  }

  // 3D柱状图点击事件随机函数
  public get3dOption(num: number): any {
    const arry = [];
    for (let i = 0; i < num; i++) {
      arry.push((Math.round(Math.random() * 500)) + 50);
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
    let arry = [];
    for (let i = 0; i < num; i++) {
      arry.push(Math.round(Math.random() * 500));
    }
    arry = this.bubbleSortSmall(arry);
    arry.map((val, index) => {
      arryObj.push({num: index + 1, value: val, zone: this.citys[Math.round(Math.random() * 12)]});
    });
    return arryObj;
  }

  // 冒泡排序从大到小
  public bubbleSortSmall(arry): any {
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
    return arry;
  }

  // 冒泡排序从小到大
  public bubbleSortBig(arry): any {
    let i = arry.length - 1;
    while (i > 0) {
      let pos = 0;
      for (let j = 0; j < i; j++) {
        if (arry[j] > arry[j + 1]) {
          pos = j;
          const tmp = arry[j];
          arry[j] = arry[j + 1];
          arry[j + 1] = tmp;
        }
      }
      i = pos;
    }
    return arry;
  }

}
