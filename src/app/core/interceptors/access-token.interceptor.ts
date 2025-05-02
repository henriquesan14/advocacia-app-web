import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalstorageService } from "../../shared/services/localstorage.service";
import { environment } from "../../../environments/environment";

export const AccessTokenInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const localStorageService = inject(LocalstorageService);
    const localUser = localStorageService.getAuthStorage();
    const n = environment.apiUrlBase.length;
    const requestToAPI = req.url.substring(0, n) === environment.apiUrlBase;
    if(requestToAPI && localUser){
        const clonedRequest = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${localUser.accessToken}`
            }
        });
        return next(clonedRequest);
    }else{
        return next(req);
    }  
}