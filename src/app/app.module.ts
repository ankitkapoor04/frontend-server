import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@NgModule({
  imports: [
    HttpClient,
    HttpHeaders,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        timeOut: 2000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }), 
  ]
})
class MainModule {}