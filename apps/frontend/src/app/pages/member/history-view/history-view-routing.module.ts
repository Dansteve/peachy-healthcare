import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryViewPage } from './history-view.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryViewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryViewPageRoutingModule {}
