import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(error => {
      let message = 'An unexpected error occurred';

      if (error.status === 401) {
        authService.logout();
        message = 'Session expired. Please login again.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = error.error?.message || 'Resource not found.';
      } else if (error.status === 400) {
        message = error.error?.message || 'Invalid request.';
        if (error.error?.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          message = validationErrors.join(', ');
        }
      } else if (error.status === 0) {
        message = 'Unable to connect to server. Please check your connection.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      snackBar.open(message, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });

      return throwError(() => error);
    })
  );
};
