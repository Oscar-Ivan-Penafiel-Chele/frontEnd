import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import {GalleriaModule} from 'primeng/galleria';
import {SkeletonModule} from 'primeng/skeleton';
import {FieldsetModule} from 'primeng/fieldset';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {RatingModule} from 'primeng/rating';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextModule} from 'primeng/inputtext';


@NgModule({
  declarations: [
    ShopComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    GalleriaModule,
    SkeletonModule,
    FieldsetModule,
    DataViewModule,
    DropdownModule,
    RatingModule,
    ButtonModule,
    FormsModule,
    RouterModule,
    ProgressSpinnerModule,
    InputTextModule
  ]
})
export class ShopModule { }
