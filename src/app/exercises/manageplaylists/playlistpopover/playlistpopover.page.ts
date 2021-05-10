import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
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
    
    return await addExerciseModal.present();
  }

  ngOnInit() {
    this.setTitle();
  }

}
