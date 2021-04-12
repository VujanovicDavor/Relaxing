import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {InsertMoodModalPage} from '../insert-mood-modal/insert-mood-modal.page';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  constructor(public modalController: ModalController) {

  }

  

  async presentModal() {
    const modal = await this.modalController.create({
      component: InsertMoodModalPage,
    });
    return await modal.present();
    }

    async ngOnInit(){
      
    }

}