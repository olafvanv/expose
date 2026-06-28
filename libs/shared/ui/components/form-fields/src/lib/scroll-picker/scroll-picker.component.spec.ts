import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollPicker } from './scroll-picker';

describe('ScrollPicker', () => {
  let component: ScrollPicker;
  let fixture: ComponentFixture<ScrollPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
