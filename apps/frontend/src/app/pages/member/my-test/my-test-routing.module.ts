import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTestPage } from './my-test.page';

const routes: Routes = [
  {
    path: '',
    component: MyTestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTestPageRoutingModule {}
