import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertMoodModalPage } from './insert-mood-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InsertMoodModalPage
  },
  {
    path: 'mood-explanation-popover',
    loadChildren: () => import('./mood-explanation-popover/mood-explanation-popover.module').then( m => m.MoodExplanationPopoverPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertMoodModalPageRoutingModule {}
