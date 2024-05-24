import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nModule } from '../../../../projects/i18n/src/public-api';
import { AppService } from '../../../../projects/sdk/src/lib/app.service';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, I18nModule, NgOptimizedImage, AsyncPipe],
  template: `
    <section class="grid sm:grid-cols-2 gap-4 w-full">
      @if(appService.onUpdateAvailable | async) {
        <div class="flex flex-nowrap items-center gap-8 p-4 sm:col-span-2 rounded-2xl bg-gradient-to-l from-red-600 to-red-400 text-white">
          <img ngSrc="/assets/images/confetti.png" alt="confetti icon image" width="85" height="85" class="relative -mt-12 -ms-12 hidden sm:block"/>
          
          <strong class="flex-1">{{ 'text:update-available' | i18n }}</strong>
          
          <button (click)="appService.update()" class="btn btn-sm btn-outline border-white/50 text-white hover:bg-red-600 hover:border-red-600">
            {{ 'button:update' | i18n }}
          </button>
        </div>
      }

      <a routerLink="/-/profile" class="flex flex-col justify-end gap-2 p-10 sm:col-span-2 rounded-2xl bg-gradient-to-tl from-purple-700 to-purple-500 text-white relative group transition-all hover:shadow-xl">
        <i class="material-icons-round absolute top-6 left-6 transition-all group-hover:top-4 group-hover:left-4">north_west</i>

        <span class="text-xl opacity-60">{{ 'card:title-welcome' | i18n }}</span>
        <strong class="text-3xl">{{ 'card:subtitle-welcome' | i18n: { 'nickname': userService.profile!.nickname } }}</strong>
      </a>

      <a href="https://docs.ohmyapi.com" class="flex flex-nowrap items-center justify-between gap-2 ps-10 pe-7 py-5 sm:col-span-2 rounded-2xl bg-gradient-to-tl from-sky-700 to-sky-500 text-white relative group overflow-hidden transition-all hover:shadow-xl">
        <strong class="text-2xl">{{ 'card:documention' | i18n }}</strong>

        <i class="material-icons-round transition-all flip">launch</i>
      </a>

      <a routerLink="/-/wallet" class="flex flex-col justify-end gap-2 p-6 rounded-2xl bg-gradient-to-tl from-amber-700 to-amber-500 text-white relative group transition-all hover:shadow-xl">
        <i class="material-icons-round absolute top-6 left-6 transition-all group-hover:scale-125">add</i>

        <span class="text-xl opacity-60">{{ 'card:title-wallet' | i18n }}</span>
        <div class="flex flex-nowrap items-center gap-2">
          <strong class="text-3xl">{{ userService.wallet?.balance ?? 0 }}</strong>
          <span>{{ 'text:ohmycoin' | i18n }}</span>
        </div>
      </a>
      
      <a routerLink="/-/token" class="flex flex-col justify-end gap-2 p-6 rounded-2xl bg-gradient-to-tl from-green-700 to-green-500 text-white relative group transition-all hover:shadow-xl">
        <i class="material-icons-round absolute top-6 left-6 transition-all group-hover:top-4 group-hover:left-4">north_west</i>

        <span class="text-xl opacity-60">{{ 'card:title-tokens' | i18n }}</span>
        <div class="flex flex-nowrap items-center gap-2">
          <strong class="text-3xl">{{ userService.tokens }}</strong>
          <span>{{ 'text:token' | i18n }}</span>
        </div>
      </a>
    </section>
  `,
  host: {
    class: 'flex flex-col w-full sm:w-128 px-4 sm:p-0 mx-auto'
  },
  styles: `
    img {
      animation: confetti 10s;
      transform-origin: bottom left;
    }

    @keyframes confetti {
      0% {
        transform: scale(0) rotate(0deg)
      }

      5%,
      100% {
        transform: scale(1) rotate(0deg)
      }
      
      10%,
      30%,
      50%,
      70%,
      90% {
        transform: scale(1) rotate(-4deg)
      }
      
      20%,
      40%,
      60%,
      80% {
        transform: scale(1) rotate(4deg)
      }
    }
  `,
})
export class DashboardComponent {
  constructor(public userService: UserService, public appService: AppService) { }
}
