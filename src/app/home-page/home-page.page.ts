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

  Interface

  options: string[];
  
  getColumOptions(){
    let returnOptions = [];
    
    for (let i = 0; i < this.options.length; i++) {
      returnOptions.push({
        text: this.options[i],
        value: i
      });
      }
      return returnOptions;
    }

  getColumns(){
    let columns = [];

    columns.push({
      name: 'col-0',
      options: this.getColumOptions()
    });

    return columns;
  }


  async openPicker(){
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

    await picker.present();
  }

  ngOnInit() {
  }

}