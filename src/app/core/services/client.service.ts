/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';

Injectable();
export class ClientService {
  public isIdentificationNumberClient(identificationNumber: string): Promise<boolean> {
    return firstValueFrom(of(this.ramdomBoolean()));
  }

  public isPlateNumberClient(plateNumber: string): Promise<boolean> {
    return firstValueFrom(of(this.ramdomBoolean()));
  }

  private ramdomBoolean = (): boolean => Math.random() >= 0.8;
}
