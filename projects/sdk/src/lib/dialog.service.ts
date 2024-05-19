import { Dialog } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private dialog: Dialog
  ) { }

  public open(component: any, config: any = {}) {
    this.document.querySelector('html')!.style.overflow = 'hidden';

    const dialog = this.dialog.open(component, {
      ...config,
      hasBackdrop: true,
      backdropClass: 'mirza-overlay'.split(' '),
      panelClass: '!fixed top-1/2 left-1/2 z-30 -translate-y-1/2 -translate-x-1/2'.split(' '),
      disableClose: false,
      autoFocus: false,
    });

    this.document.querySelector('.cdk-overlay-backdrop')!.addEventListener('click', () => {
      dialog.close();
    });

    dialog.closed.subscribe(() => {
      this.document.querySelector('html')!.style.removeProperty('overflow');
    });

    return dialog;
  }
}

