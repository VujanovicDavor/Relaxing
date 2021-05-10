import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from '../../Models/exercise.card';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

  constructor(public storage: Storage) {}

  createExercise(){
    let exerciseArr: ExerciseCard[] = new Array();

    this.storage.set(CARDS_KEY, exerciseArr);

    console.log('set card');
  }

  async ngOnInit(){
    await this.storage.create();

    this.storage.get(CARDS_KEY).then((exerciseArr: ExerciseCard[])=>{
      if(exerciseArr == null || exerciseArr.length == 0){
        //this.createExercise();
        console.log('creating Cards');
      }
    });
  }

}

const CARDS_KEY = 'ExerciseCards';
