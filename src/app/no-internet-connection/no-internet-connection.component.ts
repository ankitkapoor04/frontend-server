import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-internet-connection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-internet-connection.component.html',
  styleUrls: ['./no-internet-connection.component.css']
})
export class NoInternetConnectionComponent implements OnInit {
  isOnline = true;

  ngOnInit(): void {
    this.updateNetworkStatus();

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      window.addEventListener('online', () => this.updateNetworkStatus());
      window.addEventListener('offline', () => this.updateNetworkStatus());
    }
  }

  updateNetworkStatus() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}
