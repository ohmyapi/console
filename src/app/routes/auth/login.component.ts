import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../projects/api/src/public-api';
import { I18nModule } from '../../../../projects/i18n/src/public-api';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';
import { Form, ToastService } from '../../../../projects/sdk/src/public-api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [I18nModule, RouterLink, ReactiveFormsModule, NgClass],
  template: `
    <strong class="m-4">{{ 'auth:title-login' | i18n }}</strong>

    <form [formGroup]="form.group" (submit)="submit()" class="flex flex-col gap-2 w-[300px]">
      <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="form.field('email').message" [ngClass]="{'tooltip tooltip-open input-error': form.field('email').invalid}">
        <i class="material-icons-round text-gray-500">email</i>
        <input formControlName="email" type="email" name="ohmyapi-email" placeholder="{{ 'input:email-login' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
      </label>
    
      <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="form.field('password').message" [ngClass]="{'tooltip tooltip-open input-error': form.field('password').invalid}">
      <i class="material-icons-round text-gray-500">password</i>
        <input formControlName="password" type="password" name="ohmyapi-password" placeholder="{{ 'input:password-login' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
      </label>

      <button type="submit" (click)="submit()" [disabled]="form.disabled" class="btn btn-primary mt-4">
        @if(form.disabled) {
          <span class="loading loading-spinner loading-xs"></span>
        } @else {
          <span>{{ 'button:login' | i18n }}</span>
        }
      </button>
    </form>


    <div class="divider">{{ 'text:or' | i18n }}</div>

    <div dir="rtl" class="grid grid-cols-2 gap-2">
      <a routerLink="/auth/register" class="btn btn-ghost hover:text-primary">
        {{ 'link:register' | i18n }}
      </a>

      <a routerLink="/auth/forget" class="btn btn-ghost hover:text-primary">
        {{ 'link:forget' | i18n }}
      </a>
    </div>
  `,
  host: {
    class: 'flex flex-col gap-2',
  }
})
export class AuthLoginComponent {
  public form: Form = new Form({
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(private apiService: ApiService, private toastSerivce: ToastService, private userService: UserService, private router: Router) { }

  public async submit() {
    this.form.checkValidation();

    if (this.form.valid) {
      const value = this.form.value;

      this.form.disabled = true;

      try {
        const result = await this.apiService.call({
          action: 'api.v1.ohmyapi.auth.login',
          data: value
        });

        this.form.disabled = false;

        if (result['status']) {
          this.apiService.token = result.data['token'];
          this.userService.whoami();
          this.router.navigate(['/-/dashboard'], {
            replaceUrl: true
          })
        }

        this.toastSerivce.make({
          i18n: result['i18n'],
        });

      } catch (error: any) {
        if (error?.error?.i18n) {
          this.toastSerivce.make({
            i18n: error.error['i18n'],
          });
        }

        this.form.disabled = false;
      }
    }
  }
}
