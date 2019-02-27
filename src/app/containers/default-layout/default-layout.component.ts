import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from './../../_nav';
import { Router } from "@angular/router";

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;

  user: any;
  displayName: string;

  state = 0;
  color: string;

  constructor(private router: Router, public authService: AuthService, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
  ngOnInit() {
    this.authService.showDisplayName();
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getDisplayNameStyle() {
    if(this.state === 0){
      this.color = this.getRandomColor();
    }
    let style: any = {};
    if (this.state >= 0) {
      this.state++;
      style = { "border": "1px solid white", "background-color": this.color, "border-radius": "50%", "padding-top": "5px" };
    }
    return style;
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }
}
