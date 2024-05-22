import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { II18NLanguage, II18NLanguageMap, II18NLoadParams } from "./i18n.interface";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class I18nService {
  private languagesMap: II18NLanguageMap = {};

  public get languages(): string[] {
    return Object.keys(this.languagesMap);
  }

  public get languageMap(): II18NLanguage | undefined {
    return this.languagesMap[this.languageCurrent!]?.map ?? undefined;
  }

  public languageCurrent: string | undefined;

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private title: Title,
    private httpClient: HttpClient,
  ) { }

  public async load(params: II18NLoadParams): Promise<boolean> {
    try {
      if (params.current) {
        this.languageCurrent = params.key;
      }

      params.dir = params.dir ?? 'ltr';

      const data: any = await firstValueFrom(this.httpClient.get(params.url));

      this.languagesMap[params.key] = {
        dir: params.dir!,
        font: params.font,
        map: data,
      }

      if (params.current) {
        this.setLanguage(params.key);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  public unload(key: string) {
    delete this.languagesMap[key];
  }

  public setLanguage(key: string) {
    this.languageCurrent = key;

    if (this.languageMap!['@title']) {
      this.title.setTitle(this.languageMap!['@title']);
    }

    this.setDirection((this.languageMap!['@direction'] ?? this.languagesMap[this.languageCurrent!]?.dir) as any);

    this.setFont((this.languageMap!['@font'] ?? this.languagesMap[this.languageCurrent!]?.font) as any);
  }

  public translate(key: string, values: any = {}): string {
    try {
      let value = this.languageMap![key];

      if (this.languageCurrent && value) {
        // replace values key with value string
        const keys = Object.keys(values);

        // replace values key with value string
        for (const key of keys) {
          value = value.replace(`{${key}}`, values[key]);          
        }

        return value;
      }

      console.warn(`'${key}' translate not exists`);

      return key;
    } catch (error) {
      return key;
    }
  }

  public setFont(font: string) {
    if (this.document.getElementById('i18n-font')) {
      this.document.getElementById('i18n-font')?.remove();
    }

    const link = this.document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${font}:wght@100..900&display=swap`;
    link.rel = 'stylesheet';
    link.id = 'i18n-font';
    this.document.head.appendChild(link);

    const style = this.document.createElement('style');
    style.innerText = `*:not(.material-icons-round) {
      font-family: "${font}", sans-serif;
    }`;
    style.id = 'i18n-font';
    this.document.head.appendChild(style);
  }

  public setDirection(dir: 'ltr' | 'rtl') {
    this.document.querySelector('html')?.setAttribute('dir', dir);
    this.document.querySelector('html')?.setAttribute('lang', this.languageCurrent!);
  }
}
