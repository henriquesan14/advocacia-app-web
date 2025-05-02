import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterProcessoService {

  private filters: any = {};

  setFilters(filters: any): void {
    this.filters = filters;
  }

  getFilters(): any {
    return this.filters;
  }
}
