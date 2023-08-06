import { Component, HostListener } from '@angular/core';
import { ScreenSizeService } from './services/screen-size/screen-size.service';
@Component({
  selector: 'peachy-healthcare-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  constructor(
    public screenSizeService: ScreenSizeService,
  ) {
    //noop
  }

  @HostListener('window:resize', ['$event'])
  redoResize(event: any) {
    this.screenSizeService.onResize(event.target.innerWidth, event.target.innerHeight);
  }

  @HostListener('window:orientationchange', ['$event'])
  redoOrientationChange(event: any) {
    this.screenSizeService.onResize(event.target.innerWidth, event.target.innerHeight);
  }

}

