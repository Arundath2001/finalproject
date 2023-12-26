import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admindata/admin/admin.component';
import { EmployeeComponent } from './employeedata/employee/employee.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpService } from './http.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmptableComponent } from './admindata/emptable/emptable.component';
import { EmpprofileComponent } from './admindata/empprofile/empprofile.component';
import { EmpcreateComponent } from './admindata/empcreate/empcreate.component';
import { AuthGuard } from './auth.guard';
import { EmpdetailsComponent } from './employeedata/empdetails/empdetails.component';
import { EmpapplyleaveComponent } from './employeedata/empapplyleave/empapplyleave.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AuthService } from './auth.service';
import { AdmindetailsComponent } from './admindata/admindetails/admindetails.component';
import { EmpnavbarComponent } from './sidenavbar/empnavbar.component';
import { TopnavbarComponent } from './topnavbar/topnavbar.component';
import { TimedateComponent } from './timedate/timedate.component';
import { Empchart1Component } from './employeedata/empchart1/empchart1.component';
import { EmpleavetableComponent } from './employeedata/empleavetable/empleavetable.component';
import { EmpbarchartComponent } from './employeedata/empbarchart/empbarchart.component';
import { EmpreqleaveComponent} from './employeedata/empreqleave/empreqleave.component';
import { Adminchart1Component } from './admindata/adminchart1/adminchart1.component';
import { Adminbarchart1Component } from './admindata/adminbarchart1/adminbarchart1.component';
import { Adminbarchart2Component } from './admindata/adminbarchart2/adminbarchart2.component';
import { AdmintableComponent } from './admindata/admintable/admintable.component';
import { LogincountComponent } from './logincount/logincount.component';
import { AdminbtnComponent } from './admindata/adminbtn/adminbtn.component';
import { EmpleavedataComponent } from './admindata/empleavedata/empleavedata.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    EmployeeComponent,
    EmptableComponent,
    EmpprofileComponent,
    EmpcreateComponent,
    EmpdetailsComponent,
    EmpapplyleaveComponent,
    ChangepasswordComponent,
    AdmindetailsComponent,
    EmpnavbarComponent,
    TopnavbarComponent,
    TimedateComponent,
    Empchart1Component,
    EmpleavetableComponent,
    EmpbarchartComponent,
    EmpreqleaveComponent,
    Adminchart1Component,
    Adminbarchart1Component,
    Adminbarchart2Component,
    AdmintableComponent,
    LogincountComponent,
    AdminbtnComponent,
    EmpleavedataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  providers: [HttpService,AuthGuard,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
