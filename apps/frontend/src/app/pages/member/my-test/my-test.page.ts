import { Component, OnInit, } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { TakeTestComponent } from '../../../components/take-test/take-test.component';
import { TestCongratulationsComponent } from '../../../components/test-congratulations/test-congratulations.component';
import { ApiService } from '../../../services/api/api.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';

@Component({
  selector: 'peachy-healthcare-my-test',
  templateUrl: './my-test.page.html',
  styleUrls: ['./my-test.page.scss'],
})
export class MyTestPage implements OnInit {

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;
  isLoading = false;
  step = 1;
  pricing = 'year';
  basicPlan = [
    'Personalized Health and Medication Report',
    'Pharmacogenetic Analysis',
    'Lifestyle Questionnaire Analysis',
    'Personalized Medication Recommendations',
    'Lifestyle Guidance',
    'Email Support'
  ];
  enhancedPlan = [
    'Personalized Health and Medication Report',
    'Pharmacogenetic Analysis & Insights',
    'Lifestyle Questionnaire Analysis',
    'Personalized Medication Recommendations',
    'Lifestyle Guidance',
    'Lifestyle Assessment and Recommendations',
    'Supportive Supplement Recommendations',
    '1 Phone Consultation with a Health Expert',
    'Access to Webinars on Health and Lifestyle',
    'Email Support'
  ];
  premiumPlan = [
    'Personalized Health and Medication Report',
    'Pharmacogenetic Analysis',
    'Lifestyle Questionnaire Analysis',
    'Personalized Medication Recommendations',
    'Lifestyle Guidance',
    '2 Additional Phone Consultations with Experts',
    'Ongoing Medication Monitoring & Adjustments',
    'Quarterly Genetic Update Reports',
    'Exclusive Access to Health Workshops',
    'Dedicated Customer Success Manager',
    'Phone and Email Support',
    'Email Support'
  ]

  constructor(
    public screenSizeService: ScreenSizeService,
    public navController: NavController,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public modalController: ModalController,
    public helperMethods: HelperMethodsService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.screenSizeService.isDesktopView().subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }

  ngOnInit() {
    // this.showTakeTestModal();
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

  /**
   * Get class name
   */
  getClassName() {
    return 'MyTestPage';
  }

  ionViewDidEnter(){
  }


  async showTakeTestModal() {
    const modal = await this.modalController.create({
      component: TakeTestComponent,
      backdropDismiss: true,
      animated: true,
      componentProps: {  isModal: true },
      cssClass: this.helperMethods.getModalStyleFull(this.screenSizeService.widthSize.value) + ' big-modal',
    });
    this.apiService.storeModal(modal);
    await modal.present();
    await modal.onDidDismiss().then((data) => {
      // console.log(data);
      this.apiService.removeModal(modal);
    });
  }

  async showTestCongratulationsModal() {
    const modal = await this.modalController.create({
      component: TestCongratulationsComponent,
      backdropDismiss: true,
      animated: true,
      componentProps: { isModal: true },
      cssClass: this.helperMethods.getModalStyleFull(this.screenSizeService.widthSize.value) + ' big-modal',
    });
    this.apiService.storeModal(modal);
    await modal.present();
    await modal.onDidDismiss().then((data) => {
      // console.log(data);
      this.apiService.removeModal(modal);
      this.goToMember('history')
    });
  }

  goForward() {
    if (this.step < 4) {
      this.step++;
    }
  }

  goBack() {
    if (this.step > 1) {
      this.step--;
    }
  }
}
