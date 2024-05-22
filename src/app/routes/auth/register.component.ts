import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { I18nModule } from '../../../../projects/i18n/src/public-api';
import { Form, ToastService } from '../../../../projects/sdk/src/public-api';
import { ApiService } from '../../../../projects/api/src/public-api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [I18nModule, RouterLink, ReactiveFormsModule, NgClass],
  template: `
    <strong class="m-4">{{ 'auth:title-register' | i18n }}</strong>

    <form [formGroup]="form.group" class="flex flex-col gap-2 w-[300px]">
      <label class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="form.field('nickname').message" [ngClass]="{'tooltip tooltip-open input-error': form.field('nickname').invalid}">
        <input formControlName="nickname" type="text" name="ohmyapi-nickname" placeholder="{{ 'input:nickname' | i18n }}" class="grow placeholder:text-gray-500"/>
      </label>

      <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="form.field('email').message" [ngClass]="{'tooltip tooltip-open input-error': form.field('email').invalid}">
        <i class="material-icons-round text-gray-500">email</i>
        <input formControlName="email" type="email" name="ohmyapi-email" placeholder="{{ 'input:email-register' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
      </label>
    
      <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="form.field('password').message" [ngClass]="{'tooltip tooltip-open input-error': form.field('password').invalid}">
        <i class="material-icons-round text-gray-500">password</i>
        <input formControlName="password" type="password" name="ohmyapi-password" placeholder="{{ 'input:password-register' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
      </label>
    </form>

    <button (click)="submit()" [disabled]="form.disabled" class="btn btn-primary mt-4">
      @if(form.disabled) {
        <span class="loading loading-spinner loading-xs"></span>
      } @else {
        <span>{{ 'button:register' | i18n }}</span>
      }
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
export class AuthRegisterComponent {
  public form: Form = new Form({
    'nickname': new FormControl('', [Validators.required, Validators.min(3)]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(private apiService: ApiService, private toastSerivce: ToastService, private router: Router) { }

  public async submit() {
    this.form.checkValidation();

    if (this.form.valid) {
      const value = this.form.value;

      this.form.disabled = true;

      try {
        const result = await this.apiService.call({
          action: 'api.v1.ohmyapi.auth.register',
          data: value
        });

        this.form.disabled = false;

        if (result['status']) {
          this.router.navigate(['/auth/login']);
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
