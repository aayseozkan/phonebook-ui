import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAdd } from './contact-add';

describe('ContactAdd', () => {
  let component: ContactAdd;
  let fixture: ComponentFixture<ContactAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
