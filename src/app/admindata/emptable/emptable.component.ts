import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emptable',
  templateUrl: './emptable.component.html',
  styleUrls: ['./emptable.component.scss'],
  providers: [FormsModule],

})
export class EmptableComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  users: any[] = [];  
  imagePath = '/assets/images/logo.png';


  constructor(private router: Router, private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.getUsers().pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of([]); 
      })
    ).subscribe((users) => {
      this.employees = users.filter((user: { rank: string; }) => user.rank !== 'admin');
      this.filteredEmployees = [...this.employees]; 
      this.filterEmployees(); 
    });
  }

  editEmployee(employee: any): void {
    this.router.navigate(['/empprofile', employee.id]);
  }

  deleteEmployee(userId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.deleteEmployee(userId).subscribe(
          () => {
            this.employees = this.employees.filter((user) => user.id !== userId);
            this.filteredEmployees = [...this.employees]; 
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Unable to delete user.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'User deletion was cancelled', 'info');
      }
    });
  }
  
  filterEmployees(): void {
    console.log('Search Term:', this.searchTerm);
    const term = this.searchTerm.toLowerCase();
    console.log('Employees:', this.employees);
    this.filteredEmployees = this.employees.filter((employee) =>
      employee.username.toLowerCase().includes(term) || employee.id.toString().includes(term)
    );
    console.log('Filtered Employees:', this.filteredEmployees);
  }

  calculateTotalLeaves(user: any): number {
    if (user && user.leaves) {
      const leavesArray: number[] = Object.values(user.leaves);
      return leavesArray.reduce((total: number, leaves: number) => total + leaves, 0);
    }
    return 0;
  }


  getLeaveCountStyle(totalLeaves: number): any {
    if (totalLeaves >= 10) {
      return { 'color': 'red' };
    } else if (totalLeaves >= 5 && totalLeaves < 10) {
      return { 'color': 'yellow' };
    } else if (totalLeaves < 5) {
      return { 'color': 'green' };
    } else {
      return {};
    }
  }
  
  isButtonActive(totalLeaves: number): boolean {
    return totalLeaves >= 10;
  }

  updateMessage(employeeId: number): void {
    Swal.fire({
      title: 'Enter new message',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newMessage = result.value;
        this.httpService.updateMessage(employeeId, newMessage).subscribe(
          () => {
            console.log('Message updated in db.json');
          },
          (error) => {
            console.error('Error updating message:', error);
          }
        );
      }
    });
  }


}
