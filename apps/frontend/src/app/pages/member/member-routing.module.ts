import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';
import { DataResolverService } from '../../services/resolver/data-resolver.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    resolve: {
      special: DataResolverService
    },
    canActivate: [AuthGuard],
    // loadChildren: () => import('./smart-menu/smart-menu.module').then(m => m.SmartMenuPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
