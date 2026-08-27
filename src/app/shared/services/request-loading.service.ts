import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestLoadingService {
  private pendingMutations = 0;
  private readonly mutationLoadingSubject = new BehaviorSubject(false);

  readonly mutationLoading$ = this.mutationLoadingSubject.asObservable();

  startMutation(): void {
    this.pendingMutations++;
    this.mutationLoadingSubject.next(true);
  }

  finishMutation(): void {
    this.pendingMutations = Math.max(0, this.pendingMutations - 1);
    this.mutationLoadingSubject.next(this.pendingMutations > 0);
  }
}
