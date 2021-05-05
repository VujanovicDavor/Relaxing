import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageplaylistsPageRoutingModule } from './manageplaylists-routing.module';

import { ManageplaylistsPage } from './manageplaylists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageplaylistsPageRoutingModule
  ],
  declarations: [ManageplaylistsPage]
})
export class ManageplaylistsPageModule {}
