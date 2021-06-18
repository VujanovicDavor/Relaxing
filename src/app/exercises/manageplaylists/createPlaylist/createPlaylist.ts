import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ExerciseCard } from 'src/models/exercise.card';
import { Playlist } from 'src/models/playlist';
import { AddExercisesPage } from '../add-exercises/add-exercises.page';

@Component({
  selector: 'app-playlistpopover',
  templateUrl: './playlistpopover.page.html',
  styleUrls: ['./playlistpopover.page.scss'],
})
export class CreatePlaylistPage implements OnInit {
  
  _inputPlaylistName: string;
  _inputPlaylistDescription: string;
  _listOfExercises: Array<ExerciseCard>;
  _storeButtonDisabled: boolean;

  constructor(private modalController: ModalController, private alertController: AlertController){
    this._listOfExercises = new Array();
    this._storeButtonDisabled = true;
  }

  async openAddExerciseModal(){
    console.log('DO')

    const addExerciseModal = await this.modalController.create({
      component: AddExercisesPage
    });

    addExerciseModal.onDidDismiss().then((data) => {
      return data.data;
    }).then((exercise) => {
      let isInList: boolean = false;

      for(let i = 0; i < this._listOfExercises.length && !isInList; i++){
        if(this._listOfExercises[i].id == exercise.id){
          isInList = true;
          this.listAlreadyContainsElementAlert(exercise);
        }
      }

      if(!isInList){
        this._listOfExercises.push(exercise);
        this.appendExerciseToHTML(exercise);
        this.checkStoreButton();
      }
    }).catch(() => {
      console.log('error occured');
    });

    return await addExerciseModal.present();
  }

  async listAlreadyContainsElementAlert(exercise: ExerciseCard){
    const alert = await this.alertController.create({
      header: 'Can\'t append exercise',
      subHeader: 'Exercise already in this playlist',
      message: 'Following element is already in this playlist: ' + exercise.title,
      buttons: [
        {
          text: 'Okay',
          role: 'backdrop'
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  /**
   * Creates a list item with trash button and appends it to the card
   * @param exercise 
   */
  appendExerciseToHTML(exercise: ExerciseCard){
    const list: HTMLIonListElement = <HTMLIonListElement> document.getElementById('playlistExerciseItems');
    const item: HTMLIonItemElement = document.createElement('ion-item');
    const label: HTMLIonLabelElement = document.createElement('ion-label');
    const button: HTMLIonButtonElement = document.createElement('ion-button');
    const icon: HTMLIonIconElement = document.createElement('ion-icon');

    icon.name = 'trash';
    label.textContent = exercise.title;
    button.color = 'danger';

    button.appendChild(icon);
    button.slot = 'end';
    button.addEventListener('click', (ev: Event) => (this.removeItemFromPlaylist({ htmlItem: item, exercise: exercise})));
    item.appendChild(label);
    item.appendChild(button);

    list.appendChild(item);
  }

  removeItemFromPlaylist(object: ExerciseListItem){
    object.htmlItem.parentNode.removeChild(object.htmlItem);
    
    let foundItem: boolean = false;

    for(let i = 0; i < this._listOfExercises.length && !foundItem; i++){
      if(this._listOfExercises[i].id == object.exercise.id){
        foundItem = true;
        this._listOfExercises.splice(i, 1);
      }
    }
  }

  storePlaylist(){
    let newPlaylist: Playlist = new Playlist();
    newPlaylist.name = this._inputPlaylistName;
    newPlaylist.description = this._inputPlaylistDescription;
    newPlaylist.cards = this._listOfExercises;
    this.modalController.dismiss(newPlaylist);
  }

  private checkStoreButton(){
    const button: HTMLIonButtonElement = <HTMLIonButtonElement> document.getElementById('storePlaylistButton');

    if(this._inputPlaylistName == null || this._inputPlaylistName == '' || this._inputPlaylistDescription == null || this._inputPlaylistDescription == '' || this._listOfExercises.length == 0){
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }

  closeModel() {
    this.modalController.dismiss(null);
  }

  async ngOnInit(){
    this.checkStoreButton();
  }
}
const EXERCISE_SLIDE_ITEM_ID = 'slide_item_';

type ExerciseListItem = {
  htmlItem: HTMLElement,
  exercise: ExerciseCard
}