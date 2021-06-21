import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayModalPageRoutingModule } from './play-modal-routing.module';

import { PlayModalPage } from './play-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayModalPageRoutingModule
  ],
  declarations: [PlayModalPage]
})
export class PlayModalPageModule {}
