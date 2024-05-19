import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../projects/api/src/public-api';
import { UserService } from '../../../../projects/sdk/src/lib/user.service';
import { I18nModule } from '../../../../projects/i18n/src/public-api';

@Component({
  selector: 'app-wallet-callback',
  standalone: true,
  imports: [RouterLink, I18nModule],
  template: `
    @if(status == 'loading') {
      <span class="loading loading-spinner loading-lg text-primary mb-8"></span>

      <strong>{{ 'text:wallet-callback:loading' | i18n }}</strong>
    }

    @if(status == 'success') {
      <i class="ti ti-check text-success !w-32 !h-32 !text-[8rem] mb-8"></i>

      <strong>{{ 'text:wallet-callback:success' | i18n }}</strong>
    }

    @if(status == 'failed') {
      <i class="ti ti-x text-error !w-32 !h-32 !text-[8rem] mb-8"></i>

      <strong>{{ 'text:wallet-callback:failed' | i18n }}</strong>
    }

    @if(status != 'loading') {
      <a routerLink="/-/wallet" (click)="refresh()" class="btn btn-sm btn-outline border-primary text-primary mt-8">
        {{ 'button:wallet-callback:back' | i18n }}
      </a>
    }
  `,
  host: {
    class: 'flex flex-col items-center justify-center w-full sm:w-128 h-128 mx-auto'
  }
})
export class WalletCallbackComponent {
  public status: 'loading' | 'success' | 'failed' = 'loading';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private userSerivce: UserService
  ) { }

  ngOnInit() {
    setTimeout(async () => {
      const queries = this.activatedRoute.snapshot.queryParams;
      try {
        const result = await this.apiService.call({
          action: 'api.v1.ohmyapi.wallet.payment.callback',
          data: queries,
          auth: true,
        });

        if (result['status']) {
          this.status = result.data['status'];
        }

      } catch (error) {
        //
      }

    }, 0);
  }

  public refresh() {
    this.userSerivce.whoami();
  }
}
