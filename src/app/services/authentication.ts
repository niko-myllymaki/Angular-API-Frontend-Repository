import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../model/userInfo';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:8080/api/';
  http = inject(HttpClient);
  //This service just returns a observable. Subscribing is done in the component.
  submitUserWithApi(user : UserInfo) {
    const url = this.apiUrl + "auth/signup"
    return this.http.post(url, user, { responseType: "text" });
  }

  authenticateUser(userName : String, password : String) {
    const url = this.apiUrl + "auth/signin"
    const userCredintals = {
      username : userName,
      password : password
    }
    return this.http.post(url, userCredintals);
  }

  logoutUserToken(refreshToken : string) {
    const url = this.apiUrl + "auth/logout"
    const refreshTokenInfo = {
      refreshToken : refreshToken,
    }
    return this.http.post(url, refreshTokenInfo, { responseType: "text" });
  }

  getRoleFromToken(token : String) {
    const url = this.apiUrl + "auth/role"
    return this.http.get(url, {headers: {
      'Authorization': 'Bearer ' + token
    },  responseType: "text" })
  }

  getIdFromUsername(userName : string) {
    const url = this.apiUrl + "auth/user"
    return this.http.get(url, {params : {'username' : userName}, responseType: "text"})
  }

  getRefreshTokenByUserId(userId : number) {
    const url = this.apiUrl + "test/all/refresh-token"
    return this.http.get(url, {params : {"userId" : userId}, responseType: "json"}) 
  }

}
