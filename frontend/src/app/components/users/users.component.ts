import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  selectedUser: User | null = null;
  newRole = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  openRoleModal(user: User): void {
    this.selectedUser = user;
    this.newRole = user.role;
  }

  closeModal(): void {
    this.selectedUser = null;
    this.newRole = '';
  }

  updateRole(): void {
    if (!this.selectedUser) return;

    this.loading = true;
    this.error = '';

    this.userService.updateUserRole(this.selectedUser.id, this.newRole).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
          if (index !== -1) {
            this.users[index].role = this.newRole;
          }
          this.closeModal();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating role:', err);
        this.error = err.error?.message || 'Failed to update role';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/todos']);
  }
}
