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
  
  getColumOptions(i){
    let options = [];
    
  
  }

  getColumns(){
    let columns = [];

    for(let i = 0; i < this.options.length; i++){
      columns.push({
        name: 'col-${i}',
        options: this.options[i]
      })
    }

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
          console.log('Value: ${value}');
        }
      }]
    })

    await picker.present();
  }

  ngOnInit() {
  }

}