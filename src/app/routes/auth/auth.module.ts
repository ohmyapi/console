import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../../layout/auth.component';
import { AuthLoginComponent } from './login.component';
import { AuthRegisterComponent } from './register.component';
import { AuthForgetComponent } from './forget.component';


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: 'login',
            component: AuthLoginComponent
          },
          {
            path: 'register',
            component: AuthRegisterComponent
          },
          {
            path: 'forget',
            component: AuthForgetComponent
          },
          {
            path: '**',
            redirectTo: '/auth/login'
          }
        ]
      }
    ]),
  ]
})
export class AuthModule { }
