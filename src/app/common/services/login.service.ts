import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) { }

  // 登陆
  public getLogin(params): Observable<any> {
    return this.http.get('/api/loginWeb', {params});
  }
  // 注册
  public getRegister(params): Observable<any> {
    return this.http.get('/api/user/addUser', {params});
  }
  // 获取个人信息
  public getPerson(params): Observable<any> {
    return this.http.get('/api/user/selectPersonal', {params});
  }
  // 修改信息
  public modifiedData(params): Observable<any> {
    return this.http.get('/api/user/updatePersonal', {params});
  }
  // 获取注册审核列表（普通人员）
  public getAuditDataInvite(params): Observable<any> {
    return this.http.get('/api/user/auditListByInvite', {params});
  }

  // 获取注册审核列表（管理员）
  public getAuditDataMaster(params): Observable<any> {
    return this.http.get('/api/user/auditListByMaster', {params});
  }

  // 注册审核确认(普通人员)
  public goAuditInvite(params): Observable<any> {
    return this.http.get('/api/user/doAuditByInvite', {params});
  }

  // 注册审核确认(管理员)
  public goAuditMaster(params): Observable<any> {
    return this.http.get('/api/user/doAuditMaster', {params});
  }

  // 升级接口
  public GradeUp(params): Observable<any> {
    return this.http.get('/api/user/clickUpGrade', {params});
  }

  // 获取升级审核列表
  public getUpAudit(params): Observable<any> {
    return this.http.get('/api/user/upGradeList', {params});
  }

  // 升级审核接口
  public goUpAudit(params): Observable<any> {
    return this.http.get('/api/user/doUpGradeList', {params});
  }

  // 直接人数
  public numberDirect(params): Observable<any> {
    return this.http.get('/api/user/selectSubordinate', {params});
  }

  // 上级好友
  public superiorPerson(params): Observable<any> {
    return this.http.get('/api/user/selectFriend', {params});
  }

  // 获取所有人员列表
  public getPersonList(params): Observable<any> {
    return this.http.get('/api/user/selectAll', {params});
  }

  // 删除会员
  public delPerson(params): Observable<any> {
    return this.http.get('/api/user/deleteUserById', {params});
  }

  // 密码修改
  public passwordUp(params): Observable<any> {
    return this.http.get('/api/user/editPwd', {params});
  }
}
export class LoginInfo {
  constructor (
    public id: number,
    public loginName: string,
    public name: string,
    public phone: string,
    public weixin: string
  ) {}
}
// 分页参数数据类型
export  class LoginNamePersonJson {
  constructor (
    public loginName: string,
    public page: number,
    public rows: number
  ) {}
}
