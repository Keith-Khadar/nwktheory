import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { HttpsService } from '../services/https.service';

@Component({
  selector: 'app-chat-detail-page',
  templateUrl: './chat-detail-page.component.html',
  styleUrls: ['./chat-detail-page.component.scss']
})
export class ChatDetailPageComponent {
  GroupName = ''
  messages = [{
    user: 'Jesus',
    text: 'Hi'
  }];

  newMessage = '';

  constructor(public chatService: ChatService, private https: HttpsService){
    this.chatService.subscribe('messages', 'new-message', (message:string) => {
    this.messages.push({user: "IDK", text: message})
  });
  }

  sendMessage(){
    alert('sent!');
  }
}
