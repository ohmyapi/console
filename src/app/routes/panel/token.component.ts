import { Component } from '@angular/core';
import moment from 'jalali-moment';
import { ApiService } from '../../../../projects/api/src/public-api';
import { I18nModule, I18nService } from '../../../../projects/i18n/src/public-api';
import { DialogService } from '../../../../projects/sdk/src/lib/dialog.service';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';
import { TokenFormDialogComponent } from '../../dialogs/token-form-dialog.component';
import { TokenCreateFormDialogComponent } from '../../dialogs/token-create-form-dialog.component';

@Component({
  selector: 'app-token',
  standalone: true,
  imports: [I18nModule],
  template: `
      @if(userService.tokens == 0) {
        <div class="flex flex-col items-center justify-center gap-4 w-full h-128">
          <strong> {{ 'empty:tokens' | i18n }} </strong>

          <button (click)="openTokenCreateFormDialog()" class="btn btn-sm btn-outline border-primary text-primary mt-8">
            <span>{{ 'button:create-new-token' | i18n }}</span>
          </button>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center gap-4 w-full">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full rounded-2xl p-6 bg-gradient-to-tl from-green-700 to-green-500 text-white">
            <span>شما {{ userService.tokens }} کلید دارید</span>

            <button (click)="openTokenCreateFormDialog()" class="btn btn-sm btn-outline border-white text-white mt-4 sm:mt-0">
              <span>{{ 'button:create-new-token' | i18n }}</span>
            </button>
          </div>
        </div>

        @if(total != 0) {
          <div class="overflow-x-auto w-full bg-base-100 rounded-box">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ 'table:head:name' | i18n }}</th>
                  <th>{{ 'table:head:time' | i18n }}</th>
                  <th>{{ 'table:head:token:token' | i18n }}</th>
                  <th>{{ 'table:head:token:expireAfter' | i18n }}</th>
                </tr>
              </thead>
              
              <tbody>
                @for (item of tokens; track $index) {
                  <tr tabindex="0" (click)="openTokenFormDialog(item)" class="hover:bg-base-200 cursor-pointer">
                    <th>{{item.id}}</th>
                    <td class="whitespace-pre">{{ item.name }}</td>
                    <td class="whitespace-pre">{{ formatAt(item.updatedAt) }}</td>
                    <td class="whitespace-pre">{{ formatToken(item.token) }}</td>
                    <td class="whitespace-pre">{{ 'text:token-expire-' + item.expireAfter | i18n }}</td>
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
                  {{ 'button:more-tokens' | i18n }}
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
export class TokenComponent {
  public page: number = 1;
  public limit: number = 10;
  public last: number = 1;
  public total: number = 0;

  public loading: boolean = false;

  public tokens: any = undefined;

  constructor(
    public userService: UserService,
    private apiService: ApiService,
    private dialogService: DialogService,
    private i18nService: I18nService
  ) { }

  ngOnInit() {
    this.fetch();
  }

  public openTokenCreateFormDialog() {
    this.dialogService.open(TokenCreateFormDialogComponent, {
    }).closed.subscribe(() => this.fetch());
  }

  public openTokenFormDialog(data: any) {
    this.dialogService.open(TokenFormDialogComponent, {
      data,
    }).closed.subscribe(() => this.fetch());
  }

  public formatAt(value: string) {
    return moment(value).locale(this.i18nService.languageCurrent!).fromNow();
  }

  public formatToken(token: string) {
    return token.slice(0, 4) + '**.*****.**' + token.slice(token.length - 4, token.length);
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
        action: 'api.v1.ohmyapi.token.list',
        auth: true,
        cache: false,
        data: {
          page: this.page,
          limit: this.limit,
        }
      });

      if (result.status) {
        this.page = result.meta!.page! + 1;
        this.last = result.meta!.last!;
        this.total = result.meta!.total!;

        this.userService.tokens = this.total;

        this.tokens = result.data;
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }
}
