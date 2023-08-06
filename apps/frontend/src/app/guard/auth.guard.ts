import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as R from 'ramda';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private whitelistedRoute: any[] = [
  ];


  constructor(
    private api: ApiService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // const expectedRole = next.data?.role;
    return this.checkWhitelistedRoute(state);
  }

  canLoad(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkWhitelistedRoute(state);
  }


  checkWhitelistedRoute(state: RouterStateSnapshot) {
    let checkIfWhitelisted = false;
    R.forEach((x: any) => {
      console.log('checkIfWhitelisted :', R.test(x, state.url));
      if (R.test(x, state.url)) {
        checkIfWhitelisted = true;
        return;
      };
    }, this.whitelistedRoute);
    return checkIfWhitelisted ? checkIfWhitelisted : this.checkAuth(state);
  }

  checkAuth(state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.api.checkToken().then(() => this.api.isAuthenticated().then(currentState => {
      console.log(currentState);
      console.log(state.url);
      if (currentState) {
        return true;
      }
      this.router.navigateByUrl(`login?url=${encodeURIComponent(state.url)}`);
      return false;
    }));
  }
}


