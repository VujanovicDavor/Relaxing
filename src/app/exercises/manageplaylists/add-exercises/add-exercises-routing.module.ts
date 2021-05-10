import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddExercisesPage } from './add-exercises.page';

const routes: Routes = [
  {
    path: '',
    component: AddExercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExercisesPageRoutingModule {}
