import { Component, signal, inject, OnInit, OnDestroy} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication';
import { UserInfo } from '../model/userInfo';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message-service';
import { CommonModule } from '@angular/common';
import { MESSAGES } from '../constants/message.constants';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  homeTitle = signal("This is the home page. Please sign up.")
  response = signal("");
  authService = inject(AuthenticationService);
  username = "";
  password = "";
  errorMessage = signal("");
  subscription!: Subscription;
  roles: string[] = ['User', 'Moderator', 'Admin'];
  allSelectedRoles: string[] = [];
  rolesProperty: {name : string}[] = [];
  accepted: boolean | undefined;
  usernameError: boolean = false;
  passwordError: boolean = false;
  roleError: boolean = false;
  messages = MESSAGES;

  constructor(private messageService : MessageService) {}

  ngOnInit() {
      this.subscription = this.messageService.getMessage().subscribe(message => {
        console.log(message);
        this.errorMessage.set(message);
      })
  }

  ngOnDestroy() {
    this.messageService.clearMessage();
    this.subscription.unsubscribe();
    console.log("Unsubscribed!");
  }

  onChange(value: string): void {
    let roleToUpperCase = value.toUpperCase();
    if (this.allSelectedRoles.includes(roleToUpperCase)) {
      this.allSelectedRoles = this.allSelectedRoles.filter((item) => item !== roleToUpperCase);
    } else {
      this.allSelectedRoles.push(roleToUpperCase);
    }
    console.log(this.allSelectedRoles);
  }

  signUpClicked() {
    type roleProperty = {
      name : string;
    };

    this.usernameError = false;
    this.passwordError = false;
    this.roleError = false;

    this.checkIfUserDataIsEmpty();

    console.log(this.username + " " + this.password + " " + this.allSelectedRoles)
    for(var val of this.allSelectedRoles) {
      const role : roleProperty = {
        name : val
      }
      this.rolesProperty.push(role)
    }

    const userSignUpInfo : UserInfo = {
      username : this.username,
      password : this.password,
      roles : this.rolesProperty,
    }

    this.callSignUpApi(userSignUpInfo);

    this.username = "";
    this.password = "";
    this.allSelectedRoles = [];
    this.accepted = false;
  }

  //Observable is returned in the service, while subscribing is done in the component.
  callSignUpApi(user : UserInfo) {
    this.authService.submitUserWithApi(user)
    .subscribe((apiResponse) => {
      this.response.set(apiResponse);
    });

  }

  private checkIfUserDataIsEmpty() {
    if (!this.username) {
      this.usernameError = true;
    }

    if (!this.password) {
      this.passwordError = true;
    }

    if (this.allSelectedRoles.length == 0) {
      this.roleError = true;
    }

    if (this.usernameError || this.passwordError || this.roleError) {
      throw new Error("Error with user input fields.");
    }
  }
}





/*
.pipe(catchError((err) => {
      //Should consider an error handler
      let httpErr: HttpErrorResponse = err;
      let strErr: string = httpErr.error;
      this.response.set(strErr.match(/"message":"([^"]*)"/)?.[1]!);
      throw err;
    })) 
      
*/