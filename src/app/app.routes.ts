import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ForumComponent } from './components/forum/forum';
import { PostDetailComponent } from './components/post-detail/post-detail';
import { ProfileComponent } from './components/profile/profile';
import { AdminComponent } from './components/admin/admin';
import { ManagePostsComponent } from './components/admin/manage-posts/manage-posts';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth-guard'; // Corrected import path

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'post/:id', component: PostDetailComponent },
  // New protected profile route
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: ManagePostsComponent },
      { path: 'users', component: ManageUsersComponent },
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];