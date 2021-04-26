import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoodExplanationPopoverPageRoutingModule } from './mood-explanation-popover-routing.module';

import { MoodExplanationPopoverPage } from './mood-explanation-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoodExplanationPopoverPageRoutingModule
  ],
  declarations: [MoodExplanationPopoverPage]
})
export class MoodExplanationPopoverPageModule {}
