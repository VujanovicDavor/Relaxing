import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-insert-mood-modal',
  templateUrl: './insert-mood-modal.page.html',
  styleUrls: ['./insert-mood-modal.page.scss'],
})
export class InsertMoodModalPage implements OnInit {

  constructor(public modalController: ModalController) { }

  dismiss(){
    this.modalController.dismiss();
    console.log("ModalDismissed");
  }

  ngOnInit() {
  }

}
