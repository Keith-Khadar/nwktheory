import { UsersModule } from './../users/users.module';
import { ChatPageComponent } from './chat-page.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatPageRoutingModule } from './chat-page-routing.module';
// Https Services
import { ConfigModule } from '../config/config.module';


@NgModule({
  declarations: [ChatPageComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChatPageRoutingModule,
    ConfigModule,
    UsersModule
  ]
})
export class ChatPageModule { }
