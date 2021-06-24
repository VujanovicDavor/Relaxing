import { Component, OnInit } from '@angular/core';
import { IonCard, ModalController } from '@ionic/angular';
import {InsertMoodModalPage} from '../insert-mood-modal/insert-mood-modal.page';
import { Storage } from '@ionic/storage-angular';
import { Mood } from '../../models/mood';
import { LastPlayedActivity } from 'src/models/last_played_activity';
import { PLAYLIST_KEY } from '../../models/keys';
import { Playlist } from '../../models/playlist';
import { PlayModalPage } from '../play-modal/play-modal.page';
import * as JSONdata from "../default_data/data.json";
import { ExerciseCard } from 'src/models/exercise.card';

@Component({
  selector: 'app-home-page',  
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  isHidden: boolean;
  private exerciseList: Array<ExerciseCard>;


  constructor(public modalController: ModalController, public storage: Storage) {
    this.isHidden = false; //set true if the insert button should be hidden
  } 

  async presentModal() {
    const modal = await this.modalController.create({
      component: InsertMoodModalPage,
    });

    modal.onDidDismiss().then(async(data)=>{

     if(data.data == null){
       console.log('No data received (pressed "cancel")');
       this.isHidden = false;
     } else{
       const newMoodObject: Mood = <Mood> data.data; // receive data => store to mood array
       console.log(newMoodObject);
<<<<<<< HEAD
       console.log("total: " + (newMoodObject.productivityLevel + newMoodObject.relaxLevel + newMoodObject.satisfactionLevel));
       //this.addMoodObject(newMoodObject);

       this.loadCards(newMoodObject.productivityLevel + newMoodObject.relaxLevel + newMoodObject.satisfactionLevel);
=======
       this.addMoodObject(newMoodObject);
       await this.getPlaylist(newMoodObject).then((playlist) => {
        this.openPlayModal(playlist, null);
       });

       
>>>>>>> 0cebdf15f1f08ccac4c5e138d1cda2f29877d606
     } 
    });

    return await modal.present();
  }

<<<<<<< HEAD
  private async loadCards(moodLevel: number){ // loads the cards
    console.log(moodLevel);
    this.storage.get(EXERCISE_KEY).then(async (exercises: ExerciseCard[]) => {
      console.log(this.exerciseList = exercises);
      const div: HTMLElement = document.getElementById('basedOnYourMoodExercises');
      
      for(let i = 0; i < exercises.length; i++){
        if(moodLevel < 6){
          if((exercises[i].img == null || exercises[i].img == '') && i < 3){
            div.appendChild(this.createCustomExerciseCard(exercises[i]));
          } else if((exercises[i].webViewPath == null || exercises[i].webViewPath == '') && i < 3){
            div.appendChild(this.createDefaultExerciseCard(exercises[i]));
          }
        }
        else if(moodLevel > 5 && moodLevel < 12){
          if((exercises[i].img == null || exercises[i].img == '') && i > 2 && i < 6){
            div.appendChild(this.createCustomExerciseCard(exercises[i]));
          } else if((exercises[i].webViewPath == null || exercises[i].webViewPath == '') && i > 2 && i < 6){
            div.appendChild(this.createDefaultExerciseCard(exercises[i]));
          }
        }
        else if(moodLevel > 11 && moodLevel <= 15){
          if((exercises[i].img == null || exercises[i].img == '') && i > 5){
            div.appendChild(this.createCustomExerciseCard(exercises[i]));
          } else if((exercises[i].webViewPath == null || exercises[i].webViewPath == '') && i > 5){
            div.appendChild(this.createDefaultExerciseCard(exercises[i]));
          }
        }
      }
    });
  }
=======
  async getPlaylist(newMoodObject: Mood): Promise<Playlist> {
    let exercises: ExerciseCard[] = await this.storage.get(EXERCISE_KEY);
    let playlist: Playlist = new Playlist();

    let foundExercises: boolean = false;

    for(let i = 0; i < exercises.length && !foundExercises; i++) {
      if(newMoodObject.relaxLevel + newMoodObject.productivityLevel + newMoodObject.satisfactionLevel <= exercises[i].upperScore && newMoodObject.relaxLevel + newMoodObject.productivityLevel + newMoodObject.satisfactionLevel >= exercises[i].lowerScore) {
        playlist.cards.push(exercises[i]); // sching sching
      }

      if(playlist.cards.length == 3) {
        foundExercises = true;
      }
    }
    return Promise.resolve(playlist);
  }

>>>>>>> 0cebdf15f1f08ccac4c5e138d1cda2f29877d606

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

  async presentLastPlayedActivity() {
    const div: HTMLElement =  document.getElementById('lastPlayedActivity');
    const title: HTMLElement = document.getElementById('lastPlayedActivityTitle');

    this.storage.get(LAST_PLAYED_ACTIVITY).then((activity : LastPlayedActivity) => {
      if(activity == null) {
        title.textContent = 'Start with a random exercise!';
      } else {
        title.textContent = 'Jump back in:';

        if(activity._exercise == null) {
          div.appendChild(this.loadPlaylist(activity._playlist));
        } else if(activity._playlist == null){
          try {
            if(activity._exercise.photo.webviewPath != '') {
              div.appendChild(this.createCustomExerciseCard(activity._exercise));
            } 
          } catch {
            div.appendChild(this.createDefaultExerciseCard(activity._exercise));
          }
        }
      }
    });
  }

  private createDefaultExerciseCard(card: ExerciseCard): HTMLIonCardElement {
    if(card == null){
      return null;
    }

    // init
    const ionCard: HTMLIonCardElement = document.createElement('ion-card');
    const ionHeader: HTMLIonCardHeaderElement = document.createElement('ion-card-header');
    const ionContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const img: HTMLImageElement = document.createElement('img');
    const headItem: HTMLIonItemElement = document.createElement('ion-item');
    const headLabel: HTMLIonLabelElement = document.createElement('ion-label');
    const optButton: HTMLIonButtonElement = document.createElement('ion-button');
    const optIcon: HTMLIonIconElement = document.createElement('ion-icon');
    const h2: HTMLElement = document.createElement('h2');

    // declare
    h2.textContent = card.title;
    optIcon.name = 'play';
    optButton.slot = 'end';
    optButton.addEventListener('click', (ev: Event) => this.openPlayModal(null, card));
    ionContent.textContent = card.content;
    img.src = card.img;

    // append
    headLabel.appendChild(h2);
    optButton.appendChild(optIcon);
    headItem.appendChild(headLabel);
    headItem.appendChild(optButton);
    ionHeader.appendChild(headItem);
    ionCard.appendChild(ionHeader);    
    ionCard.appendChild(img);
    ionCard.appendChild(ionContent);

    // set id
    ionCard.id = 'ExerciseCard' + card.id;

    return ionCard;
  }


  private createCustomExerciseCard(card: ExerciseCard): HTMLIonCardElement {
    if(card == null){
      return null;
    }

    // init
    const ionCard: HTMLIonCardElement = document.createElement('ion-card');
    const ionHeader: HTMLIonCardHeaderElement = document.createElement('ion-card-header');
    const ionContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const img: HTMLImageElement = document.createElement('img');
    const headItem: HTMLIonItemElement = document.createElement('ion-item');
    const headLabel: HTMLIonLabelElement = document.createElement('ion-label');
    const optButton: HTMLIonButtonElement = document.createElement('ion-button');
    const optIcon: HTMLIonIconElement = document.createElement('ion-icon');
    const h2: HTMLElement = document.createElement('h2');

    // declare
    h2.textContent = card.title;
    optIcon.name = 'play';
    optButton.slot = 'end';
    optButton.addEventListener('click', (ev: Event) => this.openPlayModal(null, card));
    ionContent.textContent = card.content;
    img.src = card.photo.webviewPath;

    // append
    headLabel.appendChild(h2);
    headItem.appendChild(headLabel);
    optButton.appendChild(optIcon);
    headItem.appendChild(optButton);
    ionHeader.appendChild(headItem);
    ionCard.appendChild(ionHeader);    
    ionCard.appendChild(img);
    ionCard.appendChild(ionContent);

    // set id
    ionCard.id = 'ExerciseCard' + card.id;
    return ionCard;
  }

  private loadPlaylist(playlist: Playlist){
    //const title: HTMLIonTitleElement = <HTMLIonTitleElement> document.getElementById('stored_playlists_title');
    //title.style.display = 'block';

    if(playlist == null){
      return;
    }

    console.log(playlist);

    const card: HTMLIonCardElement = document.createElement('ion-card');
    const cardHeader: HTMLIonCardHeaderElement = document.createElement('ion-card-header');
    const cardContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const label: HTMLIonLabelElement = document.createElement('ion-label');
    const labelItem: HTMLIonItemElement = document.createElement('ion-item');
    const optionButton: HTMLIonButtonElement = document.createElement('ion-button');
    const optionIcon: HTMLIonIconElement = document.createElement('ion-icon');
    const headItem: HTMLIonItemElement = document.createElement('ion-item');
    const headTitle: HTMLIonLabelElement = document.createElement('ion-label');
    const hTitle: HTMLElement = document.createElement('h2');

    card.id = CARD_ID + playlist.id;
    console.log(card.id);
    console.log(playlist.id);

    optionIcon.name = 'play';
    optionButton.appendChild(optionIcon);
    optionButton.slot = 'end';
    optionButton.addEventListener('click', (e: Event) => this.openPlayModal(playlist, null));

    hTitle.textContent = String(playlist.name);
    headTitle.appendChild(hTitle);
    headItem.appendChild(headTitle);
    headItem.appendChild(optionButton);

    cardHeader.appendChild(headItem);

    label.textContent = 'Exercises:';
    labelItem.appendChild(label);
    cardContent.textContent = String(playlist.description);

    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    card.appendChild(labelItem);

    for(let i = 0; i < playlist.cards.length; i++){
      const item: HTMLIonItemElement = document.createElement('ion-item');
      const label: HTMLIonLabelElement = document.createElement('ion-label');
      const h3: HTMLElement = document.createElement('h3');
      const icon: HTMLIonIconElement = document.createElement('ion-icon');
      icon.name = 'radio-button-on-outline';
      icon.slot = "start";

      h3.textContent = playlist.cards[i].title;
      label.appendChild(h3);
      item.appendChild(icon);
      item.appendChild(label);

      card.appendChild(item);
    }
    return card;
  }

  async openPlayModal(playlist: Playlist, card: ExerciseCard) {
    let lastPlayedActivity: LastPlayedActivity = new LastPlayedActivity();
    
    if(playlist == null) {
      lastPlayedActivity._exercise = card;
      await this.storage.set(LAST_PLAYED_ACTIVITY, lastPlayedActivity);

      this.storage.get(EXERCISE_KEY).then(async (exCards: ExerciseCard[]) => {
        let foundCard = false;

        for(let i = 0; i < exCards.length && !foundCard; i++) {
          if(exCards[i].id == card.id){
            foundCard = true;
            exCards[i].activityCounter++;
          }
        }

        await this.storage.set(EXERCISE_KEY, exCards);
      })
    } else {
      lastPlayedActivity._playlist = playlist;

      await this.storage.set(LAST_PLAYED_ACTIVITY, lastPlayedActivity);
      
      this.storage.get(PLAYLIST_KEY).then(async(playlists: Playlist[]) => {
        let foundPlaylist = false;

        for(let i = 0; i < playlists.length && !foundPlaylist; i++){
          if(playlists[i].id == playlist.id){
            playlists[i].activityCounter++;
            foundPlaylist = true;
          }
        }

        await this.storage.set(PLAYLIST_KEY, playlists);
      })
    }

    const modal = await this.modalController.create({
      component: PlayModalPage,
      componentProps: { 'exercise': card, 'playlist': playlist }
    });

    modal.onDidDismiss().then(()  => {

    });

    return await modal.present();
  }

  async presentMostPlayedActivity() {
    const div: HTMLElement = document.getElementById('mostPlayedActivity');

    this.storage.get(EXERCISE_KEY).then(async(cards: ExerciseCard[]) => {
      let playlists: Playlist[] = await this.storage.get(PLAYLIST_KEY);

      let maxPlay = 0;
      let maxCounterPlay;
      
      if(playlists.length > 0) {
        maxCounterPlay = playlists[0].activityCounter;

        for(let i = 1; i < playlists.length; i++) {
          if(playlists[i].activityCounter > maxCounterPlay) {
            maxPlay = i;
            maxCounterPlay = playlists[i].activityCounter;
          }
        }
      } else {
        maxCounterPlay = -1;
      }

      let maxCard = 0;
      let maxCounterCard = cards[0].activityCounter;

      for(let i = 1; i < cards.length; i++) {
        if(cards[i].activityCounter > maxCounterCard) {
          maxCard = i;
          maxCounterCard = cards[i].activityCounter;
        }
      }

      if(maxCounterCard >= maxCounterPlay) {
        try {
          if(cards[maxCard].photo.webviewPath != '') {
            div.appendChild(this.createCustomExerciseCard(cards[maxCard]));
          } 
        } catch {
          div.appendChild(this.createDefaultExerciseCard(cards[maxCard]));
        }
      } else {
        div.appendChild(this.loadPlaylist(playlists[maxPlay]));
      }

    })
  }

  async ngOnInit(){
    await this.storage.create();
    this.checkLastMoodInsert();
    this.presentLastPlayedActivity();
    this.presentMostPlayedActivity();
  }
}

const MOOD_KEY = 'MoodObject';
const EXERCISE_KEY = 'exercises';
const LAST_PLAYED_ACTIVITY = 'last_played_activity';
const CARD_ID = 'playlist_card_';
const MOODEXERCISE_KEY = "moodexerciseKEY";