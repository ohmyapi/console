import { Injectable } from '@angular/core';
import { IUserProfile, IUserWallet } from './user.interface';
import { ApiService } from '../../../api/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public profile?: IUserProfile;
  public wallet?: IUserWallet = {
    id: 0,
    balance: 0
  }
  public tokens: number = 0;

  constructor(
    private apiService: ApiService
  ) { }

  public whoami() {
    return Promise.all([
      this.apiService.call({
        action: 'api.v1.ohmyapi.user.me',
        auth: true
      }).then((result) => {
        if (result['status']) {
          this.profile = result['data'];
        }
      }),
      this.apiService.call({
        action: 'api.v1.ohmyapi.wallet.mine',
        auth: true
      }).then((result) => {
        if (result['status']) {
          this.wallet = result['data'];
        }
      }),
      this.apiService.call({
        action: 'api.v1.ohmyapi.token.list',
        auth: true,
        data: {
          limit: 1
        }
      }).then((result) => {
        if (result['status']) {
          this.tokens = result.meta!.total ?? 0;
        }
      }),
    ])
  }

  public logout() {
    this.apiService.token = undefined;
    this.profile = undefined;
    this.wallet = undefined;
  }
}
