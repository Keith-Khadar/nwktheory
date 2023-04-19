import { ChatPageComponent } from './chat-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatDetailPageComponent } from '../chat-detail-page/chat-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: ChatPageComponent,
  },
  {
    path: 'Chat/details/:channelName',
    component: ChatDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatPageRoutingModule { }
