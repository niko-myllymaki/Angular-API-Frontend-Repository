import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { MessageService } from "./message-service";
//Note: this class must be provided in app.config.ts

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private messageService : MessageService) {}

  handleError(error: any): void {

    if (error.status) {
      let httpErr: HttpErrorResponse = error;
      let strErr: string = httpErr.error;
      console.log("status code: ", error.status );
      this.messageService.sendMessage(strErr.match(/"message":"([^"]*)"/)?.[1]!);
    } else {
      this.messageService.sendMessage(error.message)
    }

  }
}

