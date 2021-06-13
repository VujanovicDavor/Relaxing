import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ManageplaylistsPage } from './manageplaylists/manageplaylists.page';
import { ExerciseCard } from 'src/models/exercise.card';
import * as JSONdata from "../default_data/data.json";
import { ManageExercisesPage } from './manage-exercises/manage-exercises.page';
import { Photo, PhotoService } from '../services/photo.service';
import { Playlist } from 'src/models/playlist';
import { PLAYLIST_KEY } from 'src/models/keys';
import { identifierModuleUrl } from '@angular/compiler';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

  private titleIsExercise;
  private exerciseList: Array<ExerciseCard>;
  private playlistList: Array<Playlist>;
  private searchbarInput: string;

  constructor(private storage: Storage, private actionSheetController: ActionSheetController, private modalController: ModalController, private photoService: PhotoService) {
    this.titleIsExercise = true;
    this.exerciseList = new Array();
    this.playlistList = new Array();
  }


  async showActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Manage Playlists/Exercises',
      buttons: [{
        text: 'Manage Playlist(s)',
        icon: "play-circle-outline",
        handler: async () => {
          const modal = await this.modalController.create({
            component: ManageplaylistsPage
          });

          modal.onDidDismiss().then((data) => {
            if(data.data == null){
              console.log('Closed the modal (pressed close)');
            } else {
              console.log(data.data);
            }
          })
          return await modal.present();
        }
      },
      {
        text: 'Manage custom Exercise(s)',
        icon: "accessibility-outline",
        handler: async () => {
          const modal = await this.modalController.create({
            component: ManageExercisesPage,
            componentProps: {exerciseTitle: 'New Exercise'}
          });

          modal.onDidDismiss().then(async(data) => {
            if(data.data == null){
              console.log('Closed Modal (pressed close)')
            } else {
              console.log('HERE NO TOO');   
              const div: HTMLElement = <HTMLElement> document.getElementById('exercises_tab1');
              div.appendChild(await this.createCustomExerciseCard(data.data));
            }
          });

          return await modal.present();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Clicked cancel');
        }
      }
    ]
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
  }
  /*
  createExercise(){
    const card: ExerciseCard = new ExerciseCard();
    card.createCard()

    let card: ExerciseCard = {
    content : 'Hey, this is a test Card !!!',
    id : 'testCard',
    title : 'Test',
    img : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png',
    };
    
    this.storage.set('exerciseCards', card);
  }*/

  async ngOnInit(){
    await this.storage.create();
    await this.storage.get(EXERCISE_KEY).then((cards) => {
      if(cards == null || cards.length == 0){ // stores default exercises if the user runs the app the first time
        cards = new Array();
        
        for(let i = 0; i < JSONdata.exercises.length; i++){
          const card: ExerciseCard = new ExerciseCard();
          card.title = JSONdata.exercises[i].title;
          card.content = JSONdata.exercises[i].description;
          card.img = JSONdata.exercises[i].imageAddress;
          card.id = String(JSONdata.exercises[i].id);
          cards.push(card);
        }
        this.storage.set(EXERCISE_KEY, cards);
      }
      console.log(cards);

    });
    
    await this.loadCards();

    await this.storage.get(PLAYLIST_KEY).then((playlists) => {
      if(playlists == null || playlists.length == 0){
        playlists = new Array();
      }
    })

    this.setTabTitle(this.titleIsExercise);
  }

  private setTabTitle(isExerciseTitle: boolean){
    const tabTitle: HTMLIonTitleElement = <HTMLIonTitleElement> document.getElementById('tab1_title_id');
    isExerciseTitle ? tabTitle.textContent = 'Exercises' : tabTitle.textContent = 'Playlists';
  }

  updateSegment(ev: any) {
    this.titleIsExercise = !this.titleIsExercise;
    this.setTabTitle(this.titleIsExercise);
  }


  private async loadCards(){ // loads the cards
    this.storage.get(EXERCISE_KEY).then(async (exercises: ExerciseCard[]) => {
      this.exerciseList = exercises;
      const div: HTMLElement = document.getElementById('exercises_tab1');
      for(let i = 0; i < exercises.length; i++){
        if(exercises[i].img == null || exercises[i].img == ''){
          div.appendChild(this.createCustomExerciseCard(exercises[i]));
        } else if(exercises[i].webViewPath == null || exercises[i].webViewPath == ''){
          div.appendChild(this.createDefaultExerciseCard(exercises[i]));
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
    const ionTitle: HTMLIonTitleElement = document.createElement('ion-title');
    const ionContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const img: HTMLImageElement = document.createElement('img');

    // declare
    ionTitle.textContent = card.title;
    ionContent.textContent = card.content;
    img.src = card.img;

    // append
    ionHeader.appendChild(ionTitle);
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
    const ionTitle: HTMLIonTitleElement = document.createElement('ion-title');
    const ionContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const img: HTMLImageElement = document.createElement('img');

    // declare
    ionTitle.textContent = card.title;
    ionContent.textContent = card.content;
    img.src = card.webViewPath;

    // append
    ionHeader.appendChild(ionTitle);
    ionCard.appendChild(ionHeader);    
    ionCard.appendChild(img);
    ionCard.appendChild(ionContent);

    // set id
    ionCard.id = 'ExerciseCard' + card.id;
    return ionCard;
  }

  updateSearchResult(){
    if(this.titleIsExercise){
      this.exerciseList.forEach(element => {
        const card: HTMLIonCardElement = <HTMLIonCardElement> document.getElementById('ExerciseCard' + element.id);
        let foundTitle: boolean = false;
        let txt: string = '';

        for(let i = 0; i < card.children.length && !foundTitle; i++){
          if(card.children[i].tagName == 'ION-CARD-HEADER'){
            foundTitle = true;
            txt = card.children[i].children[0].textContent;
            let presentCard: boolean = txt.toLowerCase().indexOf(this.searchbarInput.toLowerCase()) > -1;
            card.style.display = presentCard ? 'block' : 'none';
          }
        }
      });
    }
  }
}

const EXERCISE_KEY = 'exercises';
