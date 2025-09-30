import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest, TransactionType } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categoriesEndpoint = 'categories';

  constructor(private apiService: ApiService) { }

  getCategoriesByUser(userId: string): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.categoriesEndpoint}/user/${userId}`);
  }

  getCategoriesByType(userId: string, type: TransactionType): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.categoriesEndpoint}/user/${userId}/type/${type}`);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.apiService.get<Category>(`${this.categoriesEndpoint}/${id}`);
  }

  createCategory(userId: string, category: CreateCategoryRequest): Observable<Category> {
    return this.apiService.post<Category>(`${this.categoriesEndpoint}/user/${userId}`, category);
  }

  updateCategory(id: string, category: UpdateCategoryRequest): Observable<Category> {
    return this.apiService.put<Category>(`${this.categoriesEndpoint}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.categoriesEndpoint}/${id}`);
  }

  getDefaultCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.categoriesEndpoint}/default`);
  }
}