import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from './loader.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  styleUrls: ['./app.component.css'],
  template: `
  
  <router-outlet>
    <span *ngIf="showLoader" class="loading"></span>
  </router-outlet>
  <app-alerts></app-alerts>
  `
})
export class AppComponent implements OnInit {

  title = 'bFinance-web';
  appUrl = 'http://localhost:5555';
  showLoader: boolean;

  constructor(private router: Router, private loaderService: LoaderService) { }


  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}
