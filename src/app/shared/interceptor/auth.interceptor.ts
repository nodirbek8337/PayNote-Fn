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

  const token = localStorage.getItem('payNoteToken');
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  const isAuthLogin = req.url.includes('/auth/login');

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const show = (msg: string) => toast.error(msg);

      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          show('Kirish rad etildi. Login yoki parol notog\'ri.');
          if (!isAuthLogin) authService.logoutAndRedirect();
          break;
        case HttpStatusCode.BadRequest:
          show('Notog\'ri sorov. Ma\'lumotlarni tekshirib qayta urinib ko\'ring.');
          break;
        case HttpStatusCode.Forbidden:
          show('Ruxsat yo\'q. Ushbu amalni bajarishga huquqingiz yo\'q.');
          break;
        case HttpStatusCode.NotFound:
          show('Topilmadi. So\'ralgan ma\'lumot mavjud emas.');
          break;
        case HttpStatusCode.Conflict:
          show('Nizoli holat. Ma\'lumot allaqachon mavjud.');
          break;
        case HttpStatusCode.UnprocessableEntity:
          show('Ma\'lumotlar notog\'ri to\'ldirilgan.');
          break;
        case 429:
          show('Juda ko\'p sorov yuborildi. Birozdan so\'ng urinib ko\'ring.');
          break;
        case HttpStatusCode.InternalServerError:
          show('Serverda xatolik yuz berdi.');
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
          show('Internet aloqasi yo\'q. Ulab qayta urinib ko\'ring.');
          break;
        default:
          show('Noma\'lum xatolik yuz berdi.');
          break;
      }

      return throwError(() => error);
    })
  );
};
