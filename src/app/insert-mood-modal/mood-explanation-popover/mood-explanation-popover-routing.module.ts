import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoodExplanationPopoverPage } from './mood-explanation-popover.page';

const routes: Routes = [
  {
    path: '',
    component: MoodExplanationPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoodExplanationPopoverPageRoutingModule {}
