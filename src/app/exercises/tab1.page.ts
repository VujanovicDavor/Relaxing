import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ManageplaylistsPage } from './manageplaylists/manageplaylists.page';
import { ExerciseCard } from 'src/models/exercise.card';
import * as JSONdata from "../default_data/data.json";
import { ManageExercisesPage } from './manage-exercises/manage-exercises.page';
import { Photo, PhotoService } from '../services/photo.service';
import { Playlist } from 'src/models/playlist';
import { PLAYLIST_KEY } from 'src/models/keys';
import { CreatePlaylistPage } from './manageplaylists/createPlaylist/createPlaylist';

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
  private exerciseHTMLElements: Array<HTMLElement>;
  private playlistHTMLElements: Array<HTMLElement>;

  constructor(private alertController: AlertController ,private storage: Storage, private actionSheetController: ActionSheetController, private modalController: ModalController, private photoService: PhotoService) {
    this.titleIsExercise = true;
    this.exerciseList = new Array();
    this.playlistList = new Array();
    this.exerciseHTMLElements = new Array();
    this.playlistHTMLElements = new Array();
  }

  async editPlaylist(playlist: Playlist){

  }

  async editExercise(exercise: ExerciseCard){

  }


  async showActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Create new Playlist / Exercise',
      buttons: [{
        text: 'Create new Playlist',
        icon: "play-circle-outline",
        handler: async () => {
          const modal = await this.modalController.create({
            component: CreatePlaylistPage
          });

          modal.onDidDismiss().then((data) => {
            if(data.data == null){
              console.log('Closed the modal (pressed close)');
            } else {
              return data.data;
            }
          }).then(async (playlist: Playlist) => {
            this.storage.get(PLAYLIST_KEY).then(async (playlists: Playlist[]) => {

              if(playlist.id == null || playlist.id == ''){
                playlist.id = String(playlists.length);
                playlists.push(playlist);
                this.playlistHTMLElements.push(this.loadPlaylist(playlist));

                if(!this.titleIsExercise){
                  this.appendHTMLElement(this.loadPlaylist(playlist)); // append to DOM if current State is playlist switch
                }

                await this.storage.set(PLAYLIST_KEY, playlists);
              } else {
                let foundPlaylist: boolean = false;

                for (let i = 0; i < playlists.length && !foundPlaylist; i++){
                  if(playlists[i].id == playlist.id) {
                    foundPlaylist = true;
                    playlists[i] = playlist;

                    if(!this.titleIsExercise){
                      this.removeHTMLElement(this.playlistHTMLElements[i]);
                      this.playlistHTMLElements[i] = this.loadPlaylist(playlist);
                      this.appendHTMLElement(this.playlistHTMLElements[i]);
                    }
                  }
                }

                if(foundPlaylist){
                  await this.storage.set(PLAYLIST_KEY, playlists);
                } else {
                  console.log('No playlist with such ID found => not able to store');
                }
              }
            });
          });
          return await modal.present();
        }
      },
      {
        text: 'Create new Exercise',
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

    await this.storage.get(PLAYLIST_KEY).then(async (playlists) => {
      if(playlists == null || playlists.length == 0){
        playlists = new Array();
        this.storage.set(PLAYLIST_KEY, playlists);
      }
      
      for(let i = 0; i < playlists.length; i++){
        const newPlaylist: HTMLElement = this.loadPlaylist(playlists[i]);
        this.playlistHTMLElements.push(newPlaylist);
      }
    })

    this.setTabTitle(this.titleIsExercise);
  }

  private setTabTitle(isExerciseTitle: boolean){
    const tabTitle: HTMLIonTitleElement = <HTMLIonTitleElement> document.getElementById('tab1_title_id');
    isExerciseTitle ? tabTitle.textContent = 'Exercises' : tabTitle.textContent = 'Playlists';
  }

  private updateSegment(ev: any) {
    this.titleIsExercise = !this.titleIsExercise;
    this.setTabTitle(this.titleIsExercise);
    this.switchHTMLCards();
  }

  private switchHTMLCards(){

    if(this.titleIsExercise){
      this.removeHTMLElementsSwitch(this.playlistHTMLElements);
      this.appendHTMLElementsSwitch(this.exerciseHTMLElements);
    } else {
      this.removeHTMLElementsSwitch(this.exerciseHTMLElements);
      this.appendHTMLElementsSwitch(this.playlistHTMLElements);
    }
  }

  private removeHTMLElementsSwitch(elements: HTMLElement[]){
    for(let i = 0; i < elements.length; i++){
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  private appendHTMLElementsSwitch(elements: HTMLElement[]){
    for(let i = elements.length - 1; i >= 0; i--){
      document.getElementById('exercises_tab1').appendChild(elements[i]);
    }
  }

  private appendHTMLElement(element: HTMLElement){
    document.getElementById('exercises_tab1').appendChild(element);
  }

  private removeHTMLElement(element: HTMLElement){
    document.getElementById('exercises_tab1').removeChild(element);
  } 

  async openOptionsAlert(object){
    let optionSubMessage: string = '';
    let exercise: ExerciseCard = null;
    let playlist: Playlist = null;

    try{
      playlist = object;
    } catch {
      exercise = object;
    }

    const alert = await this.alertController.create({
      header: 'Select an option',
      message: 'Do you want to delete or edit this ' + optionSubMessage,
      buttons: [{
        text: 'Edit',
        handler: () => {
          
        }
      },
      {
        text: 'Delete',
        handler: () => {
          if(playlist == null){

          } else {
            this.deletePlaylist(playlist);
          }
        }
      }]      
    });

    await alert.present();
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

    card.id = CARD_ID + String(playlist.id);
    console.log(card.id);
    console.log(playlist.id);

    optionIcon.name = 'ellipsis-vertical';
    optionButton.appendChild(optionIcon);
    optionButton.slot = 'end';
    optionButton.addEventListener('click', (e: Event) => this.openOptionsAlert(playlist));

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
    this.exerciseHTMLElements.push(ionCard);

    return ionCard;
  }

  async deletePlaylist(playlist: Playlist){
    this.storage.get(PLAYLIST_KEY).then(async (playlists: Playlist[]) => {
      let foundPlaylist: boolean = false;

      for(let i = 0; i < playlists.length && !foundPlaylist; i++){
        if(playlists[i].id == playlist.id){
          foundPlaylist = true;

          playlists.splice(i, 1);
          this.removeHTMLElement(this.playlistHTMLElements[i]);
          this.playlistHTMLElements.splice(i ,1);
        }
      }

      await this.storage.set(PLAYLIST_KEY, playlists);
    });
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
    this.exerciseHTMLElements.push(ionCard);
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
    } else {
      this.playlistHTMLElements.forEach(element => {
        
      });
    }
  }
}

const EXERCISE_KEY = 'exercises';
const CARD_ID = 'playlist_card_';