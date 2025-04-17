import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReviewService } from './services/review.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { CoursesComponent } from './components/course/course.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GestionformationComponent } from './components/gestionformation/gestionformation.component';
import { GestionusersComponent } from './components/gestionusers/gestionusers.component';
import { AdminGuard } from './guards/admin.guard';
import { CoursedetailsComponent } from './components/coursedetails/coursedetails.component';
import { EnrollementComponent } from './components/enrollement/enrollement.component';
import { GestionmessagesComponent } from './components/gestionmessages/gestionmessages.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    AboutComponent,
    CoursesComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    GestionformationComponent,
    GestionusersComponent,
    CoursedetailsComponent,
    EnrollementComponent,
    GestionmessagesComponent,
    NavbarComponent,
    AdminReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule

  ],
  providers: [AdminGuard , ReviewService],
  bootstrap: [AppComponent]
})
export class AppModule { }
