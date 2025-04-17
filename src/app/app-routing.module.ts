import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { CoursesComponent} from './components/course/course.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestionformationComponent } from './components/gestionformation/gestionformation.component';
import { GestionusersComponent } from './components/gestionusers/gestionusers.component';
import { AdminGuard } from './guards/admin.guard';
import { CoursedetailsComponent } from './components/coursedetails/coursedetails.component';
import { EnrollementComponent } from './components/enrollement/enrollement.component';
import { GestionmessagesComponent } from './components/gestionmessages/gestionmessages.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'course', component: CoursesComponent },
  { path: 'course/:id', component: CoursedetailsComponent },
  { path: 'dash', component: DashboardComponent },
  { path: 'admin/users', component: GestionusersComponent, canActivate: [AdminGuard] },
  { path: 'admin/course', component: GestionformationComponent },
  { path: 'admin/messages', component: GestionmessagesComponent },
  { path: 'enrollment/:id', component: EnrollementComponent },
  { path: 'admin/review', component: AdminReviewsComponent },
  { path: '', redirectTo: '/courses', pathMatch: 'full' }
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }