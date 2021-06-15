import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageplaylistsPage } from './manageplaylists.page';

const routes: Routes = [
  {
    path: '',
    component: ManageplaylistsPage
  },
  {
    path: 'playlistpopover',
    loadChildren: () => import('./createPlaylist/playlistpopover.module').then( m => m.PlaylistpopoverPageModule)
  },
  {
    path: 'add-exercises',
    loadChildren: () => import('./add-exercises/add-exercises.module').then( m => m.AddExercisesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageplaylistsPageRoutingModule {}
