import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {

  public widthSize = new BehaviorSubject<number>(window.innerWidth);
  public heightSize = new BehaviorSubject<number>(window.innerHeight);
  public isDesktop = new BehaviorSubject<boolean>(false);

  constructor() {
    this.onResize(this.widthSize.value, this.heightSize.value);
  }


  @HostListener('window:resize', ['$event'])
  redoResize(event: any) {
    this.onResize(event.target.innerWidth, event.target.innerHeight);
  }

  @HostListener('window:orientationchange', ['$event'])
  redoOrientationChange(event: any) {
    this.onResize(event.target.innerWidth, event.target.innerHeight);
  }

  onResize(widthSize: number, heightSize: number): void {
    if (widthSize < 992) {
      this.isDesktop.next(false);
    } else {
      this.isDesktop.next(true);
    }
    this.widthSize.next(widthSize);
    this.heightSize.next(heightSize);
    console.warn(this.widthSize.value, widthSize, this.isDesktop.value);
  }

  isDesktopView(): Observable<boolean> {
    return this.isDesktop.asObservable().pipe(distinctUntilChanged());
  }


}
