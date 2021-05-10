import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Playlist } from 'src/models/playlist';
import { PopoverController } from '@ionic/angular';
import { PlaylistpopoverPage } from './playlistpopover/playlistpopover.page';

@Component({
  selector: 'app-manageplaylists',
  templateUrl: './manageplaylists.page.html',
  styleUrls: ['./manageplaylists.page.scss'],
})
export class ManageplaylistsPage implements OnInit {

  constructor(private modalController: ModalController, private storage: Storage, private popoverController: PopoverController) { }

  closeModal(){
    this.modalController.dismiss();
  }

  async ngOnInit() {
    await this.storage.create();

    this.storage.get(PLAYLIST_STORAGE_KEY).then((playlists: Playlist[]) => {
      if(playlists == null || playlists.length == 0){
        console.log('No Playlists are stored yet');
      }
    });
  }

  async openPlaylistPopover(title: string){
    if(title == null){
      title = 'New Playlist';
    }

    const popover = await this.popoverController.create({
      component: PlaylistpopoverPage,
      componentProps: {'title': title},
      translucent: true,
    });

    await popover.present();
    //const {role} = await popover.onDidDismiss();
  }
}

const PLAYLIST_STORAGE_KEY = 'playlists';
