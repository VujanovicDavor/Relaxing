import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
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
  private _progressBarValue: number;
  private _timerIntervalId;
  private _timerTimeoutId;
  private _htmlElements: HTMLElement[];
  private _exerciseIndex: number;
  private _exerciseLength: number;
  private _isPlaying: boolean;
  private _totalNumberOfSeconds: number;
  private _exerciseList: ExerciseCard[];

  constructor(private storage: Storage, private modalController: ModalController, private navParams: NavParams, private alertController: AlertController) { 
    this._exercise = navParams.get('exercise');
    this._playlist = navParams.get('playlist');
    this._progressBarValue = 0;
    this._timerIntervalId = -1;
    this._timerTimeoutId = -1;
    this._exerciseIndex = 0;
    this._htmlElements = new Array();
    this._exerciseList = new Array();
    this._isPlaying = false;
    this._totalNumberOfSeconds = 0;
  }

  playExercise() {
    let seconds: number;
    let minutes: number;

    if(this._exerciseList[this._exerciseIndex].seconds == null){
      seconds = 0;
    } else {
      seconds = this._exerciseList[this._exerciseIndex].seconds;
    }

    if(this._exerciseList[this._exerciseIndex].minutes == null) {
      minutes = 0;
    } else {
      minutes = this._exerciseList[this._exerciseIndex].minutes;
    }

    this._totalNumberOfSeconds = seconds + (60 * minutes);

    if(this._isPlaying == false) {
      this._isPlaying = true;

      this._timerIntervalId = setInterval(() => {
        this._progressBarValue = this._progressBarValue + (1 / 100);

        if(this._progressBarValue >= 1) {
          clearInterval(this._timerIntervalId);
          clearTimeout(this._timerTimeoutId);
          this.nextExercise();
          console.log('ClearedInterval');
        }
      }, this._totalNumberOfSeconds * 1000 * 0.01);
  
      this._timerTimeoutId = setTimeout(() => {
        clearInterval(this._timerIntervalId);
        this.nextExercise();
        console.log('Cleared Interval');
      }, this._totalNumberOfSeconds * 1000);
    }
  }

  nextExercise() {
    if(this._exerciseIndex < this._exerciseLength - 1) {
      this._htmlElements[this._exerciseIndex].parentNode.removeChild(this._htmlElements[this._exerciseIndex]);
      const title : HTMLIonTitleElement = <HTMLIonTitleElement>document.getElementById('pauseTitle');
      title.textContent = 'Pause';
      this._progressBarValue = 0;

      let intervalId = setInterval(() => {
        this._progressBarValue = this._progressBarValue + (1 / 100);
      }, 100);

      let timeOutId = setTimeout(() => {
        clearInterval(intervalId);
        clearTimeout();

        this._exerciseIndex++;
        this.presentExercise();
        this._isPlaying = false;
        this.setHeader();
        this.playExercise();
      }, 10000);
    } else {
      this.openFinishedAlert();
    }
  }

  async openFinishedAlert() {
    const alert = await this.alertController.create({
      header: 'Great Job!',
      message: 'You have just finished this Activity. Hopefully you feel better now!',
      buttons: [{
        text: 'OK',
        role: 'cancel'
      }]
    });

    await alert.present();
  }

  pauseExercise() {
    if(this._isPlaying == true) {
      clearInterval(this._timerIntervalId);
      clearTimeout(this._timerTimeoutId);
      this._isPlaying = false;
    }
  }

  loadHTMLElements() {
    if(this._exercise == null) {
      for(let i = 0; i < this._playlist.cards.length; i++){
        this._htmlElements.push(this.loadExerciseHTMLElement(this._playlist.cards[i]));
      }
    } else {
      this._htmlElements.push(this.loadExerciseHTMLElement(this._exercise));
    }
  }

  loadExerciseHTMLElement(exercise: ExerciseCard) {

    const ionCard: HTMLIonCardElement = document.createElement('ion-card');
    const ionHeader: HTMLIonCardHeaderElement = document.createElement('ion-card-header');
    const ionContent: HTMLIonCardContentElement = document.createElement('ion-card-content');
    const img: HTMLImageElement = document.createElement('img');
    

    ionHeader.textContent = exercise.title;
    ionContent.textContent = exercise.content;

    ionCard.appendChild(ionHeader);
    ionCard.appendChild(ionContent);

    try{
      img.src = exercise.photo.webviewPath;
      ionCard.appendChild(img);
    } catch {
      if(exercise.img == null || exercise.img == ''){
        console.log('no photo');
      } else {
        img.src = exercise.img;
        ionCard.appendChild(img);
      }
    }

    ionCard.appendChild(ionContent);
    return ionCard;
  }

  setHeader() {
    const h1: HTMLElement = document.getElementById('playModalHead');
    const h2: HTMLElement = document.getElementById('playModalExerciseTitle');
    let header: string = h1.textContent;
    header = 'Exercise ' + String(this._exerciseIndex + 1) + ' of ' + String(this._exerciseLength);
    h1.textContent = header;
  }

  getExerciseLength() {
    if(this._playlist == null) {
      this._exerciseLength = 1;
      this._exerciseList.push(this._exercise);
    } else {
      this._exerciseLength = this._playlist.cards.length;
      this._exerciseList = this._playlist.cards;
    }
  }

  presentExercise(){
    const div: HTMLElement = document.getElementById('playModalExercise');
    div.appendChild(this._htmlElements[this._exerciseIndex]);
  }

  ngOnInit() {
    this.getExerciseLength();
    this.setHeader();
    this.loadHTMLElements();
    this.presentExercise();
  }

  closeModal() {
    this.modalController.dismiss(null);
  }

}
