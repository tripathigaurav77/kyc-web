import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable()
export class AppConfig {
  private config: Object = null;

  constructor(private http: HttpClient) {}

  public getConfig(key: any) {
    return this.config[key];
  }

  public load() {
    return new Promise((resolve, reject) => {
      this.http.get("config.json").subscribe(envResponse => {
        this.config = envResponse;

        resolve(true);
      });
    });
  }
}
