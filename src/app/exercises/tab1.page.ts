import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ManageplaylistsPage } from './manageplaylists/manageplaylists.page';
import * as jsonData from '../default_data/data.json';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

  constructor(private storage: Storage, private actionSheetController: ActionSheetController, private modalController: ModalController) {}

  async showActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Manage Playlists/Exercises',
      buttons: [{
        text: 'Manage Playlist(s)',
        icon: "play-circle-outline",
        handler: async () => {
          const modal = await this.modalController.create({
            component: ManageplaylistsPage
          });

          modal.onDidDismiss().then((data) => {
            if(data.data == null){
              console.log('Closed the modal (pressed close)');
            } else {
              console.log(data.data);
            }
          })
          return await modal.present();
        }
      },
      {
        text: 'Manage custom Exercise(s)',
        icon: "accessibility-outline",
        handler: () => {
          console.log('Pressed Manage exercises');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Clicked cancel');
        }
      }
    ]
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
  }
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
  }

}
