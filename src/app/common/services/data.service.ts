import {Injectable} from '@angular/core';
@Injectable()
export class DataService {
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
  public rankedRelly = ['酸辣粉', '小黄鸭', '特色小吃',
    '最美高速', '小圆满商城', '德克士', '小圆满餐厅'];
  public country = ['南明区', '云岩区', '花溪区', '观山湖区',
    '白云区', '乌当区', '清镇市', '开阳县', '息烽县', '修文县'
  ];
  public eventTypes = [
    {name: '工程类', id: '001', number: 22, color: '#BB32F4'},
    {name: '经营类', id: '002', number: 15, color: '#F432AD'},
    {name: '卫生类', id: '003', number: 12, color: '#E57D0D'},
    {name: '监控类', id: '004', number: 0, color: '#1ED1D8'},
    {name: '系统故障', id: '005', number: 23, color: '#3BF49F'},
    {name: '其他', id: '006', number: 7, color: '#1ED1D8'}
  ];
  public officeTypes = [
    {time: '2018-08-10 12:00', proDesc: '王小二提交出差申请', feedback: '已处理（处理人：王小花）'},
    {time: '2018-08-10 12:00', proDesc: '大麻子提交交通补贴申请', feedback: '未处理'},
    {time: '2018-08-10 12:00', proDesc: '小马扎通知下午开会', feedback: '已处理（处理人：王小花）'},
    {time: '2018-08-10 12:00', proDesc: '五月份工作计划', feedback: '未处理'},
    {time: '2018-08-10 12:00', proDesc: '下午开年度总结大会', feedback: '已处理（处理人：王小花）'},
    {time: '2018-08-10 12:00', proDesc: '2018年度销售计划提交', feedback: '已处理（处理人：王小花）'},
  ];
  public personOfficeTypes = [
    {dynamic: '17:50分去大堂开会', dispose: '已处理', color: '#BB32F4'},
    {dynamic: '8月20号之前提交公司计划', dispose: '已处理', color: '#F432AD'},
    {dynamic: '新进人员管理', dispose: '已处理', color: '#E57D0D'},
    {dynamic: '提交项目申报', dispose: '未处理', color: '#1ED1D8'},
    {dynamic: '人员登记', dispose: '未处理', color: '#3BF49F'},
    {dynamic: '办公用品申请', dispose: '未处理', color: '#1ED1D8'}
  ];
  public serviceBasicInformation1 = [
    {name: '始建时间', desc: '2018月7月18日'},
    {name: '占地面积', desc: '154554㎡'},
    {name: '运营时间', desc: '2017年10月10号'},
    {name: '保洁人员', desc: '21名'},
    {name: '保安人员', desc: '15名'},
    {name: '大车车位', desc: '524个'},
    {name: '小车车位', desc: '654个'},
    {name: '客车车位', desc: '654个'},
  ];
  public serviceBasicInformation2 = [
    {name: '供电账户', desc: '某某服务区'},
    {name: '上次交电费时间', desc: '2018-08-15'},
    {name: '合同签订时间', desc: '2018-08-18'},
    {name: '用水量', desc: '4500m³'},
    {name: '上次交水费时间', desc: '4500m³'},
    {name: '服务区管理人', desc: '王小丹'},
    {name: '管理人电话', desc: '18888888888'},
  ];

  constructor() {}

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
  public getIncome(num, sum, min, title): any {
    const obj = [];
    let arry1 = [];
    let arry2 = [];
    let arry3 = [];
    for (let i = 0; i < num; i++) {
      arry1.push((Math.round(Math.random() * sum)) + min);
      arry2.push((Math.round(Math.random() * sum)) + min);
      arry3.push((Math.round(Math.random() * sum)) + min);
    }
    if (title === '业态收入') {
      console.log(title);
      arry1 = this.bubbleSortBig(arry1);
      console.log(arry1);
      for (let i = 0; i <= 2; i++) {
        if (i === 0) {
          obj.push(new ObjArray('业态收入（元）', '#FF2600',  arry1, arry1.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        } else if (i === 1) {
          obj.push(new ObjArray('车流量（辆）', '#FFC000',  arry2, arry2.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        } else if (i === 2) {
          obj.push(new ObjArray('客流量（人次）', '#00AD4E',  arry3, arry3.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        }
      }
    } else if (title === '车流量') {
      arry2 = this.bubbleSortBig(arry2);
      for (let i = 0; i <= 2; i++) {
        if (i === 0) {
          obj.push(new ObjArray('车流量（辆）', '#FFC000',  arry2, arry1.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        } else if (i === 1) {
          obj.push(new ObjArray('业态收入（元）', '#FF2600',  arry1, arry2.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        } else if (i === 2) {
          obj.push(new ObjArray('客流量（人次）', '#00AD4E',  arry3, arry3.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        }
      }
    } else if (title === '客流量') {
      arry3 = this.bubbleSortBig(arry3);
      for (let i = 0; i <= 2; i++) {
        if (i === 0) {
          obj.push(new ObjArray('客流量（人次）', '#00AD4E', arry3, arry1.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        } else if (i === 1) {
          obj.push(new ObjArray('业态收入（元）', '#FF2600', arry1, arry2.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        } else if (i === 2) {
          obj.push(new ObjArray('车流量（辆）', '#FFC000 ', arry3, arry3.map((value, index) => {
            return this.citys[(Math.round(Math.random() * 9))];
          })));
        }
      }
    }
    console.log(obj);
    return obj;
  }

  // 返回服务区收入跟具体的店铺名字
  public getServiceData(sum, min): any {
    const arryObj = [];
    this.rankedRelly.map((val, index, arr) => {
      arryObj.push({
        name: arr[Math.round(Math.random() * (arr.length - 1))],
        num: Math.round(Math.random() * sum) + min,
        videoUrl: 'rtsp://admin:admin12345@117.187.60.138:555/Streaming/Channels/101?transportmode-unicast'});
    });
    return arryObj;
  }

  // 事件类数据

}
export class ObjArray {
  constructor(
    public title: string,
    public color: string,
    public data: any,
    public serviceZone: any
  ) {}
}
