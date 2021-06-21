import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ExerciseCard } from 'src/models/exercise.card';
import { Playlist } from 'src/models/playlist';

@Component({
  selector: 'app-play-modal',
  templateUrl: './play-modal.page.html',
  styleUrls: ['./play-modal.page.scss'],
})
export class PlayModalPage implements OnInit {
  private _playlist: Playlist; 
  private _exercise: ExerciseCard;
  private _progressValue: number;

  constructor(private storage: Storage, private modalController: ModalController, private navParams: NavParams) { 
    this._playlist = navParams.get('exercise');
    this._playlist = navParams.get('playlist');
    this._progressValue = 0;
  }

  async updateProgressBar(){
    await(1000);

    for(let i = 0; i < 100; i++){
      await(100);
      this._progressValue = this._progressValue + (1 / 100); 
    }
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss(null);
  }

}
