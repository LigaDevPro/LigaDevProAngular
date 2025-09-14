import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './auth/login/login';
import { Home } from './pages/home/home';
import { Register } from './auth/register/register';
import { FormTournament } from './auth/form-tournament/form-tournament';
import { FormTeam } from './auth/form-team/form-team';

export const routes: Routes = [
  { path: 'about', component: About },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'form-tournament', component: FormTournament },
  { path: 'form-team', component: FormTeam },
  { path: '', component: Home },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}