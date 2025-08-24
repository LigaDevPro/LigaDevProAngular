import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Home } from './home/home';
import { Register } from './register/register';
import { FormTournament } from './form-tournament/form-tournament';


export const routes: Routes = [
  { path: 'about', component: About },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'form-tournament', component: FormTournament },
  { path: '', component: Home },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
