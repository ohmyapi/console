import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I18nService } from '../../../i18n/src/public-api';
import { IOhmyapiAction, IOhmyapiCallParams, IOhmyapiCallResponse } from './api.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public readonly endpoint: string = 'https://api.ohmyapi.com';

  private _token?: string;

  public set token(value: string | undefined) {
    this._token = value;
    if (value) {
      window.localStorage.setItem('#ohmyapi/token', value);
    } else {
      window.localStorage.removeItem('#ohmyapi/token');
    }
  }

  public get token(): string | undefined {
    if (!this._token) {
      const value = window.localStorage.getItem('#ohmyapi/token');
      this._token = value ?? undefined;
    }

    return this._token;
  }

  constructor(
    private i18nService: I18nService,
    private httpClient: HttpClient
  ) { }

  public async call<T = any>(params: IOhmyapiCallParams): Promise<IOhmyapiCallResponse<T>> {
    const url = `${this.endpoint}/v1/call/${params.action}`;

    let headers: any = {
      'x-i18n': this.i18nService.languageCurrent,
    };

    if (params.auth && this._token) {
      headers['Authorization'] = `Bearer ${this._token}`
    }

    try {
      const result = await firstValueFrom(this.httpClient.post(url, params.data ?? {}, {
        headers,
        // headers: {
        //   'Authorization': `Bearer ${this.params.token}`
        // }
      }));

      return result as any;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async actions(): Promise<IOhmyapiCallResponse<IOhmyapiAction[]>> {
    const url = `${this.endpoint}/v1/action`;

    try {
      const result = await firstValueFrom(this.httpClient.get(url));

      return result as any;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}