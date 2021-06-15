import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExerciseCard } from 'src/models/exercise.card';
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

  constructor(private modalController: ModalController){
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

    }).catch(() => {
      console.log('error occured');
    });

    return await addExerciseModal.present();
  }

  storePlaylist(){

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