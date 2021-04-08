import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertMoodModalPageRoutingModule } from './insert-mood-modal-routing.module';

import { InsertMoodModalPage } from './insert-mood-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertMoodModalPageRoutingModule
  ],
  declarations: [InsertMoodModalPage]
})
export class InsertMoodModalPageModule {}
