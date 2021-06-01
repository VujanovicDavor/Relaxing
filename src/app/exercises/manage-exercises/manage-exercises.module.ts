import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageExercisesPageRoutingModule } from './manage-exercises-routing.module';

import { ManageExercisesPage } from './manage-exercises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageExercisesPageRoutingModule
  ],
  declarations: [ManageExercisesPage]
})
export class ManageExercisesPageModule {}
