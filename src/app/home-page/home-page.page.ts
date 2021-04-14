import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {InsertMoodModalPage} from '../insert-mood-modal/insert-mood-modal.page';
import { Storage } from '@ionic/storage-angular'
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  constructor(public modalController: ModalController, public storage: Storage) {

  } 

  async presentModal() {
    const modal = await this.modalController.create({
      component: InsertMoodModalPage,
    });

    modal.onDidDismiss().then(data=>{

     if(data.data == null){
       console.log('No data received (pressed "cancel")');
     } else{
       let newMoodObj: Mood = <Mood>data.data;
       console.log(newMoodObj);
     } 
    });

    return await modal.present();
  }

  storeMoodObject(){

  }

    async ngOnInit(){ 
      await this.storage.create();
    }

}

interface Mood {
  relaxLevel: number,
  productivityLevel: number
}