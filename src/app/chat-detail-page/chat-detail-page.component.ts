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
    userPic: '#',
    text: 'Hi'
  }];

  newMessage = '';

  constructor(private chatService: ChatService, private https: HttpsService){ }

  sendMessage(){
    alert('sent!');
  }

  loadChat(): string{
    let channelName = this.chatService.getSelectedChat();
    this.chatService.subscribe(channelName, 'new-message', (message:string) => {
      this.messages.push({userPic: "IDK", text: message})
    });
    return channelName;
  }
}
