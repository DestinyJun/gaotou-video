import {Injectable} from '@angular/core';

@Injectable()
export class DataService {
  constructor() {
  }

  // 基础数据部分
  public citys = ['久长服务区', '石阡服务区', '虹桥服务区',
    '玉屏服务区', '荔波服务区', '六枝服务区', '盘县服务区',
    '红果服务区', '老马服务区', '乌江服务区', '思南服务区',
    '白云服务区', '双龙服务区'
  ];
  public ranked = ['王大妈卤蛋', '小姨妈烧烤', '王老头快餐',
    '德克士', '坑德基', '小花超市', '王嬢快餐店', '小美汽修',
    '阿花住宿', '妹妹果汁店'
  ];
  public country = ['南明区', '云岩区', '花溪区', '观山湖区',
    '白云区', '乌当区', '清镇市', '开阳县', '息烽县', '修文县'
  ];

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

  // 3D柱状图点击事件随机函数,返回的最小值是50
  public get3dOption(num: number): any {
    const arry = [];
    for (let i = 0; i < num; i++) {
      arry.push((Math.round(Math.random() * 500)) + 50);
    }
    return arry;
  }

  // 产生和为一百的随机数
  public getrandomPie(num: number, sum: number, min: number): any {
    const arry = [];
    for (let i = 0; i < num; i++) {
      arry.push(Math.round(Math.random() * sum) + min);
    }
    return arry;
  }

  // 车辆类型数据
  public getJsonObj(num: number, sum: number, min: number, types: string): any {
    /*let a = [
      {num: 1, sum: 50, cart: 10, trucks: 30, bus: 10}
    ];*/
    const arryObj = [];
    // 总数
    let arry1 = [];
    // 小车
    let arry2 = [];
    // 客车
    let arry3 = [];
    // 货车
    let arry4 = [];

    for (let i = 0; i < num; i++) {
      arry1.push(Math.round(Math.random() * sum) + min);
      arry2.push(Math.round(Math.random() * sum) + min);
      arry3.push(Math.round(Math.random() * sum) + min);
      arry4.push(Math.round(Math.random() * sum) + min);
    }
    if (types === '总数') {
      arry1 = this.bubbleSortSmall(arry1);
      arry1.map((val, index) => {
        arryObj.push({num: index + 1, sum: val, cart: arry2[index], trucks: arry3[index], bus: arry4[index], zone: this.citys[Math.round(Math.random() * 12)]});
      });
    } else if (types === '小车') {
      arry2 = this.bubbleSortSmall(arry2);
      arry2.map((val, index) => {
        arryObj.push({num: index + 1, sum: arry1[index], cart: val, trucks: arry3[index], bus: arry4[index], zone: this.citys[Math.round(Math.random() * 12)]});
      });
    } else if (types === '客车') {
      arry3 = this.bubbleSortSmall(arry3);
      arry3.map((val, index) => {
        arryObj.push({num: index + 1, sum: arry1[index], cart: arry2[index], trucks: val, bus: arry4[index], zone: this.citys[Math.round(Math.random() * 12)]});
      });
    } else if (types === '货车') {
      arry4 = this.bubbleSortSmall(arry4);
      arry4.map((val, index) => {
        arryObj.push({num: index + 1, sum: arry1[index], cart: arry2[index], trucks: arry3[index], bus: val, zone: this.citys[Math.round(Math.random() * 12)]});
    });
    }

    return arryObj;
  }

  // 收入类型数据
  public getIncomeObj(num: number, sum: number, min: number, types: string): any {
    /*let a = [
      {num: 1, sum: 50, income: 10}
    ];*/
    const arryObj = [];
    // 总数
    let arry1 = [];
    // 小车
    let arry2 = [];

    for (let i = 0; i < num; i++) {
      arry1.push(Math.round(Math.random() * sum) + min);
      arry2.push(Math.round(Math.random() * sum) + min);
    }
    if (types === '收入总数') {
      arry1 = this.bubbleSortSmall(arry1);
      arry1.map((val, index) => {
        arryObj.push({num: index + 1, sum: val, income: arry2[index], zone: this.citys[Math.round(Math.random() * 12)]});
      });
    } else {
      arry2 = this.bubbleSortSmall(arry2);
      arry2.map((val, index) => {
        arryObj.push({num: index + 1, sum: arry1[index], income: val, zone: this.citys[Math.round(Math.random() * 12)]});
      });
    }

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

  // 返回服务区业态数据排名
  public getIncome(num, sum, min): any {
    const obj = {
      serviceZone: [],
      Income: [],
      car: [],
      person: []
    };
    let arry1 = [];
    const arry2 = [];
    const arry3 = [];
    for (let i = 0; i < num; i++) {
      arry1.push((Math.round(Math.random() * sum)) + min);
      arry2.push((Math.round(Math.random() * sum)) + min);
      arry3.push((Math.round(Math.random() * sum)) + min);
    }
    arry1 = this.bubbleSortBig(arry1);
    obj.serviceZone = arry1.map((value, index) => {
      return this.citys[(Math.round(Math.random() * 9))];
    });
    obj.Income = arry1;
    obj.car = arry2;
    obj.person = arry3;
    return obj;
  }

}
