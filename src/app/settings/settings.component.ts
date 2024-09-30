import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import * as settingsString from '../stringFile/settings.json';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent], 
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
urlForm: any;
onCancel() {
throw new Error('Method not implemented.');
}

  settings = settingsString;

  applications = [
    { name: 'Application 1', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711' },
    { name: 'Application 2', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711' },
    { name: 'Application 3', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711' },
    { name: 'Application 4', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711' },
    { name: 'Application 5', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711' },
    { name: 'Application 6', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711' },
    { name: 'Application 7', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711'},
    { name: 'Application 8', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711'},
    { name: 'Application 9', apiKey: 'a1b2c33d4e5f6g7h8i9jakblc', secretKey: '10711'},
    // ... other applications
  ];

  isPopupOpen = false;
  isAddUrlPopupOpen = false; 

  webhooks: string[] = [
    'https://bpublic.abc.in',
    'https://bpublic.abc.in',
    'https://bpublic.abc.in',
    'https://bpublic.abc.in',
  ];
  events = {
    auth: false,
    streamStarting: false,
    streamStopped: false,
  };
  openPopup() {
    this.isPopupOpen = true;
  }
  closePopup() {
    this.isPopupOpen = false;
  }

  openAddUrlPopup() {
    this.isAddUrlPopupOpen = true;
  }

  closeAddUrlPopup() {
    this.isAddUrlPopupOpen = false;
  }

  saveSettings() {
    this.closePopup();
    this.events = {
      auth: false,
      streamStarting: false,
      streamStopped: false,
    };
  }
}
export class AddUrlComponent {
  urlForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.urlForm = this.fb.group({
      url: ['', Validators.required],  
      authentication: [false],         
      streamStarting: [false],         
      streamStopped: [false],          
    });
  }
  onSubmit() {
    if (this.urlForm.valid) {
      console.log('Form Data:', this.urlForm.value);
    } else {
      console.log('Form is invalid.');
    }
  }
  onCancel() {
    this.urlForm.reset();  
    console.log('Form reset');
  }
}