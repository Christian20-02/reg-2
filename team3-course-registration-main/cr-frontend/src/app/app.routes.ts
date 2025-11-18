import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CourseBrowsingComponent } from './course-browsing/course-browsing';
import { CourseManagementComponent } from './course-management/course-management';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CourseBrowsingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: CourseManagementComponent },
  { path: '**', redirectTo: 'login' },
];
