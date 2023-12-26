import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-adminbtn',
  templateUrl: './adminbtn.component.html',
  styleUrls: ['./adminbtn.component.scss']
})
export class AdminbtnComponent {
  constructor(private router: Router) {}

  navigateToEmpCreate(): void {
    this.router.navigate(['/empcreate']);
  }

  navigateToEmpTable(): void {
    this.router.navigate(['/emptable']);
  }

  navigateToEmpLeaveTable(): void {
    this.router.navigate(['/empleavedata']);
  }
}
