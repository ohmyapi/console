import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelLayoutComponent } from '../../layout/panel.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile.component';
import { TokenComponent } from './token.component';
import { WalletComponent } from './wallet.component';
import { WalletCallbackComponent } from './wallet-callback.component';



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PanelLayoutComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent
          },
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: 'wallet',
            component: WalletComponent
          },
          {
            path: 'wallet/callback',
            component: WalletCallbackComponent
          },
          {
            path: 'token',
            component: TokenComponent
          },
          {
            path: '**',
            redirectTo: '/-/dashboard'
          }
        ]
      }
    ]),
  ]
})
export class PanelModule { }
