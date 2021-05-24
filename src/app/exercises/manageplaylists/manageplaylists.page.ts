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
        //const toolbar: HTMLIonTitleElement = <HTMLIonTitleElement> document.getElementById('stored_playlists_title');
        //toolbar.style.display = 'none';
      } else {
        for(let i = 0; i < playlists.length; i++){
          this.loadPlaylist(playlists[i]);
        }
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

    popover.onDidDismiss().then((data) => {
      return data.data;
    }).then((data: Playlist) => {
        if(data != null){
          this.loadPlaylist(data);
        }
    });
  }

  private loadPlaylist(playlist: Playlist){
    //const title: HTMLIonTitleElement = <HTMLIonTitleElement> document.getElementById('stored_playlists_title');
    //title.style.display = 'block';

    if(playlist == null){
      return;
    }

    console.log(playlist);

    const div: HTMLDivElement = <HTMLDivElement> document.getElementById('playlist_cards');
    const card: HTMLIonCardElement = document.createElement('ion-card');
    const cardHeader: HTMLIonCardHeaderElement = document.createElement('ion-card-header');
    const cardTitle: HTMLIonCardTitleElement = document.createElement('ion-card-title');
    const cardContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const label: HTMLIonLabelElement = document.createElement('ion-label');
    const labelItem: HTMLIonItemElement = document.createElement('ion-item');
    const editIcon: HTMLIonIconElement = document.createElement('ion-icon');
    const trashIcon: HTMLIonIconElement = document.createElement('ion-icon');

    editIcon.name = 'create-outline';
    editIcon.slot = 'start';
    trashIcon.slot = 'end';
    trashIcon.name = 'trash';
    label.textContent = 'Exercises:';
    labelItem.appendChild(label);
    cardTitle.textContent = String(playlist.name);
    cardContent.textContent = String(playlist.description);

    cardTitle.appendChild(editIcon);
    cardTitle.appendChild(trashIcon);
    cardHeader.appendChild(cardTitle);
    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    card.appendChild(labelItem);

    for(let i = 0; i < playlist.cards.length; i++){
      const item: HTMLIonItemElement = document.createElement('ion-item');
      const label: HTMLIonLabelElement = document.createElement('ion-label');
      const h3: HTMLElement = document.createElement('h3');
      const icon: HTMLIonIconElement = document.createElement('ion-icon');
      icon.name = 'radio-button-on-outline';
      icon.slot = "start";

      h3.textContent = playlist.cards[i].title;
      label.appendChild(h3);
      item.appendChild(icon);
      item.appendChild(label);

      card.appendChild(item);
    }

    div.appendChild(card);
  }
}

const PLAYLIST_STORAGE_KEY = 'playlists';
