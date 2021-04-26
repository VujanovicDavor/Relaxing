import { HtmlAstPath } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-insert-mood-modal',
  templateUrl: './insert-mood-modal.page.html',
  styleUrls: ['./insert-mood-modal.page.scss'],
})
export class InsertMoodModalPage implements OnInit {

  relaxLevel: any = 0;
  productivityLevel: any = 0;
   
  constructor(public modalController: ModalController) { }

  closeModal(){ //closes the modal if the user presses cancel
    this.modalController.dismiss();
  }

  submitModal(){ //submits the data to the parent modal page (home-page)
    this.modalController.dismiss({'relaxLevel': this.relaxLevel, 'productivityLevel': this.productivityLevel});
  }

  getRelaxationLevel(relaxLevel){ //Methods to receive data from the ranges
    this.relaxLevel = relaxLevel;
  }

  getProductivityLevel(productivityLevel){
    this.productivityLevel = productivityLevel;
  }

  ngOnInit() {
  }

}