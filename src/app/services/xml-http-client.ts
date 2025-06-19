import { HttpClient, HttpHandler, HttpXhrBackend } from '@angular/common/http';

export class XMLHttpRequestHttpClient extends HttpClient {
  constructor() {
    super(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
  }
}
