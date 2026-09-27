import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const errorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // This guard can be used to handle route-level errors
  // For now, it just allows all routes
  return true;
};