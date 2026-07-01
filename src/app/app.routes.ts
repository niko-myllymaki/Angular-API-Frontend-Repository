import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { userGuard } from './guards/user-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./home/home').then((m) => m.Home);
        },
    },
    {
        path: 'signin',
        loadComponent:() => {
            return import('./signin/signin').then((m) => m.Signin);
        },
    },
    {
        path: 'admin',
        loadComponent:() => {
            return import('./admin/admin').then((m) => m.Admin);
        },
        canActivate: [adminGuard]
    },
    {
        path: 'user',
        loadComponent:() => {
            return import('./user/user').then((m) => m.User);
        },
        canActivate: [userGuard]
    },



];
