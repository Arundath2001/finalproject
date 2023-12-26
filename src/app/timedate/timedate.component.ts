import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-timedate',
  templateUrl: './timedate.component.html',
  styleUrls: ['./timedate.component.scss']
})
export class TimedateComponent implements OnInit {
  currentDate!: string;
  currentTime!: string;
  dashboardLink: string = '';
  loggedInUser : any;
  constructor(private authService: AuthService) {
   }
   

   ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser(); 
    this.updateDateTime(); 
    setInterval(() => {
      this.updateDateTime(); 
    }, 1000);
  }


  updateDateTime(): void {
    const now = new Date();
    
    this.currentDate = now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  getDetailsLink(): string {
    return this.loggedInUser?.rank === 'admin' ? '/admindetails/' + this.loggedInUser?.id : '/empdetails/' + this.loggedInUser?.id;
  }

}
