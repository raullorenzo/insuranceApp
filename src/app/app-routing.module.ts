// Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './pages/home/home.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { StatementComponent } from './pages/statement/statement.component';
import { InsurancesComponent } from './pages/insurances/insurances.component';
import { AllInsurancesComponent } from './pages/all-insurances/all-insurances.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'insurances', component: InsurancesComponent },
  { path: 'all-insurances', component: AllInsurancesComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'statement', component: StatementComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {
      enableTracing: true,
      useHash: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
