import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, switchMap, take } from 'rxjs';
import { AuthService, UserProfile } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  // Define the ranks available for selection
  public ranks = ['Student', 'Konzipient', 'Rechtsanwalt', 'Richter', 'Staatsanwalt'];

  constructor() {
    this.profileForm = this.fb.group({
      uid: [''], // Will be hidden but needed for the update
      email: [{ value: '', disabled: true }], // Email is not editable
      displayName: ['', Validators.required],
      rank: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load the current user's data and pre-fill the form
    this.authService.userProfile$.pipe(
      filter((profile): profile is UserProfile => profile !== null), // Ensure profile is not null
      take(1) // Take the first value and complete
    ).subscribe(profile => {
      this.profileForm.patchValue(profile);
    });
  }

  async onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = null;

    const formValue = this.profileForm.getRawValue();
    const uid = formValue.uid;
    const dataToUpdate: Partial<UserProfile> = {
      displayName: formValue.displayName,
      rank: formValue.rank,
    };

    try {
      await this.userService.updateUserProfile(uid, dataToUpdate);
      this.successMessage = 'Profile updated successfully!';
    } catch (error) {
      console.error('Error updating profile:', error);
      this.successMessage = 'Failed to update profile.';
    } finally {
      this.isLoading = false;
    }
  }
}