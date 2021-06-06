import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { PhotoService, Photo } from '../../services/photo.service';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from 'src/models/exercise.card';

@Component({
  selector: 'app-manage-exercises',
  templateUrl: './manage-exercises.page.html',
  styleUrls: ['./manage-exercises.page.scss'],
})
export class ManageExercisesPage implements OnInit {

  exerciseLabel: string;

  exerciseCard: ExerciseCard;

  constructor(private modalController: ModalController, private navParams: NavParams, public photoService: PhotoService, private storage: Storage) { 
    this.exerciseLabel = navParams.get('exerciseTitle');
    this.exerciseCard = new ExerciseCard();

    if(this.exerciseLabel == null || this.exerciseLabel.length == 0){
      this.exerciseLabel = 'No Label';
    }
  }

  async addToPhotoGallery(){
    this.photoService.getPhoto().then((fileName) => {
      if(fileName == null || fileName.length == 0){
        console.log('No photo received');
      }
      this.exerciseCard.fileName = fileName;
      
    }).catch(() => {
      console.log('Error || no photo received');
    });
  }

  private async displayImageToCard(){
    const photo: Photo = await this.photoService.getPhotoByFileName(this.exerciseCard.fileName);
    const webViewPath: string = await this.photoService.getWebViewPath(photo);

    const div: HTMLElement = document.getElementById('exercise_card_img');
    const img: HTMLIonImgElement = <HTMLIonImgElement> document.createElement('ion-image');
    img.src = webViewPath;

    div.appendChild(img);
  }

  private changeExerciseLabel(value: string){
    const h: HTMLElement = <HTMLElement> document.getElementById(EXERCISE_LABEL_ID);
    h.textContent = value;
  }

  closeModal(){
    this.modalController.dismiss(null);

  }

  storeExericse(){

  }



  async ngOnInit() {
    this.storage.create();
    this.changeExerciseLabel(this.exerciseLabel);
  }

}

const EXERCISE_LABEL_ID = 'exercise_label_id';