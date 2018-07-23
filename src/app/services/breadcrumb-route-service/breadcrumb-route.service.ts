import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs/Rx';

@Injectable()
export class BreadcrumbRouteEventEmitterService {
    private _breadcrumbRoute: Subject<string> = new Subject();

    public BreadcrumbRouteObservable: Observable<string> = this._breadcrumbRoute.asObservable();

    breadcrumbRouteChangeEvent(breadCrumbs: string) {
        this._breadcrumbRoute.next(breadCrumbs);
    }
}
