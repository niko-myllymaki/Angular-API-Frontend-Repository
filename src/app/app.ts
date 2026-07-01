import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from './components/header/header';
import { AuthenticationService } from './services/authentication';
import { LocalStorageService } from './services/local-storage'
import { catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  tokensKey = "tokens";
  authService = inject(AuthenticationService);
  localStorageService = inject(LocalStorageService);

  logoutClicked() {
    this.authService.logoutUserToken(this.loadTokens()?.refreshToken!)
    .pipe(
      catchError((err) => {
        console.log(err);
        throw err;
      }
    ))
    .subscribe((response) => {
      console.log(response);
      this.localStorageService.removeItem(this.tokensKey)
    })
    }

    loadTokens() {
    const tokens = this.localStorageService.getItem<{accessToken: string; refreshToken: string}>(
      this.tokensKey
    );
    console.log("Loaded tokens: ", tokens);
    return tokens;
  }

  }

