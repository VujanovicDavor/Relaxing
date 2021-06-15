import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePlaylistPage } from './createPlaylist';

const routes: Routes = [
  {
    path: '',
    component: CreatePlaylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistpopoverPageRoutingModule {}
