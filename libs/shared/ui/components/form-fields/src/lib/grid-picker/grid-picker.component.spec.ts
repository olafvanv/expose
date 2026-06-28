import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridPicker } from './grid-picker';

describe('GridPicker', () => {
  let component: GridPicker;
  let fixture: ComponentFixture<GridPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(GridPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
