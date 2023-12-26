import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empprofile',
  templateUrl: './empprofile.component.html',
  styleUrls: ['./empprofile.component.scss']
})
export class EmpprofileComponent implements OnInit {
  userId: number | null = null; 
  user: any;
  isEditing: boolean = false;
  fieldInEditMode: string | null = null; 
  editableFields: string[] = ['username', 'role', 'email', 'mobileNumber', 'age', 'dob', 'image', 'bloodGroup', 'gender'];

  constructor(private route: ActivatedRoute, private httpService: HttpService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = +params.get('id')!;
      this.fetchUserDetails();
    });
  }

  fetchUserDetails(): void {
    if (this.userId !== null) { 
      this.httpService.getUsers().subscribe(
        (users) => {
          this.user = users.find((u: { id: number | null; }) => u.id === this.userId);
          if (!this.user) {
            console.error('User not found');
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }

  toggleEditMode(field: string | null): void {
    if (this.isEditing) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You have unsaved changes. Are you sure you want to Cancel?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Cancel!',
        cancelButtonText: 'No, keep editing',
      }).then((result) => {
        if (result.isConfirmed) {
          this.doToggleEditMode(field);
        }
      });
    } else {
      this.doToggleEditMode(field);
    }
  }

  doToggleEditMode(field: string | null): void {
    this.isEditing = !this.isEditing;
    this.fieldInEditMode = field;
  }

  saveUserProfile(): void {
    this.httpService.updateUser(this.user).subscribe(
      () => {
        console.log('User details updated successfully');
        this.toggleEditMode(null);
      },
      (error) => {
        console.error('Error updating user details:', error);
      }
    );
  }

  saveAndToggleEditMode(property: string | null): void {
    this.httpService.updateUser(this.user).subscribe(
      () => {
        console.log('User details updated successfully');
        this.isEditing = false; 
        Swal.fire('Success', 'User details updated successfully', 'success');
      },
      (error) => {
        console.error('Error updating user details:', error);
        Swal.fire('Error', 'Failed to update user details', 'error');
      }
    );
  }
  
  onFileChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.user.image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

}
