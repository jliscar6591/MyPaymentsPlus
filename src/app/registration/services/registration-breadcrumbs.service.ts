import { Injectable, EventEmitter } from '@angular/core';


@Injectable()
export class RegistrationBreadcrumbsService {
    private isGuest: boolean = false;
    private relationshipActive: boolean = false;
    public breadcrumbUpdated = new EventEmitter();

    setGuestState(state): void {
        this.isGuest = state;
        this.breadcrumbUpdated.emit(this.isGuest)
    }

    getGuestState(): boolean {
        return this.isGuest;
    }

    setRelationshipState(state): void {
      this.relationshipActive = state;
      this.breadcrumbUpdated.emit(this.relationshipActive)
    }

    getRelationshipState(): boolean {
      return this.relationshipActive;
    }

}
