import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  const isAuthLogin = req.url.includes('/auth/login');
  const isAuthSessionCheck = req.url.includes('/auth/me');
  const token = authService.getAccessToken();
  const authReq = token && !isAuthLogin
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const show = (msg: string) => toast.error(msg);
      const serverMessage = typeof error.error?.message === 'string' ? error.error.message.trim() : '';
      const showServerMessage = (fallback: string) => show(serverMessage || fallback);

      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          if (isAuthLogin) {
            show("Kirish rad etildi. Username yoki parol noto'g'ri.");
          } else if (!isAuthSessionCheck) {
            show('Sessiya muddati tugagan. Qaytadan login qiling.');
            authService.logoutAndRedirect();
          }
          break;
        case HttpStatusCode.BadRequest:
          showServerMessage("Noto'g'ri so'rov. Ma'lumotlarni tekshirib qayta urinib ko'ring.");
          break;
        case HttpStatusCode.Forbidden:
          showServerMessage("Ruxsat yo'q. Ushbu amalni bajarishga huquqingiz yo'q.");
          break;
        case HttpStatusCode.NotFound:
          showServerMessage("Topilmadi. So'ralgan ma'lumot mavjud emas.");
          break;
        case HttpStatusCode.Conflict:
          showServerMessage("Ma'lumot allaqachon mavjud.");
          break;
        case HttpStatusCode.UnprocessableEntity:
          showServerMessage("Ma'lumotlar noto'g'ri to'ldirilgan.");
          break;
        case 429:
          showServerMessage("Juda ko'p so'rov yuborildi. Birozdan so'ng urinib ko'ring.");
          break;
        case HttpStatusCode.InternalServerError:
          showServerMessage('Serverda xatolik yuz berdi.');
          break;
        case 502:
          show('Tashqi xizmat xatolik qaytardi.');
          break;
        case 503:
          show('Xizmat vaqtincha ishlamayapti.');
          break;
        case 504:
          show('Tarmoq kechikishi. Internetni tekshiring.');
          break;
        case 0:
          show("Internet aloqasi yo'q. Ulab qayta urinib ko'ring.");
          break;
        default:
          showServerMessage("Noma'lum xatolik yuz berdi.");
          break;
      }

      return throwError(() => error);
    })
  );
};
