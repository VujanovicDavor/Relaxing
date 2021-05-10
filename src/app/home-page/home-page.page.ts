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
    this.isHidden = false; //set true if the insert button should be hidden
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
       this.calculateScore(newMoodObject);
     } 
    });

    return await modal.present();
  }

  calculateScore(moodObject: Mood){
    let score: number = moodObject.relaxLevel + moodObject.productivityLevel + moodObject.satisfactionLevel;
    this.loadCards(score);
  }

  async loadCards(score: number){
    this.storage.get(CARDS_KEY).then((cards: ExerciseCard[]) => {
      cards.forEach(element => {
        this.presentCard(element);
      });
    }).catch(()=>{
      console.log('no cards found');
    });
  }

  presentCard(card: ExerciseCard){
    const cardDiv: HTMLElement = document.getElementById('moodCards');
    
    // create HTML-Card-Content
    const ionCard: HTMLElement = document.createElement('ion-card');
    const ionHeader: HTMLElement = document.createElement('ion-card-header');
    const ionTitle: HTMLElement = document.createElement('ion-card-title');
    const img: HTMLImageElement = document.createElement('img');
    const ionContent: HTMLElement = document.createElement('ion-card-content');

    // add text-content
    ionTitle.textContent = card.title;
    img.src = card.img;
    ionContent.textContent = card.content;

    // append elements
    ionHeader.appendChild(ionTitle);
    ionCard.appendChild(ionHeader);
    ionCard.appendChild(img);
    ionCard.appendChild(ionContent);

    cardDiv.appendChild(ionCard);
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
   //  this.checkLastMoodInsert();
  }
}

interface Mood {
  relaxLevel: number,
  productivityLevel: number,
  satisfactionLevel: number,
  dateTime: Date
}

interface ExerciseCard {
  id: string,
  title: string,
  content: string,
  img: string
}


const MOOD_KEY = 'MoodObject';
const CARDS_KEY = 'ExerciseCards';