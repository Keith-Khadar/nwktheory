import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { HttpsService } from '../services/https.service';
import { ModalController } from '@ionic/angular';

import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  messages: string[] = [];
  channel: string = "Joe-Biden";
  message: string = "is gaming";

  constructor(private chatService: ChatService, private https: HttpsService, private modalController: ModalController) {
    this.chatService.subscribe('messages', 'new-message', (message: string) => {
      this.messages.push(message);
    })
  }

  submit():void {
    this.https.sendMessage(this.channel, this.message);
    this.message = '';
  }

  async openCreateChat(){
    const modal = await this.modalController.create({
      component: 'div',
      cssClass: 'my-custom-class',
      backdropDismiss: true,
      componentProps: {
        'title': 'Create Group Chat',
        'options': [
          {label: 'Friends', value: 'friends'},
          {label: 'Family', value: 'family'},
          {label: 'Co-Workers', value: 'coworkers'}
        ]
      }
    });
    return await modal.present()
  }

  async closeCreateChat(){
    await this.modalController.dismiss();
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `${ev.detail.data}`;
    }
  }
}
