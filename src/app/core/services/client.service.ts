import { Injectable } from '@angular/core';
import { BlackListModel, BlackListType } from '../models';
import { firstValueFrom, of } from 'rxjs';

Injectable();
export class ClientService {
  public isClient(type: BlackListType): Promise<BlackListModel> {
    return firstValueFrom(of({ type, value: this.ramdomBoolean() }));
  }

  private ramdomBoolean = (): boolean => Math.random() >= 0.8;
}
