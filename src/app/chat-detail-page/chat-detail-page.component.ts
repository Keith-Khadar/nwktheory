import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { HttpsService } from '../services/https.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-detail-page',
  templateUrl: './chat-detail-page.component.html',
  styleUrls: ['./chat-detail-page.component.scss']
})
export class ChatDetailPageComponent implements OnInit {
  GroupName = ''
  messages: string[] = [];

  newMessage = '';
  channelName = '';

  recipients: string[] = [];

  constructor(private chatService: ChatService, private https: HttpsService, private router: Router){ 
    if(this.chatService.getSelectedChat() == ''){
      router.navigate(['/Chat'])
    }
  }

  sendMessage(){
    this.https.sendMessage(this.chatService.getSelectedChat(),this.newMessage);
    this.newMessage = '';
  }

  ngOnInit(){
    this.channelName = this.chatService.getSelectedChat();
    this.chatService.subscribe(this.channelName, 'new-message', (message:string) => {
      this.messages.push(message);
    });
    this.https.getChannel(this.channelName).subscribe((names) => {
      this.recipients = names;
    });
  }
}
