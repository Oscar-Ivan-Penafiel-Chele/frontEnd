import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationRoutingModule } from './migration-routing.module';
import { MigrationComponent } from './migration.component';
import {FileUploadModule} from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
  declarations: [
    MigrationComponent
  ],
  imports: [
    CommonModule,
    MigrationRoutingModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule,
    ProgressSpinnerModule
  ]
})
export class MigrationModule { }
