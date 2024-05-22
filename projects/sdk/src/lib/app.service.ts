import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

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
    private swUpdate: SwUpdate
  ) { }

  public toggleTheme() {
    this.theme = this._theme == 'light' ? 'dark' : 'light';
  }

  public get onUpdateAvailable() {
    return this.swUpdate.versionUpdates.pipe(filter((event) => {
      if (event.type == 'VERSION_DETECTED') return true;
      return false;
    }));
  }

  public update() {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload();
    });
  }

  private changeBodyAttrabiuteTheme() {
    const value = this._theme ?? 'light';

    this.document.body.setAttribute('data-theme', value);
  }
}
