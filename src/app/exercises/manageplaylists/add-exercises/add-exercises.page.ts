import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from '../../../../Models/exercise.card';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-exercises',
  templateUrl: './add-exercises.page.html',
  styleUrls: ['./add-exercises.page.scss'],
})
export class AddExercisesPage implements OnInit {

  constructor(private storage: Storage, private modalController: ModalController) { }

  closeModal(){
    this.modalController.dismiss();
  }

  async ngOnInit() {
    await this.storage.create();

    this.storage.get(GET_EXERCISES).then((exercises: ExerciseCard[]) => {
      if(exercises == null || exercises.length == 0){
        document.getElementById('exercises').textContent = 'No exercises found!';
      } else {
        const list: HTMLElement = document.createElement('ion-list');

        exercises.forEach(exercise => { // append items from storage to list
          list.appendChild(exercise.toListItem());
        });
      }
    })
  }

}

const GET_EXERCISES = 'exercises';