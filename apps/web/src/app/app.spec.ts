import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { SettingsStateService } from '@expose/data-access';
import { RouterModule } from '@angular/router';

describe('App', () => {
  let settingsStateMock: any;

  beforeEach(async () => {
    settingsStateMock = {
      theme: () => 'system',
      preferredHomePage: () => 'sessions',
    };

    await TestBed.configureTestingModule({
      imports: [App, RouterModule.forRoot([])],
      providers: [
        { provide: SettingsStateService, useValue: settingsStateMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
