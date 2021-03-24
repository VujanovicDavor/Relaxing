import { Component, OnInit } from '@angular/core';
import { ActionSheetController, PickerController } from '@ionic/angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  constructor(public pickerController: PickerController) {
    this.options = [
      'Happy',
      'Sad',
      'Angry'
    ];
  }


  options: string[];
  
  getColumOptions(){ // returns the options
    let returnOptions = [];
    
    for (let i = 0; i < this.options.length; i++) { //runs through options array
      returnOptions.push({
        text: this.options[i],
        value: i
      });
      }
      return returnOptions;
    }

  getColumns(){ //gets options per column (just one column)
    let columns = [];

    columns.push({
      name: 'col-0',
      options: this.getColumOptions()
    });

    return columns;
  }


  async openPicker(){ //picker round with controller
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

    await picker.present(); //presents and opens picker
  }

  ngOnInit() {
  }

}