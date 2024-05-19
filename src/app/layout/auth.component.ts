import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],
  template: `
    <div class="h-[5vh]"></div>

    <img ngSrc="/assets/icons/icon-384x384.png" alt="ohmyapi logo" width="220" height="220" priority>

    <router-outlet />
  `,
  host: {
    class: 'flex flex-col items-center h-full w-full'
  }
})
export class AuthLayoutComponent {

}
