import { UserProfileComponent } from './../user-profile/user-profile.component';
import { LogoutComponent } from './../logout/logout.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageComponent } from './profile-page.component';

@NgModule({
  declarations: [ProfilePageComponent, LogoutComponent, UserProfileComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProfilePageRoutingModule
  ]
})
export class ProfilePageModule { }
