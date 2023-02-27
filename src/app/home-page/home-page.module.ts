import { UsersModule } from './../users/users.module';
import { GraphComponent } from './../graph/graph.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageComponent } from './home-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';

// Https Services
import { ConfigModule } from '../config/config.module';


@NgModule({
  declarations: [HomePageComponent, GraphComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    ConfigModule,
    UsersModule
  ]
})
export class HomePageModule { }
