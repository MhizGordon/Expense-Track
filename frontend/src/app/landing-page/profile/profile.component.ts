import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    // Initialize the reactive form with its controls and validation rules
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      occupation: ['', Validators.required],
      contact: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Getters for easier (and safer) form control access in your template
  get nameControl(): AbstractControl | null {
    return this.profileForm.get('name');
  }

  get ageControl(): AbstractControl | null {
    return this.profileForm.get('age');
  }

  get dobControl(): AbstractControl | null {
    return this.profileForm.get('dob');
  }

  get genderControl(): AbstractControl | null {
    return this.profileForm.get('gender');
  }

  get emailControl(): AbstractControl | null {
    return this.profileForm.get('email');
  }

  get occupationControl(): AbstractControl | null {
    return this.profileForm.get('occupation');
  }

  get contactControl(): AbstractControl | null {
    return this.profileForm.get('contact');
  }

  get addressControl(): AbstractControl | null {
    return this.profileForm.get('address');
  }

  // Load the user's profile data from the service
  loadUserProfile(): void {
    const userId = '67cd10046e506f915c4793ca'; // Replace with the actual user ID when available
    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        this.profileForm.patchValue(userData);
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.openSnackBar('Failed to load profile. Please try again!', 'Close');
      }
    });
  }

  // Submit the form to update the user's profile
  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.updateUser('your-user-id', this.profileForm.value).subscribe({
        next: (response) => {
          console.log('Profile updated successfully', response);
          this.openSnackBar('Profile updated successfully!', 'Close');
        },
        error: (err) => {
          console.error('Error updating profile', err);
          this.openSnackBar('Failed to update profile. Try again!', 'Close');
        }
      });
    } else {
      this.openSnackBar('Please fill in all fields correctly.', 'Close');
    }
  }

  // Display a notification using Material's snackbar
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
