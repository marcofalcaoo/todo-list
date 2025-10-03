import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo, CreateTodoRequest } from '../../models/todo.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  currentUser: User | null = null;
  loading = false;
  error = '';
  
  // New todo form
  newTodo: CreateTodoRequest = {
    title: '',
    description: '',
    completed: false
  };
  
  // Edit mode
  editingTodo: Todo | null = null;
  editForm: Todo = { title: '', description: '', completed: false };

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = '';

    this.todoService.getTodos().subscribe({
      next: (response) => {
        if (response.success && response.todos) {
          this.todos = response.todos;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading todos:', err);
        this.error = 'Failed to load todos';
        this.loading = false;
      }
    });
  }

  createTodo(): void {
    if (!this.newTodo.title.trim()) {
      this.error = 'Title is required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.todoService.createTodo(this.newTodo).subscribe({
      next: (response) => {
        if (response.success && response.todo) {
          this.todos.unshift(response.todo);
          this.newTodo = { title: '', description: '', completed: false };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creating todo:', err);
        this.error = err.error?.message || 'Failed to create todo';
        this.loading = false;
      }
    });
  }

  startEdit(todo: Todo): void {
    this.editingTodo = todo;
    this.editForm = { ...todo };
  }

  cancelEdit(): void {
    this.editingTodo = null;
    this.editForm = { title: '', description: '', completed: false };
  }

  saveEdit(): void {
    if (!this.editingTodo || !this.editForm.title.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.todoService.updateTodo(this.editingTodo.id!, {
      title: this.editForm.title,
      description: this.editForm.description,
      completed: this.editForm.completed
    }).subscribe({
      next: (response) => {
        if (response.success && response.todo) {
          const index = this.todos.findIndex(t => t.id === response.todo!.id);
          if (index !== -1) {
            this.todos[index] = response.todo;
          }
          this.cancelEdit();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating todo:', err);
        this.error = err.error?.message || 'Failed to update todo';
        this.loading = false;
      }
    });
  }

  toggleComplete(todo: Todo): void {
    this.todoService.toggleComplete(todo).subscribe({
      next: (response) => {
        if (response.success && response.todo) {
          const index = this.todos.findIndex(t => t.id === response.todo!.id);
          if (index !== -1) {
            this.todos[index] = response.todo;
          }
        }
      },
      error: (err) => {
        console.error('Error toggling todo:', err);
        this.error = err.error?.message || 'Failed to update todo';
      }
    });
  }

  deleteTodo(todo: Todo): void {
    if (!confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.todoService.deleteTodo(todo.id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.todos = this.todos.filter(t => t.id !== todo.id);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error deleting todo:', err);
        this.error = err.error?.message || 'Failed to delete todo';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Force logout even if API call fails
        this.authService.forceLogout();
        this.router.navigate(['/login']);
      }
    });
  }
}
