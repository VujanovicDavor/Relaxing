import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Playlist } from 'src/models/playlist';

@Component({
  selector: 'app-manageplaylists',
  templateUrl: './manageplaylists.page.html',
  styleUrls: ['./manageplaylists.page.scss'],
})
export class ManageplaylistsPage implements OnInit {

  constructor(private modalController: ModalController, private storage: Storage) { }

  closeModal(){
    this.modalController.dismiss();
  }

  async ngOnInit() {
    await this.storage.create();

    this.storage.get(PLAYLIST_STORAGE_KEY).then((playlists: Playlist[]) => {
      if(playlists == null || playlists.length == 0){
        console.log('No Playlists are stored yet');
      }
    })
  }
}

const PLAYLIST_STORAGE_KEY = 'playlists';
