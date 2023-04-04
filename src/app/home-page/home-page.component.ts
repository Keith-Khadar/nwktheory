import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @ViewChild(IonModal) modal: IonModal = {} as IonModal;

  constructor(private account: AccountService) {
    this.account.getUserData().subscribe((userData) => {this.userEmail = userData.Email})
  }

  message = "";
  destinationEmail: string = "";
  userEmail: string = "";

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    const res = await fetch(`https://nwk.tehe.xyz:3000/users/${this.userEmail}/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "from": this.userEmail,
        "to": this.destinationEmail
      })
    })
    if(res.status === 200) {
      alert("Connection added successfully!")
      this.modal.dismiss(this.destinationEmail, 'confirm');
      window.location.reload();
    } else {
      alert("Something went wrong. Please try again.")
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `${ev.detail.data}`;
    }
  }
}
