import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from '../../Models/exercise.card';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

  constructor(private storage: Storage) {}

  /*
  createExercise(){
    const card: ExerciseCard = new ExerciseCard();
    card.createCard()

    let card: ExerciseCard = {
    content : 'Hey, this is a test Card !!!',
    id : 'testCard',
    title : 'Test',
    img : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png',
    };
    
    this.storage.set('exerciseCards', card);
  }*/

  async ngOnInit(){
    await this.storage.create();
    //this.storage.clear();
  }

}
