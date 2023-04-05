import { Component, ViewChild } from '@angular/core';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

// Custom Services
import { HttpsService } from '../services/https.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @ViewChild(IonModal) modal: IonModal = {} as IonModal;

  constructor(private https: HttpsService) { }

  message = "";

  // This is gathered from the html form
  destinationEmail: string = "";

  // Model functions //
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    // Send an http post request to add a connection to the destination email
    this.https.addConnection(this.destinationEmail).subscribe((successful) =>{
      // If we get a dont get an error 
      if(successful){
        alert("Connection added successfully!")
        this.modal.dismiss(this.destinationEmail, 'confirm');
        window.location.reload();
      } // If we do
      else{
        alert("Something went wrong. Please try again.")
      }
    })
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `${ev.detail.data}`;
    }
  }
}
