import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a mensagem padrão quando nenhuma é informada', () => {
    expect(component.message()).toBe('Carregando...');
    expect(fixture.nativeElement.textContent).toContain('Carregando...');
  });

  it('deve exibir a mensagem customizada quando informada', () => {
    fixture.componentRef.setInput('message', 'Carregando usuários...');
    fixture.detectChanges();

    expect(component.message()).toBe('Carregando usuários...');
    expect(fixture.nativeElement.textContent).toContain('Carregando usuários...');
  });
});
