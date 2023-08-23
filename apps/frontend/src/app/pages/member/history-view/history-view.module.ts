import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryViewPageRoutingModule } from './history-view-routing.module';

import { SharedComponentsModule } from '../../../components/shared-components.module';

import { HistoryViewPage } from './history-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    HistoryViewPageRoutingModule,
  ],
  declarations: [HistoryViewPage],
})
export class HistoryViewPageModule {}
