import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddExercisesPageRoutingModule } from './add-exercises-routing.module';

import { AddExercisesPage } from './add-exercises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddExercisesPageRoutingModule
  ],
  declarations: [AddExercisesPage]
})
export class AddExercisesPageModule {}
