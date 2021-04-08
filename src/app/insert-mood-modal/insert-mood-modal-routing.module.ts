import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertMoodModalPage } from './insert-mood-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InsertMoodModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertMoodModalPageRoutingModule {}
