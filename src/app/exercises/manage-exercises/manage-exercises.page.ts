import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-manage-exercises',
  templateUrl: './manage-exercises.page.html',
  styleUrls: ['./manage-exercises.page.scss'],
})
export class ManageExercisesPage implements OnInit {

  exerciseLabel: string;

  constructor(private modalController: ModalController, private navParams: NavParams, public photoService: PhotoService) { 
    this.exerciseLabel = navParams.get('exerciseTitle');

    if(this.exerciseLabel == null || this.exerciseLabel.length == 0){
      this.exerciseLabel = 'No Label';
    }
  }

  addToPhotoGallery(){
    this.photoService.addNewPhotoToGallery();
  }

  private changeExerciseLabel(value: string){
    const h: HTMLElement = <HTMLElement> document.getElementById(EXERCISE_LABEL_ID);
    h.textContent = value;
  }

  closeModal(){
    this.modalController.dismiss(null);
  }



  async ngOnInit() {
    this.changeExerciseLabel(this.exerciseLabel);
  }

}

const EXERCISE_LABEL_ID = 'exercise_label_id';