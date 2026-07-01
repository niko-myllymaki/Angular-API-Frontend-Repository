import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission-service';
import { MessageService } from '../services/message-service';

export const adminGuard: CanActivateFn = (route, state) => {
  console.log("Activating Admin Guard");
  const permissionService = inject(PermissionService)
  const router = inject(Router)
  const messageService = inject(MessageService)

  permissionService.isRoleAdmin().subscribe((response) => { 
    console.log("Is Admin: " + response);
    if(!response) {
      console.log("Is not Admin");
      console.log("Path: /" + route.routeConfig?.path + " is not accessible.");
      messageService.sendMessage("Authorization not granted: Invalid role.");
      //It is recommended to use URLTree or RedirectCommand, but for some reason can't figure how they are suppose to work when 
      //subscribing, so that's why redirect is done programmatically 
      router.navigateByUrl("/")
    } 
    })

  return true
};


