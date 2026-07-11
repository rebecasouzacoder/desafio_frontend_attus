import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir o valor digitado após o debounce', fakeAsync(() => {
    const emitted: string[] = [];
    component.searchChange.subscribe((value) => emitted.push(value));

    component.searchControl.setValue('Fulano');
    tick(300);

    expect(emitted).toEqual(['Fulano']);
  }));

  it('deve remover espaços em branco das extremidades antes de emitir', fakeAsync(() => {
    const emitted: string[] = [];
    component.searchChange.subscribe((value) => emitted.push(value));

    component.searchControl.setValue('  Fulano  ');
    tick(300);

    expect(emitted).toEqual(['Fulano']);
  }));

  it('não deve emitir antes do tempo de debounce', fakeAsync(() => {
    const emitted: string[] = [];
    component.searchChange.subscribe((value) => emitted.push(value));

    component.searchControl.setValue('Fulano');
    tick(299);

    expect(emitted).toEqual([]);

    tick(1);
    expect(emitted).toEqual(['Fulano']);
  }));

  it('não deve emitir valores repetidos consecutivos', fakeAsync(() => {
    const emitted: string[] = [];
    component.searchChange.subscribe((value) => emitted.push(value));

    component.searchControl.setValue('Fulano');
    tick(300);

    component.searchControl.setValue('Fulano');
    tick(300);

    expect(emitted).toEqual(['Fulano']);
  }));

  it('deve considerar apenas o último valor digitado dentro do debounce', fakeAsync(() => {
    const emitted: string[] = [];
    component.searchChange.subscribe((value) => emitted.push(value));

    component.searchControl.setValue('F');
    tick(100);
    component.searchControl.setValue('Fu');
    tick(100);
    component.searchControl.setValue('Fulano');
    tick(300);

    expect(emitted).toEqual(['Fulano']);
  }));

  it('deve emitir ao digitar diretamente no input', fakeAsync(() => {
    const emitted: string[] = [];
    component.searchChange.subscribe((value) => emitted.push(value));

    const inputDebugEl = fixture.debugElement.query(By.css('input'));
    const input: HTMLInputElement = inputDebugEl.nativeElement;
    input.value = 'Ciclano';
    inputDebugEl.triggerEventHandler('input', { target: input });
    tick(300);

    expect(emitted).toEqual(['Ciclano']);
  }));
});
