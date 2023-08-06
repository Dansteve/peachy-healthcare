/* eslint-disable @angular-eslint/contextual-lifecycle */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnDestroy, OnInit {

  public status: ConnectionStatus;
  private _status: BehaviorSubject<ConnectionStatus | null> = new BehaviorSubject(null as any);

  private networkStatus: ConnectionStatus;
  private networkListener: PluginListenerHandle;
  private noNetworkMessage: HTMLIonToastElement;


  constructor(
    public toastController: ToastController,
  ) {
    this.noNetworkMessageInit();
  }

  async ngOnInit() {
    this.noNetworkMessage = await this.successToast(`Hmm... you're not connected to the Internet `, 'top', 'danger', 10000);
  }

  async noNetworkMessageInit() {
    this.noNetworkMessage = await this.successToast(`Hmm... you're not connected to the Internet `, 'top', 'danger', 10000);
  }

  public initializeNetworkSubscription(): void {
    this.networkListener = Network.addListener('networkStatusChange', (networkStatus: ConnectionStatus) => {
      this.setStatus(networkStatus);
      if (!networkStatus.connected) {
        this.noNetworkMessage.present().then((res) => console.log(res)).catch((error) => console.log(error));
      } else {
        this.noNetworkMessage.dismiss();
      }
      console.log('Network status changed', networkStatus);
      this.networkStatus = networkStatus;
    });
  }

  public getNetworkType(): string {
    return this.networkStatus.connectionType;
  }

  public getNetworkStatus(): Observable<ConnectionStatus | null> {
    return this._status.asObservable();
  }

  public async getCurrentNetworkStatus(): Promise<ConnectionStatus> {
    return await Network.getStatus();
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this._status.next(this.status);
  }

  ngOnDestroy() {
    this.networkListener.remove();
  }

  async successToast(
    message: string,
    position: 'top' | 'bottom' | 'middle' = 'top',
    color = 'light',
    duration = 2000,
    cssClass = 'text-align'): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message,
      position,
      color,
      duration,
      cssClass
    });
    return toast;
  }
}
