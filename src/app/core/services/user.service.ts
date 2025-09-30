import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserDetail, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersEndpoint = 'users';

  constructor(private apiService: ApiService) { }

  getUserById(userId: string): Observable<UserDetail> {
    return this.apiService.get<UserDetail>(`${this.usersEndpoint}/${userId}`);
  }

  updateUser(userId: string, updateRequest: UpdateProfileRequest): Observable<UserDetail> {
    return this.apiService.put<UserDetail>(`${this.usersEndpoint}/${userId}`, updateRequest);
  }

  deleteUser(userId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.usersEndpoint}/${userId}`);
  }

  changePassword(userId: string, changePasswordRequest: ChangePasswordRequest): Observable<void> {
    return this.apiService.post<void>(`${this.usersEndpoint}/${userId}/change-password`, changePasswordRequest);
  }
}