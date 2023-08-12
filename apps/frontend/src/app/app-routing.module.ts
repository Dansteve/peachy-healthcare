import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    title: 'Public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    loadChildren: () => import('./pages/public/public-routing.module').then(m => m.PublicRoutingModule)
  },
  {
    path: 'member',
    loadChildren: () => import('./pages/member/member-routing.module').then(m => m.MemberRoutingModule)
  },
  {
    path: '**',
    redirectTo: 'public',
    pathMatch: 'full'
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
