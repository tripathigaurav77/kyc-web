import { Injectable, enableProdMode } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoggerService {
  log(data) {
    console.log();
  }
}
