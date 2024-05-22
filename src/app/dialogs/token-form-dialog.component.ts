import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { I18nModule, I18nService } from '../../../projects/i18n/src/public-api';
import moment from 'jalali-moment';
import { ApiService } from '../../../projects/api/src/public-api';
import { ToastService } from '../../../projects/sdk/src/public-api';

@Component({
  selector: 'app-token-form-dialog',
  standalone: true,
  imports: [I18nModule],
  template: `
    @if(data == null || data['id'] == null) {
      <section class="flex flex-col gap-1 p-4 border-b border-base-300">
        <strong>{{ 'dialog:token-form:title' | i18n }}</strong>
        
        @if(!data) {
          <span class="text-sm text-gray-500">
            <!-- می خواهید کلیدتون چند وقت کار کنه ؟ -->
            {{ 'dialog:token-form:subtitle' | i18n }}
          </span>
        }
      </section>
    }

    @if(data) {
      <section class="flex flex-col items-center gap-4 p-10">
        <label dir="ltr" class="input input-bordered flex items-center gap-2 w-full focus-within:border-green-500 focus-within:outline-green-500">
          <button (click)="copyToken()" class="btn btn-sm btn-square btn-ghost tooltip tooltip-bottom" [attr.data-tip]="'text:token-form-dialog:copy-to-clipboard' | i18n">
            <i class="material-icons-round">content_copy</i>
          </button>

          <input readonly type="string" [value]="data['token']" name="ohmyapi-token" placeholder="{{ 'input:token' | i18n }}" class="grow placeholder:text-gray-500"/>
        </label>

        <div class="grid sm:grid-cols-2 gap-10 sm:gap-4 w-full p-4">
          <div class="flex flex-col gap-1">
            <span class="text-gray-500 text-sm">{{ 'text:token-form-dialog:time' | i18n }}</span>
            <strong>{{ 'text:token-expire-' + data['expireAfter'] | i18n }}</strong>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-gray-500 text-sm">{{ 'text:token-form-dialog:expiredAt' | i18n }}</span>
            <strong>{{ formatAt(data['expiredAt']) }}</strong>
          </div>
        </div>
      </section>
    } @else {
      <section class="flex flex-col">
        @for (item of expires; track $index) {
          <label class="flex flex-nowrap items-center gap-4 border-b border-base-300 px-2 py-2 last:border-transparent cursor-pointer text-sm transition-all hover:bg-black/10">
            <input (change)="selected = item" [disabled]="disabled" type="radio" name="currency" value="{{item}}" [checked]="item == selected" class="radio radio-sm checked:radio-amber-500"/>

            <span class="flex-1 font-bold">{{ 'text:token-expire-' + item | i18n }}</span>

            <span class="opacity-60">{{ formatExpire(item) }}</span>
          </label>
        }
      </section>
    }

    <section class="flex flex-nowrap items-center justify-end gap-1 p-2 bg-base-200 mt-auto">
      @if(data && data['id']) {
        <button (click)="delete()" class="btn btn-ghost text-error">
          {{ 'button:token-form-dialog:delete' | i18n }}
        </button>

        <div class="flex-1"></div>
      }

      <button [disabled]="disabled" (click)="close()" class="btn btn-ghost hover:text-green-500">
        {{ 'button:token-form-dialog:close' | i18n }}
      </button>

      @if(!data) {
        <button [disabled]="disabled" (click)="submit()" class="btn bg-green-500 hover:bg-green-600 hover:text-white">
          {{ 'button:token-form-dialog:submit' | i18n }}
        </button>
      }
    </section>
  `,
  host: {
    class: 'flex flex-col bg-base-100 shadow-xl text-base-content sm:rounded-box w-screen h-device-screen sm:h-fit sm:w-128 overflow-hidden'
  }
})
export class TokenFormDialogComponent {
  public expires: string[] = ['1D', '7D', '1M', '3M', '6M', '1Y'];
  public selected: string = '1Y';

  public disabled: boolean = false;

  constructor(
    @Inject(DIALOG_DATA)
    public data: any,
    private dialogRef: DialogRef,
    private i18nService: I18nService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  public close() {
    this.dialogRef.close();
  }

  public copyToken() {
    navigator.clipboard.writeText(this.data['token']).then(() => {
      this.toastService.make({
        i18n: 'COPIED'
      });
    }).catch(() => {
      this.toastService.make({
        i18n: 'COPY_FAILED',
      })
    })
  }

  public formatExpire(add: string) {
    let amount: any = parseInt(add.slice(0, 1));
    let unit: any = { 'D': 'days', 'M': 'months', 'Y': 'years' }[add.slice(1, 2)];

    return moment().locale(this.i18nService.languageCurrent!).add(unit, amount).format('dddd DD MMMM YYYY');
  }

  public formatAt(value: string) {
    return moment(value).locale(this.i18nService.languageCurrent!).format('dddd DD MMMM YYYY');
  }

  public async submit() {
    this.disabled = true;

    try {
      const result = await this.apiService.call({
        action: 'api.v1.ohmyapi.token.generate',
        auth: true,
        data: {
          expireAfter: this.selected
        }
      });


      if (result.status) {
        this.data = {
          'token': result.data['token'],
          'expireAfter': result.data['expireAfter'],
          'expiredAt': result.data['expiredAt'],
        }
      }

      this.toastService.make({
        i18n: result['i18n'],
      });

      this.disabled = false;
    } catch (error) {
      this.disabled = false;
    }
  }

  public async delete() {
    this.disabled = true;

    try {
      const result = await this.apiService.call({
        action: 'api.v1.ohmyapi.token.delete',
        auth: true,
        data: {
          id: this.data['id'],
        }
      });

      if (result.status) {
        this.close();
      }

      this.toastService.make({
        i18n: result['i18n'],
      });

      this.disabled = false;
    } catch (error) {
      this.disabled = false;
    }
  }
}
