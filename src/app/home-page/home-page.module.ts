import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePagePageRoutingModule } from './home-page-routing.module';

import { HomePagePage } from './home-page.page';

import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePagePageRoutingModule
  ],
  declarations: [HomePagePage]
})
export class HomePagePageModule {



  
}
