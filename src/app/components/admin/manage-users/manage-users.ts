import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.html',
})
export class ManageUsersComponent {
  private userService = inject(UserService);
  public users$: Observable<UserProfile[]> = this.userService.getAllUsers();

  onRoleChange(uid: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value as 'User' | 'Admin';
    this.userService.updateUserRole(uid, newRole)
      .then(() => console.log(`Role updated for user ${uid}`))
      .catch(err => console.error(err));
  }
}