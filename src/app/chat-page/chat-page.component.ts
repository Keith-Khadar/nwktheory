import { OverlayEventDetail } from '@ionic/core/components';
import { Component, ViewChild } from '@angular/core';
import { HttpsService } from '../services/https.service';

import { IonModal } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  recipients: string = "";

@ViewChild(IonModal) modal!: IonModal;

  messages: string[] = [];
  channels: string[] = ["Test 1", "Test 2", "Joe Biden"];
  newChannel: string = "";

  public currentChannel = '';

  constructor(private https: HttpsService, private chatService: ChatService) {
    this.https.getUser(false).subscribe((user) => {
      //this.channels = user.Channels;
      console.log(user.Channels);
    });
  }

  cancel(){
    this.modal.dismiss(null, 'cancel');
  }
  confirm(){
    this.modal.dismiss(this.recipients, 'confirm');
  }
  onWillDismiss(event: Event){
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if(ev.detail.role === 'confirm'){
      this.newChannel = `${ev.detail.data}`
    }
  }

  setCurrentChat(current:string){
    this.chatService.setSelectedChat(current);
  }

 
}
