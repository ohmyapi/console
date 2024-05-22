import { Location, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../../projects/sdk/src/lib/user.service';
import { I18nModule } from '../../../projects/i18n/src/public-api';
import { AppService } from '../../../projects/sdk/src/lib/app.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgOptimizedImage, I18nModule],
  template: `
    <header class="flex flex-nowrap items-center w-full sm:w-128 min-h-16 sm:min-h-32 px-4 sm:p-0 mx-auto mb-10 relative">
      @if(backable && userService.profile) {
        <a routerLink="/-/dashboard" [replaceUrl]="true" class="btn btn-sm btn-ghost">
          <i class="material-icons-round">arrow_forward</i>
          <span> {{ 'text:back' | i18n }} </span>
        </a>
      }

      <div class="flex-1"></div>
      
      <a routerLink="/-/dashboard" class="absolute left-1/2 -translate-x-1/2 scale-50 sm:scale-100">
        <img ngSrc="/assets/icons/icon-384x384.png" alt="ohmyapi logo" width="128" height="128" priority class="" />
      </a>

      <div class="flex-1"></div>
    </header>

    @if(userService.profile) {
      <router-outlet />
    } @else {
      <div class="flex flex-col items-center justify-center gap-10 sm:w-128 h-128 mx-auto">
        <span class="loading loading-ball loading-lg"></span>
        <span>{{ 'text:logining' | i18n }}</span>
      </div>
    }
    
  `,
  host: {
    class: 'flex flex-col w-full h-full'
  }
})
export class PanelLayoutComponent {

  public get backable(): boolean {
    return window.location.pathname != '/-/dashboard' && window.location.pathname != '/-/wallet/callback';
  }

  constructor(
    public userService: UserService,
    public appService: AppService,
    private location: Location
  ) { }

  public back() {
    this.location.back();
  }
}
