import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CookiesPolicyPage } from './cookies-policy.page';

const routes: Routes = [
  {
    path: '',
    component: CookiesPolicyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CookiesPolicyPageRoutingModule {}
