import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {InsertMoodModalPage} from '../insert-mood-modal/insert-mood-modal.page';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from '../../models/exercise.card';
import { Mood } from '../../models/mood';
import * as JSONdata from "../default_data/data.json";
import { LastPlayedActivity } from 'src/Models/last_played_activity';

@Component({
  selector: 'app-home-page',  
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage {

  isHidden: boolean;


  constructor(public modalController: ModalController, public storage: Storage) {
    this.isHidden = false; //set true if the insert button should be hidden
  } 

  async presentModal() {
    const modal = await this.modalController.create({
      component: InsertMoodModalPage,
    });

    modal.onDidDismiss().then(data=>{

     if(data.data == null){
       console.log('No data received (pressed "cancel")');
       this.isHidden = false;
     } else{
       const newMoodObject: Mood = <Mood> data.data; // receive data => store to mood array
       console.log(newMoodObject);
       //this.addMoodObject(newMoodObject);
     } 
    });

    return await modal.present();
  }

  calculateScore(moodObject: Mood){
    const score = moodObject.getMoodScore();
    
    if(score > 0){
      this.loadCards(score);
    } else {
      console.log('score <= 0 -> no cards can be loaded');
    }
  }

  async loadCards(score: number){
    this.storage.get(CARDS_KEY).then((cards: ExerciseCard[]) => {
      cards.forEach(element => {
        
      });
    }).catch(()=>{
      console.log('Error in loadCards');
    });
  }


  async addMoodObject(toInsert: Mood){
    this.storage.get(MOOD_KEY).then((moodArr: Mood[]) => {
      
      if(moodArr == null){
        moodArr = new Array();
      }

      moodArr.push(toInsert);
      console.log(moodArr);
      this.storage.set(MOOD_KEY ,moodArr);
      this.isHidden = true;
    }).catch(() =>{
      console.log('cant store mood Obj in addMoodObject()');
    });
  }


  async checkLastMoodInsert(){ //checks the last insert of a Mood object into the storage

    this.storage.get(MOOD_KEY).then((moods: Mood[]) => {
      if(moods == null){
        this.isHidden = false;
        this.presentModal();
      }
      else if(moods.length == 0){
        this.isHidden = false;
        this.presentModal();
      } else {
        const result = new Date().getTime() - moods[moods.length - 1].dateTime.getTime(); // dif between last input and now
        console.log(result);
        console.log(moods[moods.length - 1].dateTime);
  
        if(result >= 43200000){
          this.isHidden = false;
          this.presentModal();
        } else{
          this.isHidden = true;
        }
      }
    });
  }
}

const MOOD_KEY = 'MoodObject';
const CARDS_KEY = 'ExerciseCards';
