import { Injectable } from '@angular/core';

@Injectable()
export class ToolsService {

  constructor() { }
  public  randomRgbColor(num) { // 随机生成RGB颜色
    const colors = [];
    for (let i = 0; i <= num; i++) {
      let r = Math.floor(Math.random() * 256); // 随机生成256以内r值
      let g = Math.floor(Math.random() * 256); // 随机生成256以内g值
      let b = Math.floor(Math.random() * 256); // 随机生成256以内b值
      colors.push(`rgb(${r},${g},${b})`);
    }
    return colors; // 返回rgb(r,g,b)格式颜色
  }
}
