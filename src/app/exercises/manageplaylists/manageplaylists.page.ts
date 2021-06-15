import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Playlist } from 'src/models/playlist';
import { PopoverController, AlertController } from '@ionic/angular';
import { CreatePlaylistPage } from './createPlaylist/createPlaylist';
import { PLAYLIST_KEY } from 'src/models/keys';
import { STRING_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-manageplaylists',
  templateUrl: './manageplaylists.page.html',
  styleUrls: ['./manageplaylists.page.scss'],
})
export class ManageplaylistsPage implements OnInit {

  constructor(private alertController: AlertController, private modalController: ModalController, private storage: Storage, private popoverController: PopoverController) { }

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

  async openPlaylistPopover(playlist: Playlist){
    if(playlist == null){
      playlist = new Playlist();
      playlist.name = 'New Playlist';
    }

    const popover = await this.popoverController.create({
      component: CreatePlaylistPage,
      componentProps: {'playlist': playlist},
      translucent: true,
    });

    await popover.present();

    popover.onDidDismiss().then((data) => {
      return data.data;
    }).then((data: Playlist) => {
        if(data != null){
          const card: HTMLIonCardElement = <HTMLIonCardElement> document.getElementById(CARD_ID + data.id);

          if(card == null){
            this.loadPlaylist(data);
          } else {
            this.removePlaylistFromHTML(data.id);
            this.loadPlaylist(data);  
          }
        }
    });
  }

  private removePlaylistFromHTML(playlistId: String){
    const card: HTMLIonCardElement = <HTMLIonCardElement> document.getElementById(CARD_ID + String(playlistId));
    console.log(CARD_ID + playlistId);
    card.parentNode.removeChild(card);
  }

  async openOptionsAlert(playlistId: Number){
    console.log(playlistId + 'in optAlert')

    const optAlert = await this.alertController.create({
      header: 'Select:',
      message: 'Do you want to edit or delete your Playlist',
      buttons: [{
        text: 'Edit',
        handler: () => {
          let editPlaylist: Playlist = new Playlist();

          this.storage.get(PLAYLIST_KEY).then((data: Playlist[]) => {
            for(let i = 0; i < data.length; i++){
              if(playlistId == Number(data[i].id)){
                return data[i]; 
              }
            }
          }).then(async (editPlaylist: Playlist) => {
            this.openPlaylistPopover(editPlaylist);
            console.log('FINISHED');
          });
        }
      },{
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.removePlaylistFromHTML(String(playlistId));
          
          this.storage.get(PLAYLIST_KEY).then((data: Playlist[]) => {
            if(data != null){
              for(let i = 0; i < data.length; i++){
                if(data[i].id == String(playlistId)){
                  data.splice(i, 1);
                }
              }
              this.storage.set(PLAYLIST_KEY, data);
            }
          })
        }
      }
    ]
    });

    await optAlert.present();
    const { role } = await optAlert.onDidDismiss();
    console.log(role);
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
    const cardContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const label: HTMLIonLabelElement = document.createElement('ion-label');
    const labelItem: HTMLIonItemElement = document.createElement('ion-item');
    const optionButton: HTMLIonButtonElement = document.createElement('ion-button');
    const optionIcon: HTMLIonIconElement = document.createElement('ion-icon');
    const headItem: HTMLIonItemElement = document.createElement('ion-item');
    const headTitle: HTMLIonLabelElement = document.createElement('ion-label');
    const hTitle: HTMLElement = document.createElement('h2');

    card.id = CARD_ID + String(playlist.id);
    console.log(card.id);
    console.log(playlist.id);

    optionIcon.name = 'ellipsis-vertical-outline';
    optionButton.appendChild(optionIcon);
    optionButton.slot = 'end';
    optionButton.addEventListener('click', (e: Event) => this.openOptionsAlert(Number(playlist.id)));

    hTitle.textContent = String(playlist.name);
    headTitle.appendChild(hTitle);
    headItem.appendChild(headTitle);
    headItem.appendChild(optionButton);

    cardHeader.appendChild(headItem);

    label.textContent = 'Exercises:';
    labelItem.appendChild(label);
    cardContent.textContent = String(playlist.description);

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
const CARD_ID = 'playlist_card_';