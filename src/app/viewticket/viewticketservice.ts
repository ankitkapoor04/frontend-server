import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TicketUpdateService {
    
    private ticketUpdatedSource = new Subject<void>();

    ticketUpdated$ = this.ticketUpdatedSource.asObservable();

    notifyTicketAdded() {
        this.ticketUpdatedSource.next();
    }
}
