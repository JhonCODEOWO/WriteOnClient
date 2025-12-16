import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { InputComponentComponent } from '../../../components/input-component/input-component.component';
import { AuthService } from '../../../../auth/services/AuthService.service';
import { ProfileImageComponent } from '../../../components/profile-image/profile-image.component';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponentComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, ProfileImageComponent]
})
export class EditProfilePageComponent implements OnInit{
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  profileData = this.fb.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required]
  })

  get profileNameControl(){
    return this.profileData.get('name');
  }

  ngOnInit(): void {
    this.profileData.patchValue({email: this.authService._userAuthenticated()?.email, name: this.authService._userAuthenticated()?.name});
  }
}
