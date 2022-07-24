import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {SkeletonModule} from 'primeng/skeleton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CarouselModule} from 'primeng/carousel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {PasswordModule} from 'primeng/password';
import {CheckboxModule} from 'primeng/checkbox';
import {KeyFilterModule} from 'primeng/keyfilter';
import {DropdownModule} from 'primeng/dropdown';
import {DividerModule} from 'primeng/divider';
import {ToastModule} from 'primeng/toast';
import {GalleriaModule} from 'primeng/galleria';
import {FieldsetModule} from 'primeng/fieldset';
import {DataViewModule} from 'primeng/dataview';
import {RatingModule} from 'primeng/rating';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {InputNumberModule} from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {StepsModule} from 'primeng/steps';
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports : [
    InputTextModule,
    ButtonModule,
    RippleModule,
    SkeletonModule,
    InputTextareaModule,
    CarouselModule,
    MessagesModule,
    MessageModule,
    PasswordModule,
    CheckboxModule,
    KeyFilterModule,
    DropdownModule,
    DividerModule,
    ToastModule,
    GalleriaModule,
    FieldsetModule,
    DataViewModule,
    RatingModule,
    ProgressSpinnerModule,
    DialogModule,
    TooltipModule,
    InputNumberModule,
    TagModule,
    TableModule,
    ConfirmDialogModule,
    StepsModule,
    CardModule
  ]
})
export class PrimengComponentsModule { }
