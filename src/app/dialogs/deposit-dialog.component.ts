import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../projects/api/src/public-api';
import { I18nModule } from '../../../projects/i18n/src/public-api';
import { ToastService } from '../../../projects/sdk/src/public-api';

@Component({
  selector: 'app-deposit-dialog',
  standalone: true,
  imports: [I18nModule, FormsModule],
  template: `
    <section class="flex flex-col gap-1 p-4 border-b border-base-300">
      <strong>{{ 'dialog:deposit:title' | i18n }}</strong>
      <span class="text-sm text-gray-500">
        @if(step == 'currency') {
          <!-- با کدوم ارز می خواهید پرداخت کنید ؟ -->
          {{ 'dialog:deposit:subtitle:select-currency' | i18n }}
        }
        @if(step == 'amount') {
          <!-- چه مقدار می خواهید پرداخت کنید ؟ -->
          {{ 'dialog:deposit:subtitle:select-amount' | i18n }}
        }
        @if(step == 'tc20') {
          <!-- {{ amount }} {{ 'server:text:' + currency['currency'] | i18n }} رو انتقال بدید -->
          {{ 'dialog:deposit:subtitle:trc20' | i18n: { amount: amount, currency: 'server:text:' + currency['currency'] | i18n } }}
        }
      </span>
    </section>

    @if(step == 'currency') {
      <section class="flex flex-col sm:h-64 overflow-y-scroll relative">
        <div class="flex flex-nowrap items-center gap-4 border-b border-base-300 px-2 py-2 text-xs text-gray-500 bg-base-100 sticky top-0">
          <span class="block w-5"></span>

          <span class="w-32">{{ 'table:head:deposit-dialog:currency-name' | i18n }}</span>

          <span class="w-32">{{ 'table:head:deposit-dialog:currency-gateway' | i18n }}</span>

          <div class="flex-1"></div>
          
          <span class="block w-20 text-center">{{ 'table:head:deposit-dialog:currency-minValue' | i18n  }}</span>
          <span class="block w-20 text-center">{{ 'table:head:deposit-dialog:currency-value' | i18n }}</span> 
        </div>

        @for (item of currencies; track $index) {
          <label class="flex flex-nowrap items-center gap-4 border-b border-base-300 px-2 py-2 last:border-transparent cursor-pointer text-sm font-bold transition-all hover:bg-black/10">
            <input (change)="selected = item['currency']" type="radio" name="currency" value="{{item['currency']}}" [checked]="item['currency'] == selected" class="radio radio-sm checked:radio-amber-500"/>

            <span class="w-32">{{ 'server:text:' + item['currency'] | i18n }}</span>

            <span class="w-32">{{ 'server:text:' + item['gateway'] | i18n }}</span>

            <div class="flex-1"></div>
            
            <span class="block w-20 text-center">{{ item['minValue'] }}</span>
            <span class="block w-20 text-center">{{ item['value'] }} </span> 
          </label>
        }
      </section>
    }

    @if(step == 'amount') {
      <section class="flex flex-col p-4">
        <div class="form-control">
          <label dir="ltr" class="input input-bordered flex items-center gap-2">
            <span>{{ 'server:text:' + currency['currency'] | i18n }}</span>
            <input type="number" [(ngModel)]="amount" [min]="currency['minValue']" [step]="currency['step']" name="ohmyapi-wallet-deposit-amount" placeholder="{{ 'input:wallet-deposit-amount' | i18n }}" class="grow placeholder:text-gray-500"/>
          </label>

          <label class="label">
            <span class="label-text"> = {{ ohmycoin }} {{ 'text:ohmycoin' | i18n }} </span>
          </label>
        </div>

        @if(currency['steps'].length != 0) {
          <div class="divider">{{ 'text:or' | i18n }}</div>

          <div class="grid grid-cols-3 gap-2">
            <button (click)="amount = currency['minValue']" class="btn btn-outline text-xs sm:text-base gap-1 border-gray-300 hover:btn-ghost">
              <span> {{ 'button:deposit-dialog:minValue' | i18n }} </span>
            </button>

            @for (item of currency['steps']; track $index) {
              <button (click)="amount = item" class="btn btn-outline text-xs sm:text-base gap-1 border-gray-300 hover:btn-ghost">
                <span>{{ item }}</span>
                <span>{{ 'server:text:' + currency['currency'] | i18n }}</span>
              </button>
            }
          </div>
        }
      </section>
    }

    @if(step == 'trc20') {
      <section class="flex flex-col items-center justify-center p-4">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ 'text:wallet-address' | i18n}}" alt="qr code" class="p-4 bg-base-100 w-48 h-48 object-contain object-center" />

        <strong class="text-en">{{ 'text:wallet-address' | i18n}}</strong>

        <br />

        <div class="form-control grow w-full">
          <label dir="ltr" class="input input-bordered flex items-center gap-2">
            <input type="text" [(ngModel)]="wallet" name="ohmyapi-wallet-deposit-wallet-address" placeholder="{{ 'input:ohmyapi-wallet-deposit-wallet-address' | i18n }}" class="grow placeholder:text-end placeholder:text-gray-500"/>
          </label>
        </div>
      </section>
    }

    <section class="flex flex-nowrap items-center justify-end gap-1 p-2 bg-base-200 z-0 mt-auto">
      @if(step == 'currency') {
        <button (click)="close()" class="btn btn-ghost hover:text-amber-700">
          {{ 'button:deposit-dialog:close' | i18n }}
        </button>
      }

      @if(step != 'currency') {
        <button [disabled]="disabled" (click)="back()" class="btn btn-ghost hover:text-amber-700">
        {{ 'button:deposit-dialog:back' | i18n }}
        </button>
      }

      <button [disabled]="disabled" (click)="submit()" class="btn bg-amber-500 hover:bg-amber-600 hover:text-white">
        {{ 'button:deposit-dialog:submit' | i18n }}
      </button>
    </section>
  `,
  host: {
    class: 'flex flex-col bg-base-100 shadow-xl text-base-content sm:rounded-box w-screen h-device-screen sm:h-fit sm:w-128 overflow-hidden'
  }
})
export class DepositDialogComponent {
  public currencies: any[] = [];
  public currency: any;
  public selected: any;

  public amount: number = 0;

  public wallet: string = '';

  public step: string = 'currency';

  public disabled: boolean = false;

  public get ohmycoin(): any {
    return (this.amount / this.currency['value']).toFixed(5)
  }

  constructor(
    private dialogRef: DialogRef,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.fetchCurrencies();
  }

  public close() {
    this.dialogRef.close();
  }

  public submit() {
    if (this.step == 'currency') {
      this.selectCurrency(this.selected);
      this.step = 'amount';
    }

    else if (this.step == 'amount') {
      if (this.currency['gateway'] == 'zarinpal') {
        this.request();
      }

      if (this.currency['gateway'] == 'trc20') {
        this.step = 'trc20';
      }
    }

    else if (this.step == 'trc20') {
      this.request();
    }
  }

  public back() {
    if (this.step == 'amount') {
      this.step = 'currency';
    }

    if (this.step == 'trc20') {
      this.step = 'amount';
    }
  }

  public selectCurrency(currency: string) {
    const index = this.currencies.findIndex((item) => item['currency'] == currency);
    this.currency = this.currencies[index];
    this.amount = this.currency['minValue'];
    this.selected = currency;
  }

  private fetchCurrencies() {
    this.apiService.call<any[]>({
      action: 'api.v1.ohmyapi.wallet.currency.list',
      data: {
        limit: 100
      }
    }).then((result) => {
      if (result.status) {
        this.currencies = result.data!.filter((item) => item['gateway'] != 'system');
        this.selectCurrency(this.currencies[0]['currency']);
      }
    })
  }

  private async request() {
    this.disabled = true;

    let data: any = {
      currency: this.selected,
      value: this.amount,
    };

    if (this.currency['gateway'] == 'zarinpal') {
      data['data'] = {
        'callback': window.location.protocol + '//' + window.location.host + '/-/wallet/callback'
      };
    }

    if (this.currency['gateway'] == 'trc20') {
      data['data'] = {
        'wallet': this.wallet
      };
    }

    try {
      const result = await this.apiService.call({
        action: 'api.v1.ohmyapi.wallet.payment.request',
        data: data,
        auth: true,
      });

      if (result.status) {
        if (result.data.url) {
          window.location = result.data.url
        }
      }

      this.toastService.make({
        i18n: result['i18n'],
      });

      this.disabled = false;
    } catch (error: any) {
      if (error?.error?.i18n) {
        this.toastService.make({
          i18n: error.error['i18n'],
        });
      }

      this.disabled = false;
    }
  }
}
