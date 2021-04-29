import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-mood-explanation-popover',
  templateUrl: './mood-explanation-popover.page.html',
  styleUrls: ['./mood-explanation-popover.page.scss'],
})
export class MoodExplanationPopoverPage implements OnInit {

  constructor(public popoverController: PopoverController) { }  


  ngOnInit() {
  }

}
