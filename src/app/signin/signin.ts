import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication';
import { LocalStorageService } from '../services/local-storage'
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})

export class Signin {
  signinTitle = signal("Please signin.");
  tokensKey = "tokens";
  authService = inject(AuthenticationService);
  localStorageService = inject(LocalStorageService);
  username = "";
  password = "";  
  role = "";

  constructor(private router: Router) {}

  signinClicked() {
    this.callSignInApi(this.username, this.password)

  }

  callSignInApi(userName: string, password : string) {
    this.authService.authenticateUser(userName, password).pipe(catchError((err) => {
      console.log(err);
      this.getUserId(userName);
      throw err;
    })
    )
    .subscribe((apiResponse) => {
      this.localStorageService.setItem(this.tokensKey, apiResponse)
      this.navigateBasedOnRole();
    });
  }

  getUserId(username : string) {
    this.authService.getIdFromUsername(username).pipe(catchError((err) => {
      console.log(err);
      throw err;
    })
    ).subscribe((response) => {
      console.log("id: " + response);
      this.getRefreshTokenByUserId(Number(response))
    })
  }

  getRefreshTokenByUserId(userId : number) {
    this.authService.getRefreshTokenByUserId(userId).pipe(catchError((err) => {
      console.log(err);
      throw err;
    })
  ).subscribe((response) => {
    let parsed = JSON.parse(JSON.stringify(response));
    console.log(parsed.refreshtoken)
    this.logoutUser(parsed.refreshtoken)
  })
  }

  navigateBasedOnRole() {
    //Get jwt access token from local storage
    const accessToken = this.loadTokens()?.accessToken;
    //Get role from token
    this.authService.getRoleFromToken(accessToken!)
    .subscribe((response) => {
      this.role = response;
      //Navigate based on role
      this.navigateToPanel();
    });
  }

  loadTokens() {
    const tokens = this.localStorageService.getItem<{accessToken: string; refreshToken: string}>(
      this.tokensKey
    );
    console.log("Loaded tokens: ", tokens);
    return tokens;
  }
  
  navigateToPanel() {
    if (this.role.includes("ADMIN")) {
      console.log("To Admin panel")
      this.router.navigateByUrl('/admin')
    } else {
      console.log("To User panel")
      this.router.navigateByUrl('/user')
    }
  }

  logoutUser(refreshToken : string) {
    this.authService.logoutUserToken(refreshToken).pipe(catchError((err) => {
      console.log(err);
      throw err;
    })
    ).subscribe((response) => {
      console.log(response);
      console.log("re signing...");
      this.callSignInApi(this.username, this.password)
    })
  }

}


