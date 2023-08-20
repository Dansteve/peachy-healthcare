import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MomentModule } from 'ngx-moment';
import { NgPipesModule } from 'ngx-pipes';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { GenericHeaderComponent } from './generic-header/generic-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    MomentModule,
    SharedPipeModule,
  ],
  declarations: [
    GenericHeaderComponent,
  ],
  exports: [
    GenericHeaderComponent,
  ]
})
export class SharedComponentsModule { }
