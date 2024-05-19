import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../projects/api/src/public-api';
import { I18nModule } from '../../../../projects/i18n/src/public-api';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';
import { Form, ToastService } from '../../../../projects/sdk/src/public-api';
import { AppService } from '../../../../projects/sdk/src/lib/app.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, I18nModule, NgClass],
  template: `
    <div role="tablist" class="tabs tabs-lifted sm:shadow-2xl sm:rounded-box sm:bg-base-100/20 sm:w-128">
      <input type="radio" name="tabs" role="tab" class="tab !w-28" [attr.aria-label]="'tab:profile' | i18n" checked />

      <div role="tabpanel" class="tab-content bg-base-100 sm:border-base-300 sm:rounded-box p-6 sm:w-128">
        <form [formGroup]="profile.group" class="flex flex-col gap-2 w-full">
          <div class="form-control">
            <label class="label">
            <span class="label-text">{{ 'label:firstname' | i18n }}</span>
            </label>

            <label class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="profile.field('firstname').message" [ngClass]="{'tooltip tooltip-open input-error': profile.field('firstname').invalid}">
              <input formControlName="firstname" type="text" name="ohmyapi-firstname" placeholder="{{ 'input:firstname' | i18n }}" class="grow placeholder:text-gray-500"/>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
            <span class="label-text">{{ 'label:lastname' | i18n }}</span>
            </label>

            <label class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="profile.field('lastname').message" [ngClass]="{'tooltip tooltip-open input-error': profile.field('lastname').invalid}">
              <input formControlName="lastname" type="text" name="ohmyapi-lastname" placeholder="{{ 'input:lastname' | i18n }}" class="grow placeholder:text-gray-500"/>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
            <span class="label-text">{{ 'label:nickname' | i18n }}</span>
            </label>

            <label class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="profile.field('nickname').message" [ngClass]="{'tooltip tooltip-open input-error': profile.field('nickname').invalid}">
              <input formControlName="nickname" type="text" name="ohmyapi-nickname" placeholder="{{ 'input:nickname' | i18n }}" class="grow placeholder:text-gray-500"/>
            </label>
          </div>

          <button [disabled]="profile.disabled" (click)="submitProfile()" class="btn btn-primary mt-10">
            {{ 'button:change-profile' | i18n }}
          </button>
        </form>
      </div>

      <input type="radio" name="tabs" role="tab" class="tab !w-28" [attr.aria-label]="'tab:password' | i18n" />

      <div role="tabpanel" class="tab-content bg-base-100 sm:border-base-300 sm:rounded-box p-6 sm:w-128">
        <form [formGroup]="password.group" class="flex flex-col gap-2 w-full">
          <div class="form-control">
            <label class="label">
            <span class="label-text">{{ 'label:password' | i18n }}</span>
            </label>

            <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="password.field('password').message" [ngClass]="{'tooltip tooltip-open input-error': password.field('password').invalid}">
              <i (click)="visablePassword = !visablePassword" class="ti ti-{{visablePassword ? 'eye-off' : 'eye'}} text-gray-500"></i>
              <input formControlName="password" type="{{ visablePassword ? 'text' : 'password' }}" name="ohmyapi-password" placeholder="{{ 'input:password' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ 'label:verify-password' | i18n }}</span>
            </label>

            <label dir="ltr" class="input input-bordered focus-within:input-primary flex items-center gap-2 tooltip-error sm:tooltip-left" [attr.data-tip]="password.field('verify-password').message" [ngClass]="{'tooltip tooltip-open input-error': password.field('verify-password').invalid}">
              <i (click)="visablePassword = !visablePassword" class="ti ti-{{visablePassword ? 'eye-off' : 'eye'}} text-gray-500"></i>
              <input formControlName="verify-password" type="{{ visablePassword ? 'text' : 'password' }}" name="ohmyapi-verify-password" placeholder="{{ 'input:verify-password' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
            </label>
          </div>

          <button [disabled]="password.disabled" (click)="submitPassword()" class="btn btn-primary mt-10">
            {{ 'button:change-password' | i18n }}
          </button>
        </form>
      </div>

      <input type="radio" name="tabs" role="tab" class="tab !w-28" [attr.aria-label]="'tab:settings' | i18n" />
      
      <div role="tabpanel" class="tab-content bg-base-100 sm:border-base-300 sm:rounded-box p-6 sm:w-128">
        
        <span class="block text-sm text-gray-500 mb-4">{{ 'text:your-desktop' | i18n }}</span>
        
        <label class="flex flex-nowrap items-center gap-2">
          <span>{{ 'text:settings-night-mode' | i18n }}</span>

          <div class="flex-1"></div>

          <input [checked]="appService.theme == 'dark'" (change)="appService.toggleTheme()" type="checkbox" class="toggle checked:toggle-primary" name="theme" />
        </label>

        <span class="block text-sm text-gray-500 mt-8 mb-4">{{ 'text:your-account' | i18n }}</span>

        <div class="flex flex-nowrap items-center gap-2">
          <i class="ti ti-logout text-error"></i>

          <span>{{ 'text:logout' | i18n }}</span>

          <div class="flex-1"></div>

          <button (click)="logout()" class="btn btn-sm btn-error">
            {{ 'button:logout' | i18n }}
          </button>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'flex flex-col w-full sm:w-128 mx-auto'
  }
})
export class ProfileComponent {
  public profile = new Form({
    'firstname': new FormControl('', []),
    'lastname': new FormControl('', []),
    'nickname': new FormControl('', [Validators.required]),
  });

  public password = new Form({
    'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
    'verify-password': new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  public visablePassword: boolean = false;

  public get emailVerfied(): boolean {
    return this.userService.profile?.emailVerified ?? false;
  }

  constructor(
    public appService: AppService,
    private apiService: ApiService,
    private userService: UserService,
    private toastSerivce: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userService.profile) {
      this.profile.value = {
        firstname: this.userService.profile.firstname,
        lastname: this.userService.profile.lastname,
        nickname: this.userService.profile.nickname,
      }
    }
  }

  public async submitProfile() {
    this.profile.checkValidation();

    if (this.profile.valid) {
      this.profile.disabled = true;
      try {
        const result = await this.apiService.call({
          action: 'api.v1.ohmyapi.user.update',
          data: this.profile.value,
          auth: true
        });

        this.profile.disabled = false;

        if (result['status']) {
          this.userService.profile = result['data'];
          this.ngOnInit();
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

        this.profile.disabled = false;
      }
    }
  }

  public async submitPassword() {
    this.password.checkValidation();

    if (this.password.valid) {
      if (this.password.value['password'] != this.password.value['verify-password']) {
        this.password.field('verify-password').setError('wrong', true);

        return;
      }

      this.password.disabled = true;
      try {
        const result = await this.apiService.call({
          action: 'api.v1.ohmyapi.user.password',
          data: {
            password: this.password.value['password']
          },
          auth: true
        });

        this.password.disabled = false;

        if (result['status']) {
          this.userService.whoami();
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

        this.password.disabled = false;
      }
    }
  }

  public logout() {
    this.userService.logout();

    this.router.navigate(['/auth/login'], {
      replaceUrl: true
    })
  }
}
