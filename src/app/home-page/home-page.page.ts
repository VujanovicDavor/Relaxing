import { Component, OnInit } from '@angular/core';
import {PickerController } from '@ionic/angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePagePage implements OnInit {

  constructor(public pickerController: PickerController) {
    this.options = [ //all mood options
      'Happy',
      'Sad',
      'Angry'
    ];
  }

<<<<<<< HEAD

=======
>>>>>>> 0208a46cce0e2de9969c763ea31eba26b9937258
  options: string[];

  dateTime: Date;
  
<<<<<<< HEAD
  getColumOptions(){ // returns the options
=======
  getColumOptions(){ //returns the options of a column
>>>>>>> 0208a46cce0e2de9969c763ea31eba26b9937258
    let returnOptions = [];
    
    for (let i = 0; i < this.options.length; i++) { //runs through options array
      returnOptions.push({
        text: this.options[i],
        value: i
      });
      }
      return returnOptions;
    }

<<<<<<< HEAD
  getColumns(){ //gets options per column (just one column)
=======
  getColumns(){ // returns the columns with options
>>>>>>> 0208a46cce0e2de9969c763ea31eba26b9937258
    let columns = [];

    columns.push({
      name: 'col-0',
      options: this.getColumOptions()
    });

    return columns;
  }


<<<<<<< HEAD
  async openPicker(){ //picker round with controller
=======
  async openPicker(){ //opens or creates the picker with the options
>>>>>>> 0208a46cce0e2de9969c763ea31eba26b9937258
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
    

<<<<<<< HEAD
    await picker.present(); //presents and opens picker
=======
    //checking here if mood is already inserted!!
    //else dont present the picker
    await picker.present(); //presents the picker
    console.log(this.dateTime = new Date());
>>>>>>> 0208a46cce0e2de9969c763ea31eba26b9937258
  }

  ngOnInit() {
  }

}