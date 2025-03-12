import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InconeComponent } from './incone.component';

describe('InconeComponent', () => {
  let component: InconeComponent;
  let fixture: ComponentFixture<InconeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InconeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InconeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
