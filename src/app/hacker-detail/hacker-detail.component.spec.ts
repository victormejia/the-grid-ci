import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HackerDetailComponent } from './hacker-detail.component';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { mockHackers } from '../core/helpers.spec';
import { ApiService } from '../core/services/api.service';
import 'rxjs/add/observable/of';

describe('HackerDetailComponent', () => {
  let component: HackerDetailComponent;
  let fixture: ComponentFixture<HackerDetailComponent>;
  let element;

  const mockApiService = {
    getHackerDetails: id => Promise.resolve(mockHackers[3])
  };

  const mockActivatedRoute = {
    params: Observable.of({ id: 'f1b2e9bf-2794-4ccf-a869-9ddb93478f70' })
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [HackerDetailComponent],
        providers: [
          { provide: ApiService, useValue: mockApiService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HackerDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.hacker = mockHackers[3] as any;
  });

  it('should set the correct hacker name', () => {
    fixture.detectChanges();

    fixture.detectChanges();
    const name = element.querySelector('.header');
    expect(name.textContent).toBe('Kathlyn');
  });

  it('should set the correct hacker status message', () => {
    fixture.detectChanges();

    fixture.detectChanges();
    const name = element.querySelector('.description');
    expect(name.textContent.trim()).toBe(
      "You can't program the bus without bypassing the redundant RSS circuit!"
    );
  });
});
