import { Component } from '@angular/core';
import * as sidebarData from '../stringFile/sidebar.json'; 
import  {RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  sidebarData: any = sidebarData;
  username: string = '';
  role: string = '';
  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
  }
 
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}