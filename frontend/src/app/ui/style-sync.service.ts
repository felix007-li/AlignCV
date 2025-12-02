import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface StyleState {
  font: string;
  fontSize: number;
  lineHeight: number;
  colorPrimary: string;
}

@Injectable({ providedIn: 'root' })
export class StyleSyncService {
  private readonly defaultState: StyleState = {
    font: 'Arial, sans-serif',
    fontSize: 14,
    lineHeight: 1.25,
    colorPrimary: '#2563eb'
  };

  private state$ = new BehaviorSubject<StyleState>(this.defaultState);

  get stateChanges() {
    return this.state$.asObservable();
  }

  setState(partial: Partial<StyleState>) {
    const next = { ...this.state$.getValue(), ...partial };
    this.state$.next(next);
  }

  getValue(): StyleState {
    return this.state$.getValue();
  }
}
