import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {InsertMoodModalPage} from '../insert-mood-modal/insert-mood-modal.page';
import { Storage } from '@ionic/storage-angular'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  isHidden: boolean;
  moodObjects: Mood[];


  constructor(public modalController: ModalController, public storage: Storage) {
    this.isHidden = true; //set true if the insert button should be hidden
  } 

  async presentModal() {
    const modal = await this.modalController.create({
      component: InsertMoodModalPage,
    });

    modal.onDidDismiss().then(data=>{

     if(data.data == null){
       console.log('No data received (pressed "cancel")');
     } else{
       let newMoodObject: Mood = <Mood> data.data; // receive data => store to mood array
       newMoodObject.dateTime = new Date();
       this.addMoodObject(newMoodObject);
     } 
    });

    return await modal.present();
  }

  async addMoodObject(toInsert: Mood){
    this.storage.get(MOOD_KEY).then((moodArr: Mood[]) => {
      
      if(moodArr == null){
        moodArr = new Array();
      }

      moodArr.push(toInsert);
      console.log(moodArr);
      this.storage.set(MOOD_KEY ,moodArr);
    }).catch(() =>{
      console.log('cant store mood Obj in addMoodObject()');
    });
    this.isHidden = true;
  }


  async checkLastMoodInsert(){ //checks the last insert of a Mood object into the storage

    this.moodObjects = await this.storage.get(MOOD_KEY);

    if(this.moodObjects == null){
      this.isHidden = false;
    }
    else if(this.moodObjects.length == 0){
      this.isHidden = false;
    } else {
      const result = new Date().getTime() - this.moodObjects[this.moodObjects.length - 1].dateTime.getTime(); // dif between last input and now
      console.log(result);
      console.log(this.moodObjects[this.moodObjects.length - 1].dateTime);

      if(result >= 43200000){
        this.isHidden = false;
      } else{
        this.isHidden = true;
      }
    }
  }

  async ngOnInit(){ 
    await this.storage.create();
    this.checkLastMoodInsert();
  }
}

interface Mood {
  relaxLevel: number,
  productivityLevel: number,
  dateTime: Date
}

const MOOD_KEY = 'MoodObject';