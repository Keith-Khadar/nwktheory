import { TabsComponent } from './tabs.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'Profile',
        loadChildren: () => import("../profile-page/profile-page.module").then(m => m.ProfilePageModule)
      },
      {
        path: 'Home',
        loadChildren: () => import("../home-page/home-page.module").then(m => m.HomePageModule)
      },
      {
        path: 'Chat',
        loadChildren: () => import("../chat-page/chat-page.module").then(m => m.ChatPageModule)
      },
      {
        path: '',
        redirectTo: '/Home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/Home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsRoutingModule { }
