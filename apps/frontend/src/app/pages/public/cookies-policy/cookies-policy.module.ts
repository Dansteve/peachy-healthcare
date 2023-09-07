import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CookiesPolicyPageRoutingModule } from './cookies-policy-routing.module';

import { CookiesPolicyPage } from './cookies-policy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CookiesPolicyPageRoutingModule,
  ],
  declarations: [CookiesPolicyPage],
})
export class CookiesPolicyPageModule {}
