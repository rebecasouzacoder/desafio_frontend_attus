import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModalUserComponent } from './modal-user.component';
import { IUserModalData } from '../../models/user-modal.model';
import { EPhoneType } from '../../models/phone-type.enum';
import { IUser } from '../../models/user.model';

describe('ModalUserComponent', () => {
  let component: ModalUserComponent;
  let fixture: ComponentFixture<ModalUserComponent>;
  let dialogRefSpy: jest.Mocked<Pick<MatDialogRef<ModalUserComponent>, 'close'>>;

  const user: IUser = {
    id: 1,
    name: 'Fulano de Tal',
    email: 'fulano@teste.com',
    cpf: '529.982.247-25',
    phone: '(11) 98765-4321',
    typePhone: EPhoneType.Mobile,
  };

  const setup = async (data: IUserModalData) => {
    dialogRefSpy = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ModalUserComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('modo de criação', () => {
    beforeEach(async () => {
      await setup({ mode: 'create' });
    });

    it('deve ser criado', () => {
      expect(component).toBeTruthy();
    });

    it('deve iniciar com o formulário inválido e vazio', () => {
      expect(component.form.invalid).toBe(true);
      expect(component.form.value.name).toBe('');
      expect(component.form.value.email).toBe('');
    });

    it('deve iniciar com o campo telefone desabilitado', () => {
      expect(component.form.controls.phone.disabled).toBe(true);
    });

    it('não deve ser modo de visualização', () => {
      expect(component.isViewMode).toBe(false);
    });

    it('deve acusar erro obrigatório quando os campos estão vazios', () => {
      component.form.controls.name.markAsTouched();
      expect(component.form.controls.name.hasError('required')).toBe(true);
      expect(component.form.controls.email.hasError('required')).toBe(true);
      expect(component.form.controls.cpf.hasError('required')).toBe(true);
      expect(component.form.controls.typePhone.hasError('required')).toBe(true);

      component.form.controls.typePhone.setValue(EPhoneType.Mobile);
      component.form.controls.phone.setValue('');
      expect(component.form.controls.phone.hasError('required')).toBe(true);
    });

    it('deve acusar erro de email inválido', () => {
      component.form.controls.email.setValue('email-invalido');
      expect(component.form.controls.email.hasError('email')).toBe(true);

      component.form.controls.email.setValue('valido@teste.com');
      expect(component.form.controls.email.hasError('email')).toBe(false);
    });

    it('deve acusar erro de CPF inválido através do validador customizado', () => {
      component.form.controls.cpf.setValue('111.111.111-11');
      expect(component.form.controls.cpf.hasError('cpfInvalid')).toBe(true);

      component.form.controls.cpf.setValue('529.982.247-25');
      expect(component.form.controls.cpf.hasError('cpfInvalid')).toBe(false);
    });

    it('deve aplicar a máscara de CPF ao digitar no campo', () => {
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input[formControlName="cpf"]')
      ).nativeElement;

      input.value = '52998224725';
      input.dispatchEvent(new Event('input'));

      expect(component.form.controls.cpf.value).toBe('529.982.247-25');
    });

    it('deve habilitar o campo telefone e aplicar a máscara de celular ao selecionar o tipo "Celular"', () => {
      component.form.controls.typePhone.setValue(EPhoneType.Mobile);
      fixture.detectChanges();

      expect(component.form.controls.phone.disabled).toBe(false);

      component.onPhoneInput({ target: { value: '11987654321' } } as unknown as Event);

      expect(component.form.controls.phone.value).toBe('(11) 98765-4321');
    });

    it('deve habilitar o campo telefone e aplicar a máscara residencial ao selecionar o tipo "Residencial"', () => {
      component.form.controls.typePhone.setValue(EPhoneType.Home);
      fixture.detectChanges();

      expect(component.form.controls.phone.disabled).toBe(false);

      component.onPhoneInput({ target: { value: '1132654321' } } as unknown as Event);

      expect(component.form.controls.phone.value).toBe('(11) 3265-4321');
    });

    it('deve desabilitar e resetar o campo telefone quando o tipo é removido', () => {
      component.form.controls.typePhone.setValue(EPhoneType.Mobile);
      component.onPhoneInput({ target: { value: '11987654321' } } as unknown as Event);
      fixture.detectChanges();

      component.form.controls.typePhone.setValue(null);
      fixture.detectChanges();

      expect(component.form.controls.phone.disabled).toBe(true);
      expect(component.form.controls.phone.value).toBeNull();
    });

    it('não deve fechar a modal ao salvar com formulário inválido', () => {
      component.save();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('deve fechar a modal retornando os dados do formulário ao salvar com sucesso', () => {
      component.form.setValue({
        name: 'Fulano de Tal',
        email: 'fulano@teste.com',
        cpf: '529.982.247-25',
        phone: '',
        typePhone: EPhoneType.Mobile,
      });
      component.form.controls.phone.enable();
      component.form.controls.phone.setValue('(11) 98765-4321');

      component.save();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(component.form.value);
    });

    it('deve fechar a modal sem retornar dados ao cancelar', () => {
      const cancelButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('mat-dialog-actions button:not([color="primary"])')
      ).nativeElement;

      cancelButton.click();

      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });

    it('deve manter o botão salvar desabilitado enquanto o formulário for inválido', () => {
      const saveButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('button[color="primary"]')
      ).nativeElement;

      expect(saveButton.disabled).toBe(true);
    });

    it('deve habilitar o botão salvar e persistir ao clicar quando o formulário for válido', () => {
      component.form.setValue({
        name: 'Fulano de Tal',
        email: 'fulano@teste.com',
        cpf: '529.982.247-25',
        phone: '',
        typePhone: EPhoneType.Mobile,
      });
      component.form.controls.phone.enable();
      component.form.controls.phone.setValue('(11) 98765-4321');
      fixture.detectChanges();

      const saveButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('button[color="primary"]')
      ).nativeElement;

      expect(saveButton.disabled).toBe(false);

      saveButton.click();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(component.form.value);
    });
  });

  describe('modo de edição', () => {
    beforeEach(async () => {
      await setup({ mode: 'edit', user });
    });

    it('deve preencher o formulário com os dados do usuário', () => {
      expect(component.form.value.name).toBe(user.name);
      expect(component.form.value.email).toBe(user.email);
      expect(component.form.value.cpf).toBe(user.cpf);
      expect(component.form.value.typePhone).toBe(user.typePhone);
    });

    it('deve habilitar o campo telefone quando o usuário já possui um tipo de telefone', () => {
      expect(component.form.controls.phone.disabled).toBe(false);
      expect(component.form.value.phone).toBe(user.phone);
    });

    it('não deve estar em modo de visualização', () => {
      expect(component.isViewMode).toBe(false);
    });
  });

  describe('modo de visualização', () => {
    beforeEach(async () => {
      await setup({ mode: 'view', user });
    });

    it('deve estar em modo de visualização', () => {
      expect(component.isViewMode).toBe(true);
    });

    it('deve desabilitar todo o formulário', () => {
      expect(component.form.disabled).toBe(true);
    });

    it('não deve exibir o botão salvar', () => {
      const saveButton = fixture.debugElement.query(By.css('button[color="primary"]'));
      expect(saveButton).toBeNull();
    });
  });
});
