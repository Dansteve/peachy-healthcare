import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataResolverService } from '../../services/resolver/data-resolver.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'index',
    title: 'Healthcare Home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'home',
    title: 'Healthcare Home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'login',
    title: 'Login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'reset-password',
    children: [
      {
        path: '',
        title: 'Reset Password',
        loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
      },
      {
        path: ':resetId',
        title: 'Reset Password',
        loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
      }
    ],
  },
  {
    path: 'forget-password',
    title: 'Forget Password',
    loadChildren: () =>
      import('./forget-password/forget-password.module').then((m) => m.ForgetPasswordPageModule),
  },
  {
    path: 'register',
    title: 'Register',
    resolve: {
      special: DataResolverService
    },
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
