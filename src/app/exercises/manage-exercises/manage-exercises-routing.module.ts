import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageExercisesPage } from './manage-exercises.page';

const routes: Routes = [
  {
    path: '',
    component: ManageExercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageExercisesPageRoutingModule {}
