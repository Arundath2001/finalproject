import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; 
import { HttpService } from '../http.service';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.scss']
})
export class TopnavbarComponent implements OnInit {
  loggedInUser: any;
  showDropdown: boolean = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  users: any[] = [];
  showMessageDropdown: boolean = false; 
  isMouseOverAlertButton: boolean = false; 

  

  constructor(private authService: AuthService, private router: Router,private httpService: HttpService) {
    this.loggedInUser = this.httpService.getLoggedInUser();

  } 

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  logout(): void {
    this.authService.logout();
  }

  searchUsers(): void {
    if (this.loggedInUser.rank === 'admin') {
      this.httpService.searchUsersAdmin(this.searchQuery).subscribe(
        (results) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Error searching users:', error);
          this.searchResults = [];
        }
      );
    } else {
      this.httpService.searchUsersEmployee(this.searchQuery).subscribe(
        (results) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Error searching users:', error);
          this.searchResults = [];
        }
      );
    }
  }

  navigateToUserDetails(userId: number): void {
    if (this.loggedInUser.rank === 'admin') {
      this.router.navigate(['/admindetails', userId]);
    } else {
      this.router.navigate(['/empdetails', userId]);
    }
  }

  getSearchPlaceholder(): string {
    return this.loggedInUser.rank === 'admin' ? 'Search user by ID or name' : 'Search your leaves';
  }

  showAlert(): void {
    if (this.loggedInUser.rank !== 'admin' && this.loggedInUser.message) {
      this.showMessageDropdown = true;
    }
  }

  hideMessageDropdown(): void {
    if (!this.isMouseOverAlertButton) {
      this.showMessageDropdown = false;
    }
  }

  handleAlertButtonMouseOver(): void {
    this.isMouseOverAlertButton = true;
  }

  handleAlertButtonMouseLeave(): void {
    this.isMouseOverAlertButton = false;
    this.hideMessageDropdown();
  }
viewUserDetails(user: any): void {
  this.router.navigate([`/admindetails/${user.id}`]);
}

}
