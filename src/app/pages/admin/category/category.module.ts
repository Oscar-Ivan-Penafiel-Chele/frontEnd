import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './page/category.component';
import { FormsModule } from '@angular/forms';
import { PrimengComponentsModule } from 'src/app/shared/components/primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    PrimengComponentsModule
  ]
})
export class CategoryModule { }
