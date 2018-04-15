import { Component, OnInit } from '@angular/core';
import {LoginService} from '../shared/login.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {mobileValidators} from '../validator/Validators';
import {Router} from '@angular/router';
import {LocalStorageService} from '../shared/local-storage.service';
import 'rxjs/Rx'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // 表单
  public myFromModule: FormGroup;
  // 本地字段
  public loginSuccess: boolean;
  public loginMsg: string;
  private params = new HttpParams();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService,
    private localSessionStorage: LocalStorageService,
  ) {
    this.loginSuccess = true;
    this.myFromModule = fb.group({
      username: ['', [Validators.required, mobileValidators]],
      password: ['' , [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}
  public onSubmit() {
    if (this.myFromModule.valid) {
      this.loginService.getLogin(this.myFromModule.value).subscribe((data) => {
        if (data.success) {
          // 本地存储信息
          for ( const i in data.obj) {
            this.localSessionStorage.set(i, data.obj[i]);
          }
          this.router.navigate(['/home']);
        } else {
          this.loginSuccess = data.success;
          this.loginMsg = data.msg;
        }
      });
    } else {
      alert('用户名或者密码不能为空');
    }
 }
}
