import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoResponse, CreateTodoRequest, UpdateTodoRequest } from '../models/todo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) { }

  getTodos(): Observable<TodoResponse> {
    return this.http.get<TodoResponse>(this.apiUrl);
  }

  getTodo(id: number): Observable<TodoResponse> {
    return this.http.get<TodoResponse>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: CreateTodoRequest): Observable<TodoResponse> {
    return this.http.post<TodoResponse>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: UpdateTodoRequest): Observable<TodoResponse> {
    return this.http.put<TodoResponse>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<TodoResponse> {
    return this.http.delete<TodoResponse>(`${this.apiUrl}/${id}`);
  }

  toggleComplete(todo: Todo): Observable<TodoResponse> {
    return this.updateTodo(todo.id!, { completed: !todo.completed });
  }
}
