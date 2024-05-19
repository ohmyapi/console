import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _theme?: 'dark' | 'light';

  public set theme(value: 'dark' | 'light' | undefined) {
    this._theme = value;
    if (value) {
      window.localStorage.setItem('#ohmyapi/theme', value);
    } else {
      window.localStorage.removeItem('#ohmyapi/theme');
    }

    this.changeBodyAttrabiuteTheme();
  }

  public get theme(): 'dark' | 'light' | undefined {
    if (!this._theme) {
      const value = window.localStorage.getItem('#ohmyapi/theme') as any;
      this._theme = value ?? undefined;
    }

    this.changeBodyAttrabiuteTheme();

    return this._theme;
  }

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
  ) { }

  public toggleTheme() {
    this.theme = this._theme == 'light' ? 'dark' : 'light';
  }

  private changeBodyAttrabiuteTheme() {
    const value = this._theme ?? 'light';

    this.document.body.setAttribute('data-theme', value);
  }
}
