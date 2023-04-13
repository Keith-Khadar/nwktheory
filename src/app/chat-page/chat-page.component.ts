import { Component } from '@angular/core';
import { HttpsService } from '../services/https.service';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
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


 
}
