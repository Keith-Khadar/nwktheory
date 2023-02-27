import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [UsersComponent]
})
export class UsersModule { }
