import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api/api.service';
import { HelperMethodsService } from '../../../services/helper-methods/helper-methods.service';
import { ScreenSizeService } from '../../../services/screen-size/screen-size.service';

@Component({
  selector: 'peachy-healthcare-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  showPassword = false;
  isLoading = false;

  readonly isPwa: Readonly<boolean> = environment.isPwa;
  protected isDesktop!: boolean;
  pricing = 'year';
  basicPlan = [
    'Personalized Health and Medication Report',
    'Pharmacogenetic Analysis',
    'Lifestyle Questionnaire Analysis',
    'Personalized Medication Recommendations',
    'Lifestyle Guidance',
    'Email Support'
  ]
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
    public helperMethods: HelperMethodsService
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
}
