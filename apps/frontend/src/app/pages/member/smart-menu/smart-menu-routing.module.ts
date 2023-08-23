import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../../../guard/auth.guard';
import { DataResolverService } from '../../../services/resolver/data-resolver.service';
import { SmartMenuPage } from './smart-menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/member/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SmartMenuPage,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        // canActivate: [AuthGuard],
        resolve: {
          special: DataResolverService,
        },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then((m) => m.DashboardPageModule),
      },
      {
        path: 'profile',
        title: 'Profile',
        // canActivate: [AuthGuard],
        resolve: {
          special: DataResolverService,
        },
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'history',
        title: 'History',
        // canActivate: [AuthGuard],
        children: [
          {
            path: '',
            resolve: {
              special: DataResolverService,
            },
            loadChildren: () =>
              import('../history/history.module').then((m) => m.HistoryPageModule),
          },
          {
            path: ':id',
            resolve: {
              special: DataResolverService,
            },
            loadChildren: () =>
              import('../history-view/history-view.module').then((m) => m.HistoryViewPageModule),
          }
        ]
      },
      {
        path: 'my-test',
        title: 'My Test',
        // canActivate: [AuthGuard],
        resolve: {
          special: DataResolverService,
        },
        loadChildren: () =>
          import('../my-test/my-test.module').then((m) => m.MyTestPageModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartMenuPageRoutingModule { }
