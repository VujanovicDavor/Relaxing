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
import { PlayModalPage } from '../play-modal/play-modal.page';
import { LastPlayedActivity } from 'src/models/last_played_activity';

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
    const modal = await this.modalController.create({
      component: CreatePlaylistPage,
      componentProps: {'playlist': playlist}
    });

    modal.onDidDismiss().then((data) => {
      return data.data;
    }).then(async (data: Playlist) => {
      if(data.id != null && data.id != ''){
        this.storage.get(PLAYLIST_KEY).then((storedPlaylists: Playlist[]) => {
          let foundPlaylist: boolean = false;

          for( let i = 0 ; i < storedPlaylists.length && !foundPlaylist; i++) {
            if(storedPlaylists[i].id == data.id){
              foundPlaylist = true;
              storedPlaylists[i] = data;
            }
          }

          foundPlaylist = false;

          for( let i = 0; i < storedPlaylists.length && !foundPlaylist; i++){
            if(CARD_ID +  data.id == this.playlistHTMLElements[i].id) {
              console.log('New playlist')
              this.removeHTMLElement(this.playlistHTMLElements[i]);
              this.playlistHTMLElements[i] = this.loadPlaylist(data);
              this.appendHTMLElement(this.playlistHTMLElements[i]);
            }
          }

          this.storage.set(PLAYLIST_KEY, storedPlaylists);
        });
      }
    })

    return await modal.present();
  }

  async editExercise(exercise: ExerciseCard){
    const modal = await this.modalController.create({
      component: ManageExercisesPage,
      componentProps: {'Exercise': exercise, 'exerciseTitle': 'Edit ' + exercise.title}
    });

    modal.onDidDismiss().then((data) => {
      return data.data;
    }).then((exercise: ExerciseCard) => {

    });

    return await modal.present();
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

              if(playlist == null){
                return;
              }

              if(playlist.id == null || playlist.id == ''){
                playlist.id = String(playlists.length);
                playlists.push(playlist);
                this.playlistHTMLElements.push(this.loadPlaylist(playlist));

                if(!this.titleIsExercise){
                  this.appendHTMLElement(this.loadPlaylist(playlist)); // append to DOM if current State is playlist switch
                }

                await this.storage.set(PLAYLIST_KEY, playlists);
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
              this.exerciseList.push(data.data);
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
          card.lowerScore = JSONdata.exercises[i].minMoodScore;
          card.upperScore = JSONdata.exercises[i].maxMoodScore;
          card.minutes = JSONdata.exercises[i].minutes;
          card.seconds = JSONdata.exercises[i].seconds;
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
    for(let i = 0; i < elements.length; i++){
      document.getElementById('exercises_tab1').appendChild(elements[i]);
    }
  }

  private appendHTMLElement(element: HTMLElement){
    document.getElementById('exercises_tab1').appendChild(element);
  }

  private removeHTMLElement(element: HTMLElement){
    document.getElementById('exercises_tab1').removeChild(element);
  } 

  async openOptionsAlert(object, typeOfObject: string){
    let exercise: ExerciseCard = null;
    let playlist: Playlist = null;

    if(typeOfObject == 'Exercise'){
      exercise = object;
    } else if(typeOfObject == 'Playlist'){
      playlist = object;
    }

    const alert = await this.alertController.create({
      header: 'Select an option',
      message: 'Do you want to play, delete or edit this ' + typeOfObject,
      buttons: [{
          text: 'Play',
          handler: () => {
            if(playlist == null) {
              this.openPlayModal(null, exercise);
            } else {
              this.openPlayModal(playlist, null);
            }
          }
        },
        {
        text: 'Edit',
        handler: () => {
          if(playlist == null){
            this.editExercise(exercise);
          } else {
            this.editPlaylist(playlist);
          }
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


  private async loadCards(){ // loads the cards
    this.storage.get(EXERCISE_KEY).then(async (exercises: ExerciseCard[]) => {
      console.log(this.exerciseList = exercises);
      const div: HTMLElement = document.getElementById('exercises_tab1');
      for(let i = 0; i < exercises.length; i++){
        try {
          if(exercises[i].photo.webviewPath != '') {
            div.appendChild(this.createCustomExerciseCard(exercises[i]));
          } 
          } catch {
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

    card.id = CARD_ID + playlist.id;
    console.log(card.id);
    console.log(playlist.id);

    optionIcon.name = 'ellipsis-vertical';
    optionButton.appendChild(optionIcon);
    optionButton.slot = 'end';
    optionButton.addEventListener('click', (e: Event) => this.openOptionsAlert(playlist, 'Playlist'));

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
    const ionContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const img: HTMLImageElement = document.createElement('img');
    const headItem: HTMLIonItemElement = document.createElement('ion-item');
    const headLabel: HTMLIonLabelElement = document.createElement('ion-label');
    const optButton: HTMLIonButtonElement = document.createElement('ion-button');
    const optIcon: HTMLIonIconElement = document.createElement('ion-icon');
    const h2: HTMLElement = document.createElement('h2');

    // declare
    h2.textContent = card.title;
    optIcon.name = 'ellipsis-vertical';
    optButton.slot = 'end';
    optButton.addEventListener('click', (ev: Event) => this.openOptionsAlert(card, 'Exercise'));
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
    this.exerciseHTMLElements.push(ionCard);
    return ionCard;
  }

  updateSearchResult(){
    if(this.titleIsExercise){
      for(let i = 0; i < this.exerciseList.length; i++){
        const card: HTMLIonCardElement = <HTMLIonCardElement> document.getElementById('ExerciseCard' + this.exerciseList[i].id);
        let txt: string = this.exerciseList[i].title;
        let presentCard: boolean = txt.toLowerCase().indexOf(this.searchbarInput.toLowerCase()) > - 1;
        card.style.display = presentCard ? 'block' : 'none';
      };
    } else {
      this.playlistHTMLElements.forEach(element => {
        let txt: string = '';
        let foundTitle: boolean = false;

        for(let i = 0; i < element.children.length && !foundTitle; i++){
          if(element.children[i].tagName == 'ION-CARD-HEADER'){
            txt = element.children[i].children[0].children[0].children[0].textContent;
            let presentCard: boolean = txt.toLowerCase().indexOf(this.searchbarInput.toLowerCase()) > -1;
            element.style.display = presentCard ? 'block' : 'none';
            foundTitle = true;
          }
        }
      });
    }
  }
}

const EXERCISE_KEY = 'exercises';
const CARD_ID = 'playlist_card_';
const LAST_PLAYED_ACTIVITY = 'last_played_activity';