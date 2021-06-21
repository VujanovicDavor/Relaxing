import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayModalPage } from './play-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PlayModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayModalPageRoutingModule {}
