import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'jalali-moment';
import { ApiService } from '../../../projects/api/src/public-api';
import { I18nModule, I18nService } from '../../../projects/i18n/src/public-api';
import { ToastService } from '../../../projects/sdk/src/public-api';

@Component({
  selector: 'app-token-create-form-dialog',
  standalone: true,
  imports: [I18nModule, FormsModule],
  template: `
    <section class="flex flex-col gap-1 p-4 border-b border-base-300" [class.hidden]="step == 'token'">
     <strong>{{ "dialog:token-form:title" | i18n }}</strong>
      <span class="text-sm text-gray-500">
        @if(step == 'name') {
          <!-- برای توکن چه اسمی میذارید ؟ -->
          {{ 'dialog:token-form:subtitle:name' | i18n }}
        }

        @if(step == 'expire') {
           <!-- توکن تا چه زمانی منقضی می شود -->
          {{ 'dialog:token-form:subtitle:expire' | i18n }}
        }
      </span>
    </section>

    @if(step == 'name') {
      <section class="flex flex-col p-4">
        <div class="form-control">
          <label class="input input-bordered flex items-center gap-2 focus-within:outline-green-500 focus-within:border-green-500">
            <input type="text" [(ngModel)]="name" name="ohmyapi-token-name" placeholder="{{ 'input:token-name' | i18n }}" class="grow placeholder:text-gray-500"/>
          </label>
        </div>
      </section>
    }

    @if(step == 'expire') {
      <section class="flex flex-col">
        @for (item of expires; track $index) {
        <label
          class="flex flex-nowrap items-center gap-4 border-b border-base-300 px-2 py-2 last:border-transparent cursor-pointer text-sm transition-all hover:bg-black/10"
        >
          <input
            (change)="selected = item['key']"
            [disabled]="disabled"
            type="radio"
            name="currency"
            value="{{ item['key'] }}"
            [checked]="item['key'] == selected"
            class="radio radio-sm checked:radio-amber-500"
          />

          <span class="flex-1 font-bold">{{
            "text:token-expire-" + item['key'] | i18n
          }}</span>

          <span class="opacity-60">{{ item['time'] }}</span>
        </label>
        }
      </section>
    }

    <section
      class="flex flex-nowrap items-center justify-end gap-1 p-2 bg-base-200 mt-auto"
    >
      <button
        [disabled]="disabled"
        (click)="close()"
        class="btn btn-ghost hover:text-green-500"
      >
        {{ "button:token-form-dialog:close" | i18n }}
      </button>

      <button
        [disabled]="disabled"
        (click)="submit()"
        class="btn bg-green-500 hover:bg-green-600 hover:text-white"
      >
        {{ "button:token-form-dialog:submit" | i18n }}
      </button>
      
    </section>
  `,
  host: {
    class:
      "flex flex-col bg-base-100 shadow-xl text-base-content sm:rounded-box w-screen h-device-screen sm:h-fit sm:w-128 overflow-hidden",
  },
})
export class TokenCreateFormDialogComponent {
  public expires: any[] = [];
  public selected: string = "FOREVER";

  public step: string = 'name';

  public name: string = '';

  public token: string = '';

  public disabled: boolean = false;

  constructor(
    private dialogRef: DialogRef,
    private i18nService: I18nService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.apiService
      .call({
        action: "api.v1.ohmyapi.token.expires",
        auth: true,
      })
      .then((res) => {
        if (res["status"]) {
          this.expires = res["data"];
        }
      });
  }

  public close() {
    this.dialogRef.close();
  }

  public copyToken() {
    navigator.clipboard
      .writeText(this.token)
      .then(() => {
        this.toastService.make({
          i18n: "COPIED",
        });
      })
      .catch(() => {
        this.toastService.make({
          i18n: "COPY_FAILED",
        });
      });
  }

  public formatExpire(add: string) {
    if (add == "FOREEVER") return "";
    let amount: any = parseInt(add.slice(0, 1));
    let unit: any = { D: "days", M: "months", Y: "years" }[add.slice(1, 2)];

    return moment()
      .locale(this.i18nService.languageCurrent!)
      .add(unit, amount)
      .format("dddd DD MMMM YYYY");
  }

  public formatAt(value: string) {
    return moment(value)
      .locale(this.i18nService.languageCurrent!)
      .format("dddd DD MMMM YYYY");
  }

  public async submit() {
    if (this.step == 'name') {
      this.step = 'expire';
    } else if (this.step == 'expire') {



      this.disabled = true;

      try {
        const result = await this.apiService.call({
          action: "api.v1.ohmyapi.token.generate",
          auth: true,
          data: {
            expireAfter: this.selected,
          },
        });

        if (result.status) {
          this.token = result.data['token'];
          this.step = 'token';
        }

        this.toastService.make({
          i18n: result["i18n"],
        });

        this.disabled = false;
      } catch (error: any) {
        if (error.error) {
          this.toastService.make({
            i18n: error.error["i18n"],
          });
        }

        this.disabled = false;
      }
    }
  }
}
