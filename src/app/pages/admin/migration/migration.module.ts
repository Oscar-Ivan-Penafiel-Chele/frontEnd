import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationRoutingModule } from './migration-routing.module';
import { MigrationComponent } from './page/migration.component';
import { HttpClientModule } from '@angular/common/http';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    MigrationComponent
  ],
  imports: [
    CommonModule,
    MigrationRoutingModule,
    HttpClientModule,
    PrimengComponentsModule
  ]
})
export class MigrationModule { }
