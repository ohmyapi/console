import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nModule } from '../../../../projects/i18n/src/public-api';

@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [I18nModule, RouterLink],
  template: `
    <strong class="m-4">{{ 'auth:title-forget' | i18n }}</strong>

    <form class="flex flex-col gap-2 w-[300px]">
      <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2">
        <i class="material-icons-round text-gray-500">password</i>
        <input type="email" name="ohmyapi-email" placeholder="{{ 'input:email-forget' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
      </label>
    </form>

    <button class="btn btn-primary mt-4">
      <span>{{ 'button:forget' | i18n }}</span>
    </button>

    <div class="divider">{{ 'text:or' | i18n }}</div>

    <div dir="rtl" class="grid grid-cols-1 gap-2">
      <a routerLink="/auth/login" class="btn btn-ghost hover:text-primary">
        {{ 'link:login' | i18n }}
      </a>
    </div>
  `,
  host: {
    class: 'flex flex-col gap-2',
  }
})
export class AuthForgetComponent {

}
