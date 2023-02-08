import { TabsComponent } from './tabs.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsRoutingModule } from './tabs-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TabsComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsRoutingModule
  ]
})
export class TabsModule { }
