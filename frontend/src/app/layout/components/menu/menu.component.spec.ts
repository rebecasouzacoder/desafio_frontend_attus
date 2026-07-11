import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let routerSpy: { url: string; navigate: jest.Mock };

  beforeEach(async () => {
    routerSpy = { url: '/users-list', navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve indicar como ativo o item correspondente à rota atual', () => {
    expect(component.isActive('users-list')).toBe(true);
  });

  it('não deve indicar como ativo um item que não corresponde à rota atual', () => {
    expect(component.isActive('outra-rota')).toBe(false);
  });

  it('deve navegar para a url informada ao chamar goToUrl', () => {
    component.goToUrl('users-list');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['users-list']);
  });

  it('deve navegar ao clicar em um item do menu', () => {
    const menuItem: HTMLElement = fixture.debugElement.query(
      By.css('.menu-item')
    ).nativeElement;

    menuItem.click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['users-list']);
  });

  it('deve aplicar a classe "active" ao item correspondente à rota atual', () => {
    const menuItem: HTMLElement = fixture.debugElement.query(
      By.css('.menu-item')
    ).nativeElement;

    expect(menuItem.classList).toContain('active');
  });
});
