import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

import { CardGridComponent } from './card-grid.component';
import { IUser } from '../../models/user.model';
import { EPhoneType } from '../../models/phone-type.enum';
import { IUserCardAction } from '../../models/user-card-action.model';

describe('CardGridComponent', () => {
  let component: CardGridComponent;
  let fixture: ComponentFixture<CardGridComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  const users: IUser[] = [
    {
      id: 1,
      name: 'Fulano de Tal',
      email: 'fulano@teste.com',
      cpf: '52998224725',
      phone: '11987654321',
      typePhone: EPhoneType.Mobile,
    },
    {
      id: 2,
      name: 'Ciclano',
      email: 'ciclano@teste.com',
      cpf: '11144477735',
      phone: '1132654321',
      typePhone: EPhoneType.Home,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridComponent, NoopAnimationsModule],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();

    fixture = TestBed.createComponent(CardGridComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('usersList', users);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir um card para cada usuário da lista', () => {
    const cards = fixture.debugElement.queryAll(By.css('.user-card'));
    expect(cards.length).toBe(2);
    expect(cards[0].nativeElement.textContent).toContain('Fulano de Tal');
    expect(cards[0].nativeElement.textContent).toContain('fulano@teste.com');
  });

  it('deve exibir as iniciais do nome do usuário em maiúsculo no avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.user-avatar'));
    expect(avatar.nativeElement.textContent.trim()).toBe('FU');
  });

  it('deve emitir a ação "view" com o usuário selecionado', () => {
    const actionSpy = jest.fn();
    component.action.subscribe(actionSpy);

    component.onAction('view', users[0]);

    expect(actionSpy).toHaveBeenCalledWith<[IUserCardAction]>({
      type: 'view',
      user: users[0],
    });
  });

  it('deve emitir a ação "edit" com o usuário selecionado', () => {
    const actionSpy = jest.fn();
    component.action.subscribe(actionSpy);

    component.onAction('edit', users[1]);

    expect(actionSpy).toHaveBeenCalledWith<[IUserCardAction]>({
      type: 'edit',
      user: users[1],
    });
  });

  it('deve emitir a ação "view" ao clicar no item de menu correspondente', () => {
    const actionSpy = jest.fn();
    component.action.subscribe(actionSpy);

    const trigger: HTMLButtonElement = fixture.debugElement.query(
      By.css('.user-content button')
    ).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const menuItems = overlayContainerElement.querySelectorAll(
      'button.mat-mdc-menu-item'
    );
    (menuItems[0] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(actionSpy).toHaveBeenCalledWith<[IUserCardAction]>({
      type: 'view',
      user: users[0],
    });
  });

  it('deve emitir a ação "edit" ao clicar no item de menu correspondente', () => {
    const actionSpy = jest.fn();
    component.action.subscribe(actionSpy);

    const trigger: HTMLButtonElement = fixture.debugElement.query(
      By.css('.user-content button')
    ).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const menuItems = overlayContainerElement.querySelectorAll(
      'button.mat-mdc-menu-item'
    );
    (menuItems[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(actionSpy).toHaveBeenCalledWith<[IUserCardAction]>({
      type: 'edit',
      user: users[0],
    });
  });
});
