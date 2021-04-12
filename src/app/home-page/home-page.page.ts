import { Component, OnInit } from '@angular/core';
import {PickerController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  constructor(public pickerController: PickerController, public storage: Storage) {
    this.options = [ //all mood options
      'Happy',
      'Sad',
      'Angry'
    ];
  }

  options: string[];

  dateTime: Number;
  
  getColumOptions(){ //returns the options of a column
    let returnOptions = [];
    
    for (let i = 0; i < this.options.length; i++) {
      returnOptions.push({
        text: this.options[i],
        value: i
      });
      }
      return returnOptions;
    }

  getColumns(){ // returns the columns with options
    let columns = [];

    columns.push({
      name: 'col-0',
      options: this.getColumOptions()
    });

    return columns;
  }


  async openPicker(){ //opens or creates the picker with the options
    const picker = await this.pickerController.create({
      columns: this.getColumns(),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Confirm',
        handler: (value) => {
          console.log('Value: ${0}', value);
        }
      }]
    })
    

    //checking here if mood is already inserted!!
    //else dont present the picker
    await picker.present(); //presents the picker
    console.log(this.dateTime = new Date().getTime());
  }

  async ngOnInit() {
    await this.storage.create();
  }

}