import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SettingsStateService } from '@expose/data-access';
import { App } from './app';

describe('App', () => {
  let settingsStateMock: SettingsStateService;

  beforeEach(async () => {
    settingsStateMock = {
      theme: () => 'system',
      preferredHomePage: () => 'sessions',
    } as SettingsStateService;

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
