import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let breakpointSubject: Subject<{ matches: boolean }>;

  beforeEach(async () => {
    breakpointSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, NoopAnimationsModule],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: jest.fn().mockReturnValue(breakpointSubject.asObservable()) },
        },
        { provide: Router, useValue: { url: '/users-list', navigate: jest.fn(), events: new Subject() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com isMobile em falso', () => {
    expect(component.isMobile()).toBe(false);
  });

  it('deve atualizar isMobile para verdadeiro quando o breakpoint corresponder a um dispositivo mobile', () => {
    breakpointSubject.next({ matches: true });
    fixture.detectChanges();

    expect(component.isMobile()).toBe(true);
  });

  it('deve atualizar isMobile para falso quando o breakpoint não corresponder a um dispositivo mobile', () => {
    breakpointSubject.next({ matches: true });
    fixture.detectChanges();

    breakpointSubject.next({ matches: false });
    fixture.detectChanges();

    expect(component.isMobile()).toBe(false);
  });

  it('deve exibir o botão de alternância do menu apenas em modo mobile', () => {
    expect(fixture.debugElement.query(By.css('.menu-toggle'))).toBeNull();

    breakpointSubject.next({ matches: true });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.menu-toggle'))).toBeTruthy();
  });
});
