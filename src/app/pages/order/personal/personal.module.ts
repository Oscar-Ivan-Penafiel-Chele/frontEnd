import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './page/personal.component';
import { PersonalRoutingModule } from './personal-routing.module';
import { FormsModule } from '@angular/forms';

import {IMaskModule} from 'angular-imask';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    PersonalComponent
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    FormsModule,
    IMaskModule,
    PrimengComponentsModule
  ]
})
export class PersonalModule { }
