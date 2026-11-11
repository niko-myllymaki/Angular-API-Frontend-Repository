import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class MessageService {
  private behaviorSubject = new BehaviorSubject("");

  sendMessage(data : string) {
    console.log("Sending message: ", data);
    this.behaviorSubject.next(data);
  }

  clearMessage() {
    this.behaviorSubject.next("");
  }

  getMessage(): Observable<any> {
    return this.behaviorSubject.asObservable();
  }
}
