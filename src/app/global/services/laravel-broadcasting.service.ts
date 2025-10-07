import { inject, Injectable, signal } from '@angular/core';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService.service';

@Injectable({
  providedIn: 'root',
})
export class LaravelBroadcastingService {
  echo = signal<Echo<'reverb'> | null>(null);
  authService = inject(AuthService);

  constructor() {
    (window as any).Pusher = Pusher;

    this.echo.set(
      new Echo({
        broadcaster: 'reverb',
        key: environment.REVERB_APP_KEY,

        wsHost: environment.REVERB_HOST,

        wsPort: environment.REVERB_WS_PORT ?? 80,

        wssPort: environment.REVERB_WSS_PORT ?? 443,

        forceTLS: (environment.REVERB_SCHEME ?? 'https') === 'https',

        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${environment.REVERB_SCHEME}://${environment.REVERB_HOST}:${8000}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${this.authService._token()}`,
          },
        }
      })
    );
  }

  leaveChannel(channelName: string) {
    console.log('Canal para borrar: ', channelName);
    console.log('Before leave:', this.echo()?.connector.channels);
    this.echo()?.leaveChannel(channelName);
    console.log('After leave:', this.echo()?.connector.channels);
  }
}
