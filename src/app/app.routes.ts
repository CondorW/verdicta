import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ForumComponent } from './components/forum/forum';
import { AdminComponent } from './components/admin/admin';
import { ManagePostsComponent } from './components/admin/manage-posts/manage-posts';
import { ManageUsersComponent } from './components/admin/manage-users/manage-users';
import { adminGuard } from './guards/admin.guard'; // Import the guard

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forum', component: ForumComponent },

  // New Admin Section Routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard], // Protect this parent route and all its children
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' }, // Default to manage-posts
      { path: 'posts', component: ManagePostsComponent },
      { path: 'users', component: ManageUsersComponent },
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];