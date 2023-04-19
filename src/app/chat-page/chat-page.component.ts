import { OverlayEventDetail } from '@ionic/core/components';
import { Component, ViewChild } from '@angular/core';
import { HttpsService } from '../services/https.service';

import { IonModal } from '@ionic/angular';
import { ChatService } from '../services/chat.service';

import { Connection } from '../services/info';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  recipients: string [] = [];

@ViewChild(IonModal) modal!: IonModal;

  messages: string[] = [];
  
  channels: string[] = [];
  channelNames: string[] = [];

  newChannel: string = "";

  public connections: string[] = [];

  public currentChannel = '';

  constructor(private https: HttpsService, private chatService: ChatService) {
    this.https.getUser(false).subscribe((user) => {
      this.channels = user.Channels;
      user.Connections.forEach((connection: Connection) => {
        this.connections.push(connection.to);
      });
      console.log(user.Channels);
      user.Channels.forEach((id) => {
        this.https.getChannel(id).subscribe((names) => {
          this.channelNames.push(names.toString());
        })
      })
    });
  }

  cancel(){
    this.modal.dismiss(null, 'cancel');
  }
  confirm(){
    this.modal.dismiss(this.recipients, 'confirm');
    this.https.createChannel(this.recipients);
    location.reload();
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

  handleChange(ev: any) {
    this.recipients = ev.target.value;
    console.log(this.recipients);
  }

 
}
