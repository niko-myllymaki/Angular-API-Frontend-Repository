import { Component, signal, inject, OnInit, OnDestroy} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication';
import { UserInfo } from '../model/userInfo';
import { catchError, Subscription } from 'rxjs';
import { MessageService } from '../services/message-service';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  homeTitle = signal("This is the home page. Please sign up.")
  response = signal("");
  authService = inject(AuthenticationService);
  username = "";
  password = "";
  permissions = "";
  test = "";
  messageToShow : string = "";
  subscription!: Subscription;
  roles: string[] = ['User', 'Moderator', 'Admin'];
  allSelectedValues: string[] = [];
  rolesProperty: {name : string}[] = [];
  accepted: Boolean | undefined;

  constructor(private messageService : MessageService) {}

  ngOnInit() {
      this.subscription = this.messageService.getMessage().subscribe(message => {
      console.log(message);
      if(message) {
        this.messageToShow = message;
      } else {
        this.messageToShow = "";
      }
    })
  }

  ngOnDestroy() {
    this.messageService.sendMessage("");
    this.subscription.unsubscribe();
    console.log("Unsubscribed!");
  }

  onChange(value: string): void {
    let valueToUpperCase = value.toUpperCase();
    if (this.allSelectedValues.includes(valueToUpperCase)) {
      this.allSelectedValues = this.allSelectedValues.filter((item) => item !== valueToUpperCase);
    } else {
      this.allSelectedValues.push(valueToUpperCase);
    }
    console.log(this.allSelectedValues);
  }

  buttonClicked() {
    type roleProperty = {
      name : string;
    };

    console.log(this.username + " " + this.password + " " + this.allSelectedValues + " " + this.permissions)
    for(var val of this.allSelectedValues) {
      const testRole : roleProperty = {
        name : val
      }
      this.rolesProperty.push(testRole)
    }

    const userSignUpInfo : UserInfo = {
      username : this.username,
      password : this.password,
      roles : this.rolesProperty,
      permissions : [{
        name : this.permissions
      }]
    }

    this.callSignUpApi(userSignUpInfo);

    this.username = "";
    this.password = "";
    this.allSelectedValues = [];
    this.permissions = "";
    this.accepted = false;
  }

  //Observable is returned in the service, while subscribing is done in the component.
  callSignUpApi(user : UserInfo) {
    this.authService.submitUserWithApi(user).pipe(catchError((err) => {
      console.log(err);
      throw err;
    }))
    .subscribe((apiResponse) => {
      this.response.set(apiResponse);
    });

  }
}
