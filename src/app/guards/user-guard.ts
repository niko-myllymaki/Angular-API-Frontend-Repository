import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission-service';
import { inject } from '@angular/core';
import { MessageService } from '../services/message-service';

export const userGuard: CanActivateFn = (route, state) => {
  console.log("Activating User Guard");
  const permissionService = inject(PermissionService)
  const router = inject(Router)
  const messageService = inject(MessageService)

  permissionService.isRoleUser().subscribe((response) => { 
    console.log("Is User: " + response);
    if(response == false) {
      console.log("Is not User");
      console.log("Path: /" + route.routeConfig?.path + " is not accessible.");
      messageService.sendMessage("Authorization not granted: Invalid role.");
      router.navigateByUrl("/")
    } 
    })
    
 return true
};
