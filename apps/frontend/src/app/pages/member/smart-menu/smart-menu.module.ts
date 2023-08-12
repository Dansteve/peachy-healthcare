import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmartMenuPageRoutingModule } from './smart-menu-routing.module';

import { SmartMenuPage } from './smart-menu.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SmartMenuPageRoutingModule],
  declarations: [SmartMenuPage],
})
export class SmartMenuPageModule {}
