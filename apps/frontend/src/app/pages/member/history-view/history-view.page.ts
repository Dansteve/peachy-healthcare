import { Component, OnInit, } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api/api.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';


@Component({
  selector: 'peachy-healthcare-history-view',
  templateUrl: './history-view.page.html',
  styleUrls: ['./history-view.page.scss'],
})
export class HistoryViewPage implements OnInit {

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;
  isLoading = false;
  tab = 'Pharmacogenetic-Analysis';
  isInfoOpen = false;
  
  constructor(
    public screenSizeService: ScreenSizeService,
    public navController: NavController,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public helperMethods: HelperMethodsService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.screenSizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }

  ngOnInit() {
  }



  goTo(page = '') {
    const link = `/public/${page}`;
    // this.router.navigate([link],);
    this.navController.navigateForward(link, { animated: false });
  }


  goToMember(page = '') {
    const link = `/member/${page}`;
    // this.router.navigate([link],);
    this.navController.navigateForward(link, { animated: false });
  }

  openInfo() {
    this.isInfoOpen = !this.isInfoOpen;
  }

  
}
