import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError, Subject } from 'rxjs';

import { UsersListComponent } from './users-list.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { IUser } from '../../models/user.model';
import { EPhoneType } from '../../models/phone-type.enum';
import { ModalUserComponent } from '../../dialog/modal-user/modal-user.component';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  let userServiceSpy: jest.Mocked<Pick<UserService, 'getUsers' | 'createUser' | 'updateUser'>>;
  let toastSpy: jest.Mocked<Pick<ToastService, 'success' | 'error'>>;
  let dialogSpy: jest.Mocked<Pick<MatDialog, 'open'>>;
  let afterClosedSubject: Subject<any>;

  const users: IUser[] = [
    {
      id: 1,
      name: 'Fulano de Tal',
      email: 'fulano@teste.com',
      cpf: '52998224725',
      phone: '11987654321',
      typePhone: EPhoneType.Mobile,
    },
  ];

  const configureTestBed = async () => {
    afterClosedSubject = new Subject();

    userServiceSpy = {
      getUsers: jest.fn().mockReturnValue(of(users)),
      createUser: jest.fn().mockReturnValue(of(users[0])),
      updateUser: jest.fn().mockReturnValue(of(users[0])),
    };

    toastSpy = {
      success: jest.fn(),
      error: jest.fn(),
    };

    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => afterClosedSubject.asObservable(),
      } as MatDialogRef<ModalUserComponent>),
    };

    await TestBed.configureTestingModule({
      imports: [UsersListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  };

  describe('carregamento inicial', () => {
    beforeEach(async () => {
      await configureTestBed();
    });

    it('deve ser criado', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('deve carregar a lista de usuários com sucesso ao iniciar', () => {
      fixture.detectChanges();

      expect(userServiceSpy.getUsers).toHaveBeenCalledWith(undefined);
      expect(component.usersList()).toEqual(users);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBe(false);
    });

    it('deve exibir o componente de loading enquanto a busca está em andamento', () => {
      userServiceSpy.getUsers.mockReturnValue(new Subject());

      fixture.detectChanges();

      expect(component.loading()).toBe(true);
      const loading = fixture.debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    });

    it('deve tratar erro ao carregar a lista de usuários', () => {
      userServiceSpy.getUsers.mockReturnValue(throwError(() => new Error('falha')));

      fixture.detectChanges();

      expect(component.error()).toBe(true);
      expect(component.loading()).toBe(false);
      expect(toastSpy.error).toHaveBeenCalledWith('Não foi possível carregar os usuários');

      const emptyResult = fixture.debugElement.query(By.css('app-empty-result'));
      expect(emptyResult).toBeTruthy();
    });

    it('deve exibir estado vazio quando não há usuários', () => {
      userServiceSpy.getUsers.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(component.usersList()).toEqual([]);
      const emptyResult = fixture.debugElement.query(By.css('app-empty-result'));
      expect(emptyResult).toBeTruthy();
    });

    it('deve exibir o card-grid quando existem usuários', () => {
      fixture.detectChanges();

      const cardGrid = fixture.debugElement.query(By.css('app-card-grid'));
      expect(cardGrid).toBeTruthy();
    });
  });

  describe('busca', () => {
    beforeEach(async () => {
      await configureTestBed();
      fixture.detectChanges();
      userServiceSpy.getUsers.mockClear();
    });

    it('deve buscar usuários pelo termo informado', () => {
      component.onSearch('Fulano');

      expect(userServiceSpy.getUsers).toHaveBeenCalledWith('Fulano');
    });

    it('deve repetir a última busca ao acionar o retry', () => {
      component.onSearch('Fulano');
      userServiceSpy.getUsers.mockClear();

      component.onRetry();

      expect(userServiceSpy.getUsers).toHaveBeenCalledWith('Fulano');
    });

    it('deve acionar a busca ao emitir o evento de retry pelo template', () => {
      userServiceSpy.getUsers.mockReturnValue(throwError(() => new Error('falha')));
      component.onSearch('Fulano');
      fixture.detectChanges();

      userServiceSpy.getUsers.mockReturnValue(of(users));

      const emptyResult = fixture.debugElement.query(By.css('app-empty-result'));
      emptyResult.triggerEventHandler('retry', undefined);

      expect(userServiceSpy.getUsers).toHaveBeenCalledWith('Fulano');
    });
  });

  describe('cadastro de usuário', () => {
    beforeEach(async () => {
      await configureTestBed();
      fixture.detectChanges();
    });

    it('deve abrir a modal em modo de criação ao clicar em "Cadastrar usuário"', () => {
      const createButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('.flex.justify-end button')
      ).nativeElement;

      createButton.click();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        ModalUserComponent,
        expect.objectContaining({
          data: { mode: 'create', user: undefined },
        })
      );
    });

    it('não deve criar usuário quando a modal é fechada sem retornar dados', () => {
      component.handleUserAction({ type: 'create' });
      afterClosedSubject.next(undefined);

      expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    });

    it('deve criar o usuário e recarregar a lista com sucesso', () => {
      component.handleUserAction({ type: 'create' });
      userServiceSpy.getUsers.mockClear();

      afterClosedSubject.next({ name: 'Novo usuário' });

      expect(userServiceSpy.createUser).toHaveBeenCalledWith({ name: 'Novo usuário' });
      expect(toastSpy.success).toHaveBeenCalledWith('Usuário criado com sucesso');
      expect(userServiceSpy.getUsers).toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro quando falhar ao criar usuário', () => {
      userServiceSpy.createUser.mockReturnValue(throwError(() => new Error('falha')));

      component.handleUserAction({ type: 'create' });
      afterClosedSubject.next({ name: 'Novo usuário' });

      expect(toastSpy.error).toHaveBeenCalledWith('Não foi possível criar usuário');
    });
  });

  describe('edição de usuário', () => {
    beforeEach(async () => {
      await configureTestBed();
      fixture.detectChanges();
    });

    it('deve abrir a modal em modo de edição repassando o usuário selecionado', () => {
      component.handleUserAction({ type: 'edit', user: users[0] });

      expect(dialogSpy.open).toHaveBeenCalledWith(
        ModalUserComponent,
        expect.objectContaining({
          data: { mode: 'edit', user: users[0] },
        })
      );
    });

    it('deve atualizar o usuário e recarregar a lista com sucesso', () => {
      component.handleUserAction({ type: 'edit', user: users[0] });
      userServiceSpy.getUsers.mockClear();

      afterClosedSubject.next({ name: 'Nome atualizado' });

      expect(userServiceSpy.updateUser).toHaveBeenCalledWith(users[0].id, {
        name: 'Nome atualizado',
      });
      expect(toastSpy.success).toHaveBeenCalledWith('Usuário atualizado com sucesso');
      expect(userServiceSpy.getUsers).toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro quando falhar ao atualizar usuário', () => {
      userServiceSpy.updateUser.mockReturnValue(throwError(() => new Error('falha')));

      component.handleUserAction({ type: 'edit', user: users[0] });
      afterClosedSubject.next({ name: 'Nome atualizado' });

      expect(toastSpy.error).toHaveBeenCalledWith('Não foi possível atualizar usuário');
    });

    it('não deve atualizar quando o usuário de edição não possui id', () => {
      component.handleUserAction({ type: 'edit', user: undefined });
      afterClosedSubject.next({ name: 'Nome atualizado' });

      expect(userServiceSpy.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('visualização de usuário', () => {
    beforeEach(async () => {
      await configureTestBed();
      fixture.detectChanges();
    });

    it('deve abrir a modal em modo de visualização repassando o usuário selecionado', () => {
      component.handleUserAction({ type: 'view', user: users[0] });

      expect(dialogSpy.open).toHaveBeenCalledWith(
        ModalUserComponent,
        expect.objectContaining({
          data: { mode: 'view', user: users[0] },
        })
      );
    });

    it('deve emitir a ação do card-grid para o handler de ações', () => {
      const cardGrid = fixture.debugElement.query(By.css('app-card-grid'));
      cardGrid.triggerEventHandler('action', { type: 'view', user: users[0] });

      expect(dialogSpy.open).toHaveBeenCalledWith(
        ModalUserComponent,
        expect.objectContaining({
          data: { mode: 'view', user: users[0] },
        })
      );
    });
  });
});
