import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ManageplaylistsPage } from './manageplaylists/manageplaylists.page';
import { ExerciseCard } from 'src/models/exercise.card';
import * as JSONdata from "../default_data/data.json";
import { ManageExercisesPage } from './manage-exercises/manage-exercises.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

  constructor(private storage: Storage, private actionSheetController: ActionSheetController, private modalController: ModalController) {}


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

          modal.onDidDismiss().then((data) => {
            if(data.data == null){
              console.log('Closed Modal (pressed close)')
            } else {
              console.log('Received data');
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

    await this.storage.get(EXERCISE_KEY).then((cards: ExerciseCard[]) => {
      if(cards == null || cards.length == 0){ // stores default exercises if the user runs the app the first time
        cards = new Array();
        
        for(let i = 0; i < JSONdata.exercises.length; i++){
          const card: ExerciseCard = new ExerciseCard();
          card.createCard(String(JSONdata.exercises[i].id), JSONdata.exercises[i].title, JSONdata.exercises[i].description, JSONdata.exercises[i].imageAddress, JSONdata.exercises[i].type);
          cards.push(card);
        }
        this.storage.set(EXERCISE_KEY, cards);
      }
    });

    this.loadCards();
  }


  async loadCards(){ // loads the cards
    this.storage.get(EXERCISE_KEY).then((exercises: ExerciseCard[]) => {
      const div: HTMLElement = document.getElementById('exercises');
      for(let i = 0; i < exercises.length; i++){
        div.appendChild(ExerciseCard.toCard(exercises[i]));
      }
    })
  }
}

const EXERCISE_KEY = 'exercises';
