import { Injectable } from '@angular/core';
import { environment } from './info';
import Pusher from 'pusher-js';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private currentChat = '';
  
  setSelectedChat(chat: string): void {
    this.currentChat = chat;
  }

  getSelectedChat(): string {
    return this.currentChat;
  }

  private pusher: Pusher;
  constructor() {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
    });
   }

   subscribe(channelName: string, eventName: string, callback: Function){
    const channel = this.pusher.subscribe(channelName);
    channel.bind(eventName, (data:any) => callback(data));
   }
}
