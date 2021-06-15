import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistpopoverPageRoutingModule } from './playlistpopover-routing.module';

import { CreatePlaylistPage } from './createPlaylist';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistpopoverPageRoutingModule
  ],
  declarations: [CreatePlaylistPage]
})
export class PlaylistpopoverPageModule {}
