import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-gestionusers',
  templateUrl: './gestionusers.component.html',
  styleUrls: ['./gestionusers.component.css']
})
export class GestionusersComponent {
  users: any[] = [];
  newUser: any = { email: '', password: '', role: 'apprenant' };
  selectedUser: any = null;
  showEditModal: boolean = false;
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        this.error = err.error.message || 'Erreur lors du chargement des utilisateurs';
      },
    });
  }

  onCreate(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.newUser = { email: '', password: '', role: 'apprenant' };
      },
      error: (err) => {
        this.error = err.error.message || 'Erreur lors de la création de l\'utilisateur';
      },
    });
  }

  openEditModal(user: any): void {
    this.selectedUser = { ...user, password: '' };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  onUpdate(): void {
    const updateData: any = {
      email: this.selectedUser.email,
      role: this.selectedUser.role,
    };
    if (this.selectedUser.password) {
      updateData.password = this.selectedUser.password;
    }

    this.userService.updateUser(this.selectedUser._id, updateData).subscribe({
      next: () => {
        this.loadUsers();
        this.closeEditModal();
      },
      error: (err) => {
        this.error = err.error.message || 'Erreur lors de la mise à jour de l\'utilisateur';
      },
    });
  }

  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = err.error.message || 'Erreur lors de la suppression de l\'utilisateur';
        },
      });
    }
  }
}
