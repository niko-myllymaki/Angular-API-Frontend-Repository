import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication';
import { LocalStorageService } from '../services/local-storage';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  localStorageService = inject(LocalStorageService);
  authService = inject(AuthenticationService);
  tokensKey = "tokens";

  isRoleAdmin() {
    const accessToken = this.loadTokens()?.accessToken;
    return this.authService.getRoleFromToken(accessToken!).pipe(map(response => {
      if(response.includes("ADMIN")) {
        return true
      } else {
        return false
      }
    }))
  }

  isRoleUser() {
    const accessToken = this.loadTokens()?.accessToken;
    return this.authService.getRoleFromToken(accessToken!).pipe(map(response => {
      if(response.includes("USER")) {
        return true
      } else {
        return false
      }
    }))
  }

  loadTokens() {
    const tokens = this.localStorageService.getItem<{accessToken: string; refreshToken: string}>(
      this.tokensKey
    );
    console.log("Loaded tokens: ", tokens);
    return tokens;
  }

}
