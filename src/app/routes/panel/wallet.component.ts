import { Component } from '@angular/core';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';
import { ApiService } from '../../../../projects/api/src/public-api';
import { I18nModule, I18nService } from '../../../../projects/i18n/src/public-api';
import { DialogService } from '../../../../projects/sdk/src/lib/dialog.service';
import { DepositDialogComponent } from '../../dialogs/deposit-dialog.component';
import moment from 'jalali-moment';
import { WalletTransactionDialogComponent } from '../../dialogs/wallet-transaction-dialog.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [I18nModule],
  template: `
    <div class="flex flex-nowrap items-end justify-between gap-2 p-6 rounded-2xl bg-gradient-to-tl from-amber-700 to-amber-500 text-white relative w-full">
      <div class="flex flex-col gap-1">
        <span class="text-xl opacity-60">{{ 'card:title-wallet' | i18n }}</span>
        
        <div class="flex flex-nowrap items-center gap-2">
          <strong class="text-3xl">{{ balance }}</strong>
          <span>{{ 'text:ohmycoin' | i18n }}</span>
        </div>
      </div>

      <button (click)="openDepositDialog()" class="btn btn-sm btn-ghost border border-white/50 text-white hover:bg-white hover:text-amber-500">
        <i class="material-icons-round">add</i>

        <span>
          {{ 'text:deposit' | i18n }}
        </span>
      </button>
    </div>

    @if(transactions) {
      @if(transactions.length == 0) {
        <div class="flex flex-col items-center justify-center gap-4 w-full h-128">
          <strong> {{ 'empty:transactions' | i18n }} </strong>
        </div>
      } @else {
        <div class="overflow-x-auto w-full bg-base-100 rounded-box">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>{{ 'table:head:time' | i18n }}</th>
                <th>{{ 'table:head:transactions:type' | i18n }}</th>
                <th>{{ 'table:head:transactions:value' | i18n }}</th>
                <th>{{ 'table:head:transactions:status' | i18n }}</th>
              </tr>
            </thead>
            
            <tbody>
              @for (item of transactions; track $index) {
                <tr tabindex="0" (click)="openTransactionDialog(item)" class="hover:bg-base-200 cursor-pointer">
                  <th>{{item.id}}</th>
                  <td class="whitespace-pre">{{formatAt(item.updatedAt)}}</td>
                  <td class="whitespace-pre">{{ 'server:text:wallet-transaction-type-' + item.type | i18n}}</td>
                  <td class="whitespace-pre">{{item.value}} {{ 'text:ohmycoin' | i18n }}</td>
                  <td class="whitespace-pre">{{ 'server:text:wallet-transaction-status-' + item.status | i18n}}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if(page <= last) {
          <div class="flex flex-nowrap items-center justify-center">
            <button (click)="next()" class="btn btn-sm btn-ghost" [class.btn-disabled]="loading">
              @if(loading) {
                <span class="loading loading-spinner loading-xs"></span>
              } @else { 
                <span>
                  {{ 'button:more-transactions' | i18n }}
                </span>
              }
            </button>
          </div>
        }

        <br />
      }
    }
  `,
  host: {
    class: 'flex flex-col gap-4 items-center w-full sm:w-128 mx-auto px-4 sm:px-0'
  }
})
export class WalletComponent {
  public get balance(): string {
    return this.userService.wallet!.balance.toString();
  }

  public page: number = 1;
  public limit: number = 10;
  public last: number = 1;
  public total: number = 0;

  public loading: boolean = false;

  public transactions: any = undefined;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private dialogService: DialogService,
    private i18nService: I18nService
  ) { }

  ngOnInit() {
    this.userService.loadWallet();
    this.fetch();
  }

  public openDepositDialog() {
    this.dialogService.open(DepositDialogComponent);
  }

  public openTransactionDialog(data: any) {
    this.dialogService.open(WalletTransactionDialogComponent, {
      data
    });
  }

  public formatAt(value: string) {
    return moment(value).locale(this.i18nService.languageCurrent!).fromNow();
  }

  public next() {
    this.fetch();
  }

  private async fetch() {
    if (this.loading) return;
    if (this.page > this.last) return;

    this.loading = true;

    try {
      const result = await this.apiService.call({
        action: 'api.v1.ohmyapi.wallet.transactions',
        auth: true,
        data: {
          page: this.page,
          limit: this.limit,
        }
      });

      if (result.status) {
        this.page = result.meta!.page! + 1;
        this.last = result.meta!.last!;
        this.total = result.meta!.total!;

        if (this.transactions == undefined) {
          this.transactions = [];
        }

        this.transactions = this.transactions.concat(result.data);
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }
}
