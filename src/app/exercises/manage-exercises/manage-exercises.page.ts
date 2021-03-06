import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { PhotoService, Photo } from '../../services/photo.service';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from 'src/models/exercise.card';
import { EXERCISE_KEY } from 'src/models/keys';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-manage-exercises',
  templateUrl: './manage-exercises.page.html',
  styleUrls: ['./manage-exercises.page.scss'],
})
export class ManageExercisesPage implements OnInit {

  exerciseLabel: string;

  inputName: string;
  inputDescription: string;
  inputMinutes: number;
  inputSeconds: number;
  _webViewPath: string;

  exerciseCard: ExerciseCard;

  constructor(private modalController: ModalController, private navParams: NavParams, public photoService: PhotoService, private storage: Storage) { 
    this.exerciseLabel = navParams.get('exerciseTitle');
    this.exerciseCard = navParams.get('Exercise');

    if(this.exerciseCard == null){
      this.exerciseCard = new ExerciseCard();
    } else {
      this.inputName = this.exerciseCard.title;
      this.inputDescription = this.exerciseCard.content;
      this.inputMinutes = this.exerciseCard.minutes;
      this.inputSeconds = this.exerciseCard.seconds;
      this._webViewPath = this.exerciseCard.photo.webviewPath;
    }

    if(this.exerciseLabel == null || this.exerciseLabel.length == 0){
      this.exerciseLabel = 'No Label';
    }
  }

  async addToPhotoGallery(){
    this.photoService.getPhoto().then(async (photo) => {
      if (photo == null){
        return;
      }
      this.exerciseCard.photo = photo;
      await this.getPhotoFromStorage(photo);
      this.displayImageToCard();
      
    }).catch(() => {
      console.log('Error || no photo received');
    });
  }

  async getPhotoFromStorage(photo: Photo) {
    const readFile = await Filesystem.readFile({
      path: photo.filepath,
      directory: Directory.Data
    });
    this.exerciseCard.photo.webviewPath = 'data:image/jpeg;base64,' + readFile.data;
  }

  private async displayImageToCard(){
    const div: HTMLElement = document.getElementById('exercise_card_img');

    if(div.children.length != 0){
      for ( let i = 0 ; i < div.children.length; i++){
        div.removeChild(div.children[i]);
      }
    }

    const img: HTMLImageElement = <HTMLImageElement> document.createElement('img');
    img.src = this.exerciseCard.photo.webviewPath;

    div.appendChild(img);

    const button: HTMLIonButtonElement = <HTMLIonButtonElement> document.getElementById('add_photo_button');
    button.parentNode.removeChild(button);
  }

  private changeExerciseLabel(value: string){
    const h: HTMLElement = <HTMLElement> document.getElementById(EXERCISE_LABEL_ID);
    h.textContent = value;
  }

  closeModal(){
    this.modalController.dismiss(null);
  }

  updateStoreButton(){
    const button: HTMLIonButtonElement = <HTMLIonButtonElement> document.getElementById('exercise_store_button');
    
    
    if(this.inputDescription == null || this.inputName == null || this.inputMinutes == null && this.inputSeconds == null){
      button.disabled = true;
    } else {
      let sum: number = 0;
      if(this.inputMinutes == null){
        sum = this.inputSeconds;
      } else {
        sum = this.inputMinutes;
      }

      if(sum > 0){
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    }
  }


  async storeExericse(){
    this.exerciseCard.content = this.inputDescription;
    this.exerciseCard.title = this.inputName;
    this.exerciseCard.minutes = this.inputMinutes;
    this.exerciseCard.seconds = this.inputSeconds;

    console.log('Here');

    this.storage.get(EXERCISE_KEY).then(async (cards: ExerciseCard[]) => {
      console.log('ALL cards ' + cards);
      if(this.exerciseCard.id == null){
        let nextId = cards[cards.length - 1].id;
        this.exerciseCard.id = nextId;
        console.log('HEY am here');
        cards.push(this.exerciseCard);
        console.log(cards);
      } 
      console.log('HERE NOO');
      try{
        await this.storage.set(EXERCISE_KEY, cards);
      } catch {
        console.log('Here is  the error');
      }
      console.log('Before this');
    });

    this.modalController.dismiss(this.exerciseCard);
  }

  setWebViewPath(){
    if(this._webViewPath == null || this._webViewPath == ''){
      return;
    } else {
      const div = document.getElementById('exercise_card_img');
      const img: HTMLImageElement = document.createElement('img');
      img.src = this._webViewPath;
      div.appendChild(img);

      const button: HTMLIonButtonElement = <HTMLIonButtonElement> document.getElementById('add_photo_button');
      button.textContent = 'Change Image';
    }
  }



  async ngOnInit() {
    this.storage.create();
    this.changeExerciseLabel(this.exerciseLabel);
    this.updateStoreButton();
    this.setWebViewPath();
  }

}

const EXERCISE_LABEL_ID = 'exercise_label_id';