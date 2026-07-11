import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmptyResultComponent } from './empty-result.component';

describe('EmptyResultComponent', () => {
  let component: EmptyResultComponent;
  let fixture: ComponentFixture<EmptyResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve utilizar os valores padrão quando nenhum input é informado', () => {
    expect(component.message()).toBe('Nenhum resultado encontrado');
    expect(component.icon()).toBe('search_off');
    expect(component.variant()).toBe('empty');
  });

  it('não deve exibir o botão de retry na variante "empty"', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeNull();
  });

  it('deve exibir o botão de retry e emitir o evento ao clicar na variante "error"', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.componentRef.setInput('message', 'Falha ao carregar');
    fixture.detectChanges();

    const retrySpy = jest.fn();
    component.retry.subscribe(retrySpy);

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(retrySpy).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('Falha ao carregar');
  });

  it('deve aplicar a classe de erro quando a variante for "error"', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('mat-card')).nativeElement as HTMLElement;
    expect(card.classList).toContain('empty-result--error');
  });
});
