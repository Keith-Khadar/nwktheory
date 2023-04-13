import { OverlayEventDetail } from '@ionic/core/components';
import { Component, ViewChild } from '@angular/core';
import { HttpsService } from '../services/https.service';

import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
@ViewChild(IonModal) modal!: IonModal;


  messages: string[] = [];
  channels: string[] = [];
  message: string = "is gaming";

  constructor(private https: HttpsService) {
    this.https.getUser(false).subscribe((user) => {
      this.channels = user.Channels;
      console.log(user.Channels);
    });
    this.https.createChannel("test2", ["stalkurmom@gmail.com"] );
  }

  cancel(){
    this.modal.dismiss(null, 'cancel');
  }
  confirm(){
    this.modal.dismiss(null, 'confirm');
  }
  onWillDismiss(event: Event){
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if(ev.detail.role === 'confirm'){
      this.message = `Hello, ${ev.detail.data}!`
    }
  }

 
}
