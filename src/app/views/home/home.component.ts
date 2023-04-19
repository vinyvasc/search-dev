import { Component, Output, inject, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  usernameControl = new FormControl('');
  constructor( private router: Router ) {}

  onSearch() {
    this.router.navigate(['/perfil'], { queryParams: { username: this.usernameControl.value }});
  }
}
