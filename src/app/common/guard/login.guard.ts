import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor (private localSessionStorage: LocalStorageService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.localSessionStorage.get('loginName')) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }

  }
}
