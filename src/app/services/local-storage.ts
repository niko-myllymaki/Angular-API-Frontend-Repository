import { Injectable } from '@angular/core';
/**
 * Functions for localstorage
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  setItem(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue)

    } catch (error) {
      console.log("Error saving to local storage", error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log("Error reading from local storage");
      return null
    }
  }

  removeItem(key : string): void {
    localStorage.removeItem(key);
  }

  clearStorage() {
    localStorage.clear();
  }
}
