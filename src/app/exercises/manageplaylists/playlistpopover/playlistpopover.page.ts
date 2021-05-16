import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ExerciseCard } from 'src/models/exercise.card';
import { AddExercisesPage } from '../add-exercises/add-exercises.page';

@Component({
  selector: 'app-playlistpopover',
  templateUrl: './playlistpopover.page.html',
  styleUrls: ['./playlistpopover.page.scss'],
})
export class PlaylistpopoverPage implements OnInit {
  title: string = null;

  constructor(private navParams: NavParams, private modalController: ModalController) {
    this.title = navParams.get('title');
  }

  setTitle(){
    document.getElementById('title').textContent = this.title;    
  }

  async showAddExerciseModal(){
    const addExerciseModal = await this.modalController.create({
      component: AddExercisesPage
    });

    addExerciseModal.onDidDismiss().then((data) => {
      return data.data;
    }).then((data: ExerciseCard) => {
      if(data != null){
        this.addExerciseToList(data);
      }
    });
    
    return await addExerciseModal.present();
  }

  addExerciseToList(exercise: ExerciseCard): void{
    const p: HTMLElement = document.getElementById('exercises');
    const chip = document.createElement('ion-chip');
    chip.textContent = exercise.title;
    p.appendChild(chip);
  }

  ngOnInit() {
    this.setTitle();
  }

}
