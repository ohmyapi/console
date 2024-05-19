import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { I18nModule, I18nService } from '../../../projects/i18n/src/public-api';
import moment from 'jalali-moment';

@Component({
  selector: 'app-wallet-transaction-dialog',
  standalone: true,
  imports: [NgClass, I18nModule],
  template: `    
    <section class="grid grid-cols-2 gap-4 p-4">
      <div class="flex flex-col gap-1 rounded-btn p-4" [ngClass]="{
        'bg-error text-error-content': data['status'] == 'failed',
        'bg-success text-success-content': data['status'] == 'success',
        'bg-warning text-warning-content': data['status'] == 'pending'
      }">
        <!-- <span class="opacity-60 text-sm">وضعیت</span> -->
        <span class="opacity-60 text-sm">{{ 'text:wallet-transaction-dialog:status' | i18n }}</span>
        <strong>
          {{ 'server:text:wallet-transaction-status-' + data['status'] | i18n}}
        </strong>
      </div>

      <div class="flex flex-col gap-1 rounded-btn bg-primary text-primary-content p-4">
        <span class="opacity-60 text-sm">{{ 'text:wallet-transaction-dialog:time' | i18n }}</span>
        <strong>{{ formatAt(data['updatedAt']) }}</strong>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 p-4">
      <div class="flex flex-col gap-1">
        <span class="text-gray-500 text-sm">{{ 'text:wallet-transaction-dialog:amount' | i18n }}</span>
        <strong>{{ data['amount'] }} {{ 'server:text:' + data['currency']['currency'] | i18n }}</strong>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-gray-500 text-sm">{{ 'text:wallet-transaction-dialog:value' | i18n }}</span>
        <strong>{{ data['value'] }} {{ 'text:ohmycoin' | i18n }}</strong>
      </div>
      
      <div class="flex flex-col gap-1">
        <span class="text-gray-500 text-sm">{{ 'text:wallet-transaction-dialog:balance-before' | i18n }}</span>
        <strong>{{ data['balance'] }} {{ 'text:ohmycoin' | i18n }}</strong>
      </div>
      
      <div class="flex flex-col gap-1">
        <span class="text-gray-500 text-sm">{{ 'text:wallet-transaction-dialog:balance-after' | i18n }}</span>
        <strong>{{ data['balance'] + data['value'] }} {{ 'text:ohmycoin' | i18n }}</strong>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-gray-500 text-sm">{{ 'text:wallet-transaction-dialog:price' | i18n }}</span>
        <strong>{{ data['price'] }} {{ 'server:text:' + data['currency']['currency'] | i18n }}</strong>
      </div>

      <div></div>

      <div class="flex flex-col gap-1 col-span-2">
        <span class="text-gray-500 text-sm">{{ 'text:wallet-transaction-dialog:description' | i18n }}</span>
        <strong>{{ data['description'] ?? 'text:wallet-transaction-dialog:empty-description' | i18n }}</strong>
      </div>
    </section>

    @if(data['status'] == 'pending' && data['data']['url']) {
      <section class="m-4 border border-dashed border-base-300 flex flex-col gap-4 items-center justify-center px-4 py-8 rounded-btn">
        <p>{{ 'text:wallet-transaction-dialog:pay' | i18n }}</p>
        
        <a href="{{data['data']['url']}}" class="btn btn-sm">
          {{ 'button:wallet-transaction-dialog:pay' | i18n }}
        </a>
      </section>
    }

    <section class="flex flex-nowrap items-center justify-end gap-1 p-2 bg-base-200 mt-auto">
      <button (click)="close()" class="btn btn-ghost hover:text-amber-500">
        {{ 'button:wallet-transaction-dialog:close' | i18n }}
      </button>
    </section>
  `,
  host: {
    class: 'flex flex-col bg-base-100 shadow-xl text-base-content sm:rounded-box w-screen h-screen sm:h-fit sm:w-128 overflow-hidden'
  }
})
export class WalletTransactionDialogComponent {
  constructor(
    @Inject(DIALOG_DATA)
    public data: any,
    private dialogRef: DialogRef,
    private i18nService: I18nService
  ) { }

  public close() {
    this.dialogRef.close();
  }

  public formatAt(value: string) {
    return moment(value).locale(this.i18nService.languageCurrent!).fromNow();
  }
}
