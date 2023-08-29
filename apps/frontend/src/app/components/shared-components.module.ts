import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MomentModule } from 'ngx-moment';
import { NgPipesModule } from 'ngx-pipes';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { GenericHeaderComponent } from './generic-header/generic-header.component';
import { TakeTestComponent } from './take-test/take-test.component';
import { TestCongratulationsComponent } from './test-congratulations/test-congratulations.component';

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
    TakeTestComponent,
    TestCongratulationsComponent
  ],
  exports: [
    GenericHeaderComponent,
    TakeTestComponent,
    TestCongratulationsComponent
  ]
})
export class SharedComponentsModule { }
