import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },  {
    path: 'manageplaylists',
    loadChildren: () => import('./manageplaylists/manageplaylists.module').then( m => m.ManageplaylistsPageModule)
  },
  {
    path: 'manage-exercises',
    loadChildren: () => import('./manage-exercises/manage-exercises.module').then( m => m.ManageExercisesPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
