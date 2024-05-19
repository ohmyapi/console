import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { I18nService } from '../../../i18n/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private i18nService: I18nService) { }

  public make(params: IToastMakeParams) {
    if (params.message == null && params.i18n == null) return;    

    const subject = new Subject();
    const alert = document.createElement('div');
    alert.className =
      'alert justify-center bg-natural text-natural-content w-full md:min-w-[300px] md:w-fit min-h-[56px] dark:shadow-lg';

    const div = document.createElement('div');
    div.className = 'flex flex-nowrap items-center justify-between w-full h-full';

    const span = document.createElement('span');
    span.className = 'block flex-1 w-full text-start';

    if (params.message) {
      span.innerText = params.message;
    }

    if (params.i18n) {
      span.innerText = this.i18nService.translate('server:text:' + params.i18n);
    }

    div.appendChild(span);

    if (params.action) {
      const button = document.createElement('button');
      button.className = 'btn btn-ghost mr-4';
      button.innerText = params.action;
      button.onclick = () => {
        this.container.removeChild(alert);
        if (subject.closed == false) subject.complete();
      };
      div.appendChild(button);
    }

    alert.appendChild(div);

    this.container.appendChild(alert);

    setTimeout(() => {
      this.container.removeChild(alert);
      if (subject.closed == false) subject.complete();
    }, params.duration ?? 3000);

    return subject;
  }

  private get container(): HTMLElement {
    const container = document.getElementById('ohmyapi-toast-container');

    if (container) {
      return container;
    }

    const div = document.createElement('div');
    div.id = 'ohmyapi-toast-container';
    div.className =
      'toast toast-bottom items-center justify-center z-[9999] -md:mb-14 -md:left-0 -md:right-0 md:!right-[unset]';

    document.body.appendChild(div);

    return div;
  }
}

export interface IToastMakeParams {
  i18n?: string;
  message?: string;
  duration?: number;
  action?: string;
}