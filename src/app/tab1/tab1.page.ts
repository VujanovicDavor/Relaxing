import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

  constructor(public storage: Storage) {}

  async loadExercises(){
    const card: ExerciseCard = await this.storage.get('exerciseCards');
    const div = document.getElementById('test');
    const ionicCard = document.createElement('ion-card');
    const ionCardHeader = document.createElement('ion-card-header');
    const ionCardTitle = document.createElement('ion-card-title');
    ionCardTitle.textContent = card.title;
    ionCardHeader.appendChild(ionCardTitle);
    const img = document.createElement('img');
    img.src = card.img;
    const ionCardContent = document.createElement('ion-card-content');
    ionCardContent.textContent = card.content;

    ionicCard.appendChild(ionCardHeader);
    ionicCard.appendChild(img);
    ionicCard.appendChild(ionCardContent);
    div.appendChild(ionicCard);
  }

  createExercise(){
    let card: ExerciseCard = {
    content : 'Hey, this is a test Card !!!',
    id : 'testCard',
    title : 'Test',
    img : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png',
    };
    
    this.storage.set('exerciseCards', card);
  }

  async ngOnInit(){
    await this.storage.create();
    //this.createExercise();
    this.loadExercises();
  }

}

interface ExerciseCard {
  id: string,
  title: string,
  content: string,
  img: string
}
