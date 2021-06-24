import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MoodExplanationPopoverPage } from './mood-explanation-popover/mood-explanation-popover.page';
import { Mood } from '../../models/mood';

@Component({
  selector: 'app-insert-mood-modal',
  templateUrl: './insert-mood-modal.page.html',
  styleUrls: ['./insert-mood-modal.page.scss'],
})
export class InsertMoodModalPage implements OnInit {

  relaxLevel: any = 0;
  productivityLevel: any = 0;
  satisfactionLevel: any = 0;
   
  constructor(public modalController: ModalController, public popoverController: PopoverController) { }

  async showPopover(event: Event){ // show the popover of the explanation of the input
    const popover = await this.popoverController.create({
      component: MoodExplanationPopoverPage,
      event: event,
      translucent: true
    });

    await popover.present();

    const {role} = await popover.onDidDismiss();
    console.log(role);  
  }

  closeModal(){ //closes the modal if the user presses cancel
    this.modalController.dismiss();
  }

  submitModal(){ //submits the data to the parent modal page (home-page)
    const mood: Mood = new Mood();
    mood.productivityLevel = this.productivityLevel;
    mood.relaxLevel = this.relaxLevel;
    mood.satisfactionLevel = this.satisfactionLevel;
    mood.dateTime = new Date();
    this.modalController.dismiss(mood);
  }

  getRelaxationLevel(relaxLevel){ 
    this.relaxLevel = relaxLevel;
  }

  getProductivityLevel(productivityLevel){
    this.productivityLevel = productivityLevel;
  }

  getSatisfactionLevel(satisfactionLevel){
    this.satisfactionLevel = satisfactionLevel;
  }

  

  async ngOnInit() {
  }

}
