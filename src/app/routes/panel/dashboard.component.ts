import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nModule } from '../../../../projects/i18n/src/public-api';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, I18nModule],
  template: `
    <section class="grid sm:grid-cols-2 sm:grid-rows-2 gap-4 w-full">
      <a routerLink="/-/profile" class="flex flex-col justify-end gap-2 p-10 sm:col-span-2 rounded-2xl bg-gradient-to-tl from-purple-700 to-purple-500 text-white relative group transition-all hover:shadow-xl">
        <i class="material-icons-round absolute top-6 left-6 transition-all group-hover:top-4 group-hover:left-4">north_west</i>

        <span class="text-xl opacity-60">{{ 'card:title-welcome' | i18n }}</span>
        <strong class="text-3xl">{{ 'card:subtitle-welcome' | i18n: { 'nickname': userService.profile!.nickname } }}</strong>
      </a>

      <a routerLink="/-/wallet" class="flex flex-col justify-end gap-2 p-6 rounded-2xl bg-gradient-to-tl from-amber-700 to-amber-500 text-white relative group transition-all hover:shadow-xl">
        <i class="material-icons-round absolute top-6 left-6 transition-all group-hover:scale-125">add</i>

        <span class="text-xl opacity-60">{{ 'card:title-wallet' | i18n }}</span>
        <div class="flex flex-nowrap items-center gap-2">
          <strong class="text-3xl">{{ userService.wallet?.balance ?? 0 }}</strong>
          <span>{{ 'text:ohmycoin' | i18n }}</span>
        </div>
      </a>
      
      <a routerLink="/-/token" class="sm:row-start-2 sm:col-start-2 flex flex-col justify-end gap-2 p-6 rounded-2xl bg-gradient-to-tl from-green-700 to-green-500 text-white relative group transition-all hover:shadow-xl">
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
  }
})
export class DashboardComponent {
  constructor(public userService: UserService) { }
}
