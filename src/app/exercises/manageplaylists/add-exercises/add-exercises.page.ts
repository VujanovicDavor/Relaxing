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

  items: Array<HTMLElement>;
  input: string;

  closeModal(){
    this.modalController.dismiss();
  }

  async ngOnInit() {
    await this.storage.create();

    this.storage.get(GET_EXERCISES).then((exercises: ExerciseCard[]) => {
      if(exercises == null || exercises.length == 0){
        document.getElementById('exercises').textContent = 'No exercises found!';
      } else {
        this.loadItems(exercises);
      }
    });

  }

  loadItems(exercises: ExerciseCard[]){
    const div: HTMLElement = document.getElementById('list-exercises');
    const list: HTMLElement = document.createElement('ion-list');
    this.items = new Array();

    exercises.forEach(exercise => { // append items from storage to list
      const item: HTMLElement = ExerciseCard.toListItem(exercise);
      this.items.push(item);
      const button: HTMLIonButtonElement = document.createElement('ion-button');
      const icon: HTMLIonIconElement = document.createElement('ion-icon');
      icon.name = 'list-outline';
      button.slot = 'end';
      button.appendChild(icon);
      item.appendChild(button);
      list.appendChild(item);
    });
    div.appendChild(list);
  }

  updateList(){ // update list with items
    this.items.forEach(element => {
      const txt: string = element.textContent;
      const present: boolean = txt.toLowerCase().indexOf(this.input.toLowerCase()) > -1;
      element.style.display = present ? 'block' : 'none';
    });
  }

  returnExercise(){
    
  }
}

const GET_EXERCISES = 'exercises';