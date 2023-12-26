import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:3000/users';
  get: any;


  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]); 
        })
      );
  }

  getUserByUsernameAndPassword(username: string, password: string): Observable<any> {
    return this.getUsers().pipe(
      map((data) => {
        console.log('All users:', data);
  
        if (data && Array.isArray(data)) {
          const user = data.find((u: any) => {
            console.log(`Checking user: ${u.username}, Password: ${u.password}`);
            return u.username === username && u.password === password;
          });
  
          console.log('Found user:', user);
          return user || null; 
        } else {
          console.log('No users found.');
          return null;
        }
      })
    );
  }
  getTotalUsersCount(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return [];
      }),
      tap(users => console.log('Users:', users)),
      map(users => users ? users.length : 0)
    );
  }
  
  
  
  
  


  deleteEmployee(userId: number): Observable<any> {
    const deleteUserUrl = `${this.apiUrl}/${userId}`;
    return this.http.delete<any>(deleteUserUrl);
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee);
  }

  isDuplicate(value: string, field: string): Observable<boolean> {
    const duplicateCheckUrl = `${this.apiUrl}?${field}=${value}`;
    return this.http.get<any[]>(duplicateCheckUrl).pipe(
      map(users => users.length > 0),
      catchError(() => of(false))
    );
  }

  getLoggedInUser(userId: number | null = null): Observable<any> {
    const url = userId ? `${this.apiUrl}/${userId}` : this.apiUrl;
  
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return of(null);
      })
    );
  }
  

  authenticateUser(username: string, password: string): Observable<any> {
    return this.getUsers().pipe(
      map((data) => {
        console.log('All users:', data);

        if (data && Array.isArray(data.users)) {
          const user = data.users.find(
            (u: any) => u.username === username && u.password === password
          );

          console.log('Found user:', user);
          return user || null; 
        } else {
          console.log('No users found.');
          return null;
        }
      })
    );
  }

  getLeaveData(userId: number): Observable<any[]> {
    const leaveDataUrl = `${this.apiUrl}/${userId}/leave`; 
    return this.http.get<any[]>(leaveDataUrl).pipe(
      catchError((error) => {
        console.error('Error fetching leave data:', error);
        return of([]); 
      })
    );
  }
  updateUserField(userId: number, field: string, value: any): Observable<any> {
    const updateUserFieldUrl = `${this.apiUrl}/${userId}`;
    const updatedUser = { [field]: value }; 
    return this.http.put<any>(updateUserFieldUrl, updatedUser);
  }
  
  getUser(userId: number): Observable<any> {
    const userUrl = `${this.apiUrl}/${userId}`;
    return this.http.get<any>(userUrl).pipe(
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return of(null); 
      })
    );
  }
  
  
  updateMessage(userId: number, message: string): Observable<any> {
    const updateMessageUrl = `${this.apiUrl}/${userId}`;
    const updatedMessage = { message: message }; 
    return this.http.patch<any>(updateMessageUrl, updatedMessage);
  }

  applyLeave(userId: number, leaveData: any): Observable<any> {
    const applyLeaveUrl = `${this.apiUrl}/${userId}/apply-leave`;
    return this.http.post<any>(applyLeaveUrl, leaveData);
  }

  createLeave(userId: number, newLeave: any): Observable<any> {
    const leaveUrl = `${this.apiUrl}/${userId}/leave`;

    return this.http.post<any>(leaveUrl, newLeave).pipe(
      catchError((error) => {
        console.error('Error creating leave:', error);
        return of(null);
      })
    );
  }

  createLeaveWithNewLid(userId: number, newLeave: any): Observable<any> {
    const createLeaveUrl = `${this.apiUrl}/${userId}/leave`;
  
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return of(null); 
      }),
      switchMap((userData) => {
        if (userData && userData.leaveDetails) {
          const newLid = this.generateNewLid(userData.leaveDetails);
  
          newLeave.Lid = newLid;
          userData.leaveDetails.push(newLeave);
  
          const payload = { leaveDetails: userData.leaveDetails };
  
          return this.updateUserField(userId, 'leaveDetails', payload);
        } else {
          console.error('User details or leaveDetails not found.');
          return of(null);
        }
      })
    );
  }
  
  
  
  
  updateUser(user: any): Observable<any> {
    const updateUserUrl = `${this.apiUrl}/${user.id}`;
    return this.http.put<any>(updateUserUrl, user).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return of(null);
      })
    );
  }
  
  
  
  
  private generateNewLid(leaveDetails: any[]): number {
    // Generate a new Lid based on the existing leaveDetails
    const existingLids = leaveDetails.map((leave) => leave.Lid);
    return Math.max(0, ...existingLids) + 1;
  }

  updatePassword(userId: number, newPassword: string): Observable<any> {
    const updatePasswordUrl = `${this.apiUrl}/${userId}`;
    const updatedUser = { password: newPassword }; // Create an object with the updated password

    return this.http.patch<any>(updatePasswordUrl, updatedUser).pipe(
      catchError((error) => {
        console.error('Error updating password:', error);
        return of(null);
      })
    );
  }

  checkPhoneNumber(userId: number, phoneNumber: string): Observable<boolean> {
    const userUrl = `${this.apiUrl}/${userId}`;

    return this.http.get<any>(userUrl).pipe(
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return of(null); // Return null in case of an error
      }),
      map((user) => {
        return user && user.mobileNumber === phoneNumber;
      })
    );
  }

  searchUsersAdmin(query: string): Observable<any[]> {
    const searchUrl = `${this.apiUrl}?id=${query}`;
    return this.http.get<any[]>(searchUrl).pipe(
      catchError(() => of([]))
    );
  }
  
  searchUsersEmployee(query: string): Observable<any[]> {
    const searchUrl = `${this.apiUrl}?lid=${query}`;
    return this.http.get<any[]>(searchUrl).pipe(
      catchError(() => of([]))
    );
  }

  

}
