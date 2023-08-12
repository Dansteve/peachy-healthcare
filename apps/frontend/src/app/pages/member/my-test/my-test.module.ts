import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTestPageRoutingModule } from './my-test-routing.module';

import { MyTestPage } from './my-test.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MyTestPageRoutingModule],
  declarations: [MyTestPage],
})
export class MyTestPageModule {}
