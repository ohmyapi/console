import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import moment from "jalali-moment";
import { ApiService } from "../../../projects/api/src/public-api";
import { I18nModule, I18nService } from "../../../projects/i18n/src/public-api";
import { ToastService } from "../../../projects/sdk/src/public-api";

@Component({
  selector: "app-token-form-dialog",
  standalone: true,
  imports: [I18nModule, FormsModule],
  template: `
   @if(data) {
    <div role="tablist" class="border-b-2 flex flex-nowrap items-center">
      <a tabindex="0" (click)="tab = 'token'" [class.border-green-500]="tab == 'token'" role="tab" class="-mb-[2px] flex items-center justify-center border-b-2 px-4 h-12 w-fit cursor-pointer text-sm text-gray-600">
        {{ 'tab:token' | i18n }}
      </a>
      <a tabindex="0" (click)="tab = 'name'" [class.border-green-500]="tab == 'name'" role="tab" class="-mb-[2px] flex items-center justify-center border-b-2 px-4 h-12 w-fit cursor-pointer text-sm text-gray-600">
        {{ 'tab:name' | i18n }}
      </a>
      <a tabindex="0" (click)="tab = 'permission'" [class.border-green-500]="tab == 'permission'" role="tab" class="-mb-[2px] flex items-center justify-center border-b-2 px-4 h-12 w-fit cursor-pointer text-sm text-gray-600">
        {{ 'tab:permission' | i18n }}
      </a>
      <a tabindex="0" (click)="tab = 'limit'" [class.border-green-500]="tab == 'limit'" role="tab" class="-mb-[2px] flex items-center justify-center border-b-2 px-4 h-12 w-fit cursor-pointer text-sm text-gray-600">
        {{ 'tab:limit' | i18n }}
      </a>
      <a tabindex="0" (click)="tab = 'delete'" [class.border-green-500]="tab == 'delete'" role="tab" class="-mb-[2px] flex items-center justify-center border-b-2 px-4 h-12 w-fit cursor-pointer text-sm text-gray-600">
        {{ 'tab:delete' | i18n }}
      </a>
    </div>

    <section class="flex flex-col items-center gap-4 p-10" [class.hidden]="tab != 'token'">
      <label
        dir="ltr"
        class="input input-bordered flex items-center gap-2 w-full focus-within:border-green-500 focus-within:outline-green-500"
      >
        <button
          (click)="copyToken()"
          class="btn btn-sm btn-square btn-ghost tooltip tooltip-bottom"
          [attr.data-tip]="'text:token-form-dialog:copy-to-clipboard' | i18n"
        >
          <i class="material-icons-round">content_copy</i>
        </button>

        <input
          readonly
          type="string"
          [value]="data['token']"
          name="ohmyapi-token"
          placeholder="{{ 'input:token' | i18n }}"
          class="grow placeholder:text-gray-500"
        />
      </label>

      <div class="grid sm:grid-cols-2 gap-10 sm:gap-4 w-full p-4">
        <div class="flex flex-col gap-1">
          <span class="text-gray-500 text-sm">{{
            "text:token-form-dialog:time" | i18n
          }}</span>
          <strong>{{
            "text:token-expire-" + data["expireAfter"] | i18n
          }}</strong>
        </div>

        @if(data["expireAfter"] != 'FOREVER') {
          <div class="flex flex-col gap-1">
            <span class="text-gray-500 text-sm">{{
              "text:token-form-dialog:expiredAt" | i18n
            }}</span>
            <strong>{{ formatAt(data["expiredAt"]) }}</strong>
          </div>
        }
      </div>
    </section>

    <section class="flex flex-col p-4" [class.hidden]="tab != 'name'">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ 'input:token-name' | i18n }}</span>
          </label>

          <label class="input input-bordered flex items-center gap-2 focus-within:outline-green-500 focus-within:border-green-500">
            <input type="text" [(ngModel)]="data['name']" name="ohmyapi-token-name" class="grow placeholder:text-gray-500"/>
          </label>
        </div>
      </section>

      <section class="flex flex-col max-h-128 overflow-y-scroll" [class.hidden]="tab != 'permission'">
        <div class="flex flex-nowrap items-center gap-2 h-12 px-4 bg-amber-300 m-2 rounded-btn text-sm">
          <i class="material-icons-round">info_outline</i>
          <span>{{ 'text:token-form-dialog:permission-support' | i18n }}</span>
        </div>

        @for (item of permissions; track $index) {
          <div class="h-12 w-full px-4 border-b flex flex-nowrap items-center gap-2 text-sm">
            <strong>{{$index + 1}}.</strong>
            <span>{{ item }}</span>
          </div>
        }
      </section>

      <section class="flex flex-col max-h-128 overflow-y-scroll" [class.hidden]="tab != 'limit'">
        <div class="bg-base-200 p-4 text-sm">
          {{ 'text:token-form-dialog:limit-description' | i18n }}
        </div>

        <div class="collapse collapse-arrow rounded-none border-b">
          <input type="checkbox" class="peer" />
          <div class="collapse-title">{{ 'text:token-form-dialog:ip-limit' | i18n }}</div>
          <div class="collapse-content p-0">
            <label
              dir="ltr"
              class="m-4 input input-bordered flex items-center gap-2 focus-within:border-green-500 focus-within:outline-green-500"
            >
              <button
                (click)="addIP()"
                class="btn btn-sm btn-square btn-ghost"
              >
                <i class="material-icons-round">add</i>
              </button>

              <input
                [(ngModel)]="ip"
                placeholder="8.8.8.8"
                type="string"
                name="ohmyapi-token"
                class="grow placeholder:text-gray-500"
                (keyup.enter)="addIP()"
              />
            </label>

            @for (item of data['ips']; track $index) {
              <div class="h-12 w-full px-4 border-b flex flex-nowrap items-center gap-2 text-sm">
                <strong>{{$index + 1}}.</strong>
                <span class="flex-1">{{ item }}</span>

                <button (click)="data['ips'].splice($index, 1)" class="btn btn-ghost btn-sm text-error">حذف</button>
              </div>
            }
          </div>
        </div>

        <div class="collapse collapse-arrow rounded-none border-b">
          <input type="checkbox" class="peer" />
          <div class="collapse-title">{{ 'text:token-form-dialog:referer-limit' | i18n }}</div>
          <div class="collapse-content p-0">
            <label
              dir="ltr"
              class="m-4 input input-bordered flex items-center gap-2 focus-within:border-green-500 focus-within:outline-green-500"
            >
              <button
                (click)="addReferer()"
                class="btn btn-sm btn-square btn-ghost"
              >
                <i class="material-icons-round">add</i>
              </button>

              <input
                [(ngModel)]="referer"
                placeholder="example.com"
                type="string"
                name="ohmyapi-referer"
                class="grow placeholder:text-gray-500"
                (keyup.enter)="addReferer()"
              />
            </label>
          </div>

          @for (item of data['referers']; track $index) {
            <div class="h-12 w-full px-4 border-b flex flex-nowrap items-center gap-2 text-sm">
              <strong>{{$index + 1}}.</strong>
              <span class="flex-1">{{ item }}</span>
              <button (click)="data['referers'].splice($index, 1)" class="btn btn-ghost btn-sm text-error">حذف</button>
            </div>
          }
        </div>
      </section>

      <section class="flex flex-col items-center justify-center p-8" [class.hidden]="tab != 'delete'">
        <i class="material-icons-round text-error !w-20 !h-20 !text-[5rem]">delete</i>

        <strong class="text-lg mt-4">{{ 'text:token-form-dialog:delete-title' | i18n }}</strong>
        <p class="text-sm text-gray-600">{{ 'text:token-form-dialog:delete-subtitle' | i18n}}</p>

        <button (click)="delete()" class="btn btn-ghost btn-sm text-error mt-6">
          {{ "button:token-form-dialog:delete" | i18n }}
        </button>
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
export class TokenFormDialogComponent {
  public tab: string = 'token';
  public disabled: boolean = false;

  public permissions: string[] = [];

  public ip: string = '';
  public referer: string = '';

  constructor(
    @Inject(DIALOG_DATA)
    public data: any,
    private dialogRef: DialogRef,
    private i18nService: I18nService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.apiService.call({
      action: 'api.v1.ohmyapi.token.oneById',
      data: {
        id: this.data['id']
      },
      auth: true,
    }).then((res) => {
      this.data = res.data['data'];

      this.permissions = res.data['permissions'];
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public addIP() {
    if (this.ip.length != 0) {
      this.data['ips'].push(this.ip);
      this.ip = '';
    }
  }

  public addReferer() {
    if (this.referer.length != 0) {
      this.data['referers'].push(this.referer);
      this.referer = '';
    }
  }

  public copyToken() {
    navigator.clipboard
      .writeText(this.data["token"])
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
  public formatAt(value: string) {
    return moment(value)
      .locale(this.i18nService.languageCurrent!)
      .format("dddd DD MMMM YYYY");
  }

  public async submit() {
    this.disabled = true;

    this.apiService.call({
      action: 'api.v1.ohmyapi.token.update',
      data: {
        id: this.data['id'],
        name: this.data['name'],
        ips: this.data['ips'],
        referers: this.data['referers'],
      },
      auth: true,
    }).then((res) => {
      if (res.status) {
        this.close();
      } else {
        this.disabled = false;
      }

      this.toastService.make({
        i18n: res["i18n"],
      });
    }).catch((error) => {
      if (error.error) {
        this.toastService.make({
          i18n: error.error["i18n"],
        });
      }

      this.disabled = false;
    });
  }

  public async delete() {
    this.disabled = true;

    try {
      const result = await this.apiService.call({
        action: "api.v1.ohmyapi.token.delete",
        auth: true,
        data: {
          id: this.data["id"],
        },
      });

      if (result.status) {
        this.close();
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
