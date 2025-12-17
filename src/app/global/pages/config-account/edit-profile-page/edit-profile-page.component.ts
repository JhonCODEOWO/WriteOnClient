import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { InputComponentComponent } from '../../../components/input-component/input-component.component';
import { AuthService } from '../../../../auth/services/AuthService.service';
import { ProfileImageComponent } from '../../../components/profile-image/profile-image.component';
import { UpdateUserRequest } from '../../../../auth/interfaces/update-user-request';
import { NotificationService } from '../../../../utils/notifications/services/notifications.service';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponentComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, ProfileImageComponent]
})
export class EditProfilePageComponent implements OnInit{
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  notificationService = inject(NotificationService);

  profileData = this.fb.nonNullable.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required]
  })

  get profileNameControl(){
    return this.profileData.get('name');
  }

  get actualPasswordControl(){
    return this.profileData.get('password');
  }

  ngOnInit(): void {
    this.profileData.patchValue({email: this.authService._userAuthenticated()?.email, name: this.authService._userAuthenticated()?.name});
  }

  onSubmitProfileData(){
    const {name, email, password} = this.profileData.value;
    if(this.profileData.invalid) return;

    const body: UpdateUserRequest = {
      name,
      email,
      actual_password: password,
    }

    this.authService.update(body).subscribe({
      next: (res) => {
        this.notificationService.success('Has actualizado tu información correctamente.');
        this.actualPasswordControl?.reset();
      },
      error: (error) => {

      }
    })
  }
}
