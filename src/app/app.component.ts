import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { I18nService } from '../../projects/i18n/src/public-api';
import { ApiService } from '../../projects/api/src/public-api';
import { UserService } from '../../projects/sdk/src/lib/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="fixed inset-0 z-0">
      <div class="fixed -top-[15vw] -left-[5vw] w-[50vw] h-[50vw] rounded-full bg-radial-circle-c from-sky-400 to-transparent to-70%"></div>
      <div class="fixed -bottom-[5vw] -left-[5vw] w-[50vw] h-[50vw] rounded-full bg-radial-circle-c from-yellow-400 to-transparent to-70%"></div>
      <div class="fixed -top-[5vw] -right-[5vw] w-[50vw] h-[50vw] rounded-full bg-radial-circle-c from-pink-400 to-transparent to-70%"></div>
      <div class="fixed -bottom-[15vw] -right-[15vw] w-[50vw] h-[50vw] rounded-full bg-radial-circle-c from-violet-400 to-transparent to-70%"></div>
    </div>
    <div class="fixed inset-0 bg-white/20 backdrop-blur z-0"></div>

    <div class="relative z-10 w-full h-full">
      <router-outlet/>
    </div>
  `,
  host: {
    class: 'block h-full w-full'
  },
  styles: `
    .fixed.bg-radial-circle-c {
      animation: circles 10s infinite;
    }

    @keyframes circles {
      0%, 100% {
        opacity: 100%;
        transform: scale(1.5) translate(0%, 0%);
      }
      30%,
      50%,
      70% {
        opacity: 80%;
        transform: scale(1.4) translate(-10%, 10%);
      }
    }
  `
})
export class AppComponent {
  constructor(
    private i18nSerivce: I18nService,
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.i18nSerivce.load({
      current: true,
      key: 'fa',
      url: '/assets/i18n/fa.json',
    });

    if (this.apiService.token) {
      this.userService.whoami().catch(() => {
        this.apiService.token = undefined;

        this.router.navigate(['/auth/login'], {
          replaceUrl: true
        });
      });


      if (window.location.pathname.startsWith('/-/') == false) {
        this.router.navigate(['/-/dashboard'], {
          replaceUrl: true
        });
      }
    } else {
      this.router.navigate(['/auth/login'], {
        replaceUrl: true
      });
    }
  }
}
