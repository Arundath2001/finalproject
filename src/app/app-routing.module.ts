import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admindata/admin/admin.component';
import { EmployeeComponent } from './employeedata/employee/employee.component';
import { EmptableComponent } from './admindata/emptable/emptable.component';
import { EmpprofileComponent } from './admindata/empprofile/empprofile.component';
import { EmpcreateComponent } from './admindata/empcreate/empcreate.component';
import { EmpdetailsComponent } from './employeedata/empdetails/empdetails.component';
import { AuthGuard } from './auth.guard';
import { EmpapplyleaveComponent } from './employeedata/empapplyleave/empapplyleave.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AdmindetailsComponent } from './admindata/admindetails/admindetails.component';
import { EmpleavedataComponent } from './admindata/empleavedata/empleavedata.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard], data: { roles: ['employee'] } },
  { path: 'emptable', component: EmptableComponent },
  { path: 'empprofile/:id', component: EmpprofileComponent }, 
  { path: 'empcreate', component: EmpcreateComponent },
  { path: 'empdetails/:id', component: EmpdetailsComponent },
  {
    path: 'empapplyleave',
    component: EmpapplyleaveComponent,
    canActivate: [AuthGuard], // Add the AuthGuard here
    data: { roles: ['employee'] } // Specify the allowed roles
  },

  { path: 'changepassword/:userId', component: ChangepasswordComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] } },

  { path: 'admindetails/:id', component: AdmindetailsComponent },

  { path: 'empleavedata', component: EmpleavedataComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
