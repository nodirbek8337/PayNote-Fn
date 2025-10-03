import { inject, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const injector = inject(Injector);

  const messageService = inject(MessageService);
  let translate: TranslateService | null = null;

  const TOKEN = localStorage.getItem('payNoteToken');
  let authReq = req;

  if (TOKEN) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${TOKEN}`),
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!translate) {
        translate = injector.get(TranslateService);
      }

      const showError = (key: string) => {
        messageService.add({
          severity: 'error',
          summary: translate!.instant('Messages.Error'),
          detail: translate!.instant(key),
        });
      };

      switch (error.status) {
        case HttpStatusCode.Unauthorized: // 401
          authService.logout();
          break;
        case HttpStatusCode.BadRequest: // 400
          showError('ErrorResponse.400');
          break;
        case HttpStatusCode.Forbidden: // 403
          showError('ErrorResponse.403');
          break;
        case HttpStatusCode.NotFound: // 404
          showError('ErrorResponse.404');
          break;
        case HttpStatusCode.UnprocessableEntity: // 422
          showError('ErrorResponse.422');
          break;
        case HttpStatusCode.InternalServerError: // 500
          showError('ErrorResponse.500');
          break;
        case 0: // Network error (CORS yoki internet yo‘q)
          showError('ErrorResponse.0');
          break;
        default:
          showError('ErrorResponse.default');
          break;
      }

      return throwError(() => error);
    })
  );
};
