import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaylistpopoverPage } from './playlistpopover.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistpopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistpopoverPageRoutingModule {}
