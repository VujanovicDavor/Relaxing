import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageplaylistsPage } from './manageplaylists.page';

const routes: Routes = [
  {
    path: '',
    component: ManageplaylistsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageplaylistsPageRoutingModule {}
