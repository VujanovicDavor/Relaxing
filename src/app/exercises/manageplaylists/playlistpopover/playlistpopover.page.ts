import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ExerciseCard } from 'src/models/exercise.card';
import { AddExercisesPage } from '../add-exercises/add-exercises.page';
import { Storage } from '@ionic/storage-angular';
import { Playlist } from '../../../../models/playlist';
import { EXERCISE_KEY, PLAYLIST_KEY } from '../../../../models/keys';

@Component({
  selector: 'app-playlistpopover',
  templateUrl: './playlistpopover.page.html',
  styleUrls: ['./playlistpopover.page.scss'],
})
export class PlaylistpopoverPage implements OnInit {
  title: string = null;
  list: Array<ExerciseCard>;
  isHidden: boolean;
  inputPlaylistName: string;
  inputPlaylistDescription: string;
  isEmptyInput: boolean;
  isEmptyExerciseList: boolean;


  constructor(private popoverController: PopoverController, private navParams: NavParams, private modalController: ModalController, private storage: Storage, private alertController: AlertController) {
    this.title = navParams.get('title');
    this.list = new Array();
    this.isHidden = true;
    this.inputPlaylistName = '';
    this.inputPlaylistDescription = '';
    this.isEmptyInput = true;
    this.isEmptyExerciseList = true;
  }

  private setTitle(){
    document.getElementById('title').textContent = this.title;    
  }

  async showAddExerciseModal(){
    const addExerciseModal = await this.modalController.create({
      component: AddExercisesPage
    });

    addExerciseModal.onDidDismiss().then((data) => {
      return data.data;
    }).then((data: Number) => {
      if(data >= 0){
        this.addExercise(data);
      }
    });
    
    return await addExerciseModal.present();
  }

  private containsElement(id: Number): boolean{
    for(let i = 0; i < this.list.length; i++){
      if(Number(this.list[i].id) == id){
        return true;
      }
    }
    return false;
  }

  async addExercise(id: Number){
    this.storage.get(EXERCISE_KEY).then((data: ExerciseCard[]) => {
      if(data != null && data.length != 0){
        for(let i = 0; i < data.length; i++){
          if(Number(data[i].id) == id){
            if(!this.containsElement(id)){
              this.list.push(data[i]);
              this.addExerciseToHTML(data[i]);
            } else {
              this.presentFailedToAddExerciseAlert();
            }
          }
        }
      }
    })
  }

  async presentFailedToAddExerciseAlert(){
    const alert = await this.alertController.create({
      header: 'Failed to add Exercise',
      message: 'Exercise is already in the playlist',
      buttons: ['OK']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log(role);
  }

  async presentDeleteExerciseAlert(id: Number){
    const alert = await this.alertController.create({
      header: 'Remove Exercise',
      message: 'Do you really want to remove this exercise?',
      buttons: [{
        text: 'Remove',
        role: 'destructive',
        handler: () => {
          const chip: HTMLIonChipElement = <HTMLIonChipElement>document.getElementById(EXERCISE_SLID_ITEM_ID + id);
          chip.parentNode.removeChild(chip);
          
          for(let i = 0; i < this.list.length; i++){
            if(id == Number(this.list[i].id)){
              this.list.splice(i, 1);
            }
          }

          if(this.list.length == 0){
            this.isHidden = true;
            this.isEmptyExerciseList = true;
            this.disableStoreButton();
          }
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
      }]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log(role); 
  }

  addExerciseToHTML(exercise: ExerciseCard): void{
    this.isHidden = false;

    // init
    const list: HTMLIonListElement = <HTMLIonListElement> document.getElementById('exercises_popover_list');
    const item: HTMLIonItemElement = document.createElement('ion-item');
    const label: HTMLIonLabelElement = document.createElement('ion-label');
    const icon: HTMLIonIconElement = document.createElement('ion-icon');
    const slidingItem: HTMLIonItemSlidingElement = document.createElement('ion-item-sliding');
    const optionsItem: HTMLIonItemOptionsElement = document.createElement('ion-item-options');
    const deleteButton: HTMLIonButtonElement = document.createElement('ion-button');
    const deleteIcon: HTMLIonIconElement = document.createElement('ion-icon');

    // logic
    label.textContent = exercise.title;
    icon.name = 'reorder-three-outline';
    icon.slot = 'end';
    deleteIcon.name = 'trash';
    deleteButton.addEventListener('click', (e: Event) => this.presentDeleteExerciseAlert(Number(exercise.id)));
    deleteButton.color = 'danger';
    optionsItem.side = 'end';

    // append
    item.appendChild(label);
    deleteButton.appendChild(deleteIcon);
    optionsItem.appendChild(deleteButton)
    slidingItem.appendChild(item);
    slidingItem.appendChild(optionsItem);
    slidingItem.id = EXERCISE_SLID_ITEM_ID + exercise.id;
    list.appendChild(slidingItem);

    this.isEmptyExerciseList = false;
    this.disableStoreButton();
  }

  async ngOnInit() {
    await this.storage.create();
    this.setTitle();
    this.disableStoreButton();
  }

  private disableStoreButton(){
    const button: HTMLIonButtonElement = <HTMLIonButtonElement> document.getElementById('storeNewPlaylistButton');
    
    if(!this.isEmptyExerciseList && !this.isEmptyInput){
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }

  private updateInput(){
    if(this.inputPlaylistName.length != 0){
      this.isEmptyInput = false;
    } else {
      this.isEmptyInput = true;
    }

    this.disableStoreButton();
  }

  private async storePlaylist(){
    const newPlaylist: Playlist = new Playlist();
    
    this.storage.get(PLAYLIST_KEY).then((playlists: Playlist[]) => {
      if(playlists == null || playlists.length == 0){
        playlists = new Array();
      }

      newPlaylist.createNewPlaylist(String(playlists.length), this.inputPlaylistName, this.inputPlaylistDescription, this.list);
      playlists.push(newPlaylist);
      this.storage.set(PLAYLIST_KEY, playlists);
    });

    this.popoverController.dismiss(newPlaylist);
  }

}
const EXERCISE_SLID_ITEM_ID = 'slide_item_';