import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistpopoverPageRoutingModule } from './playlistpopover-routing.module';

import { PlaylistpopoverPage } from './playlistpopover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistpopoverPageRoutingModule
  ],
  declarations: [PlaylistpopoverPage]
})
export class PlaylistpopoverPageModule {}
