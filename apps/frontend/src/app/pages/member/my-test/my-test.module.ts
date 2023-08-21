import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTestPageRoutingModule } from './my-test-routing.module';

import { SharedComponentsModule } from '../../../components/shared-components.module';
import { MyTestPage } from './my-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    MyTestPageRoutingModule
  ],
  declarations: [MyTestPage],
})
export class MyTestPageModule {}
