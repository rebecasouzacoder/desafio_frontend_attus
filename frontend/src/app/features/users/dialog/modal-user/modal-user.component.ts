import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IUserModalData } from '../../models/user-modal.model';
import { EPhoneType, PhoneTypeLabel } from '../../models/phone-type.enum';

import { maskCpf, maskPhone } from '../../../../shared/ultils/mask.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { cpfValidator } from '../../../../shared/ultils/cpf-validator';


/**
 * Componente responsável pelo formulário de criação,
 * edição e visualização de usuários.
 *
 * Responsabilidades:
 * - Gerenciar formulário reativo;
 * - Aplicar validações dos campos;
 * - Preencher dados no modo edição;
 * - Bloquear campos no modo visualização;
 * - Retornar dados preenchidos para o componente pai.
 *
 * Modos suportados:
 * - create: criação de usuário;
 * - edit: edição de usuário existente;
 * - view: visualização somente leitura.
 *
 * @export
 * @class ModalUserComponent
 */
@Component({
  selector: 'app-modal-user',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-user.component.html',
  styleUrl: './modal-user.component.scss',
})
export class ModalUserComponent implements OnInit {


  /**
   * Responsável pela criação do formulário reativo.
   *
   * @private
   * @memberof ModalUserComponent
   */
  private fb = inject(FormBuilder);


  /**
   * Referência utilizada para controlar
   * fechamento da modal.
   *
   * @private
   * @memberof ModalUserComponent
   */
  private dialogRef = inject(
    MatDialogRef<ModalUserComponent>
  );


  /**
   * Dados recebidos ao abrir a modal.
   *
   * Contém:
   * - modo da operação;
   * - usuário selecionado quando aplicável.
   *
   * @memberof ModalUserComponent
   */
  public data = inject<IUserModalData>(
    MAT_DIALOG_DATA
  );


  /**
   * Lista de tipos de telefone disponíveis
   * para seleção no formulário.
   *
   * @memberof ModalUserComponent
   */
  public phoneTypes = Object.values(PhoneTypeLabel);

  /**
   * Formulário responsável pelos dados do usuário.
   *
   * @memberof ModalUserComponent
   */
  public form = this.fb.group({

    name: [
      '',
      Validators.required
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    cpf: [
      '',
      [
        Validators.required,
        cpfValidator()
      ]
    ],

    phone: [
      {
        value: '',
        disabled: true
      },
      Validators.required
    ],

    typePhone: this.fb.control<EPhoneType | null>(
      null,
      Validators.required
    ),

  });

  private destroyRef = inject(DestroyRef);


  /**
   * Inicializa o formulário conforme o modo recebido.
   *
   * @memberof ModalUserComponent
   */
  public ngOnInit(): void {
    this.buildForm();
  }


  /**
   * Aplica máscara de CPF no campo.
   *
   * @param {Event} event Evento disparado pelo input.
   *
   * @memberof ModalUserComponent
   */
  public formatCpf(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.form.controls.cpf.setValue(
      maskCpf(input.value),
      {
        emitEvent: false
      }
    );

  }


 public onPhoneInput(event: Event): void {

  const input = event.target as HTMLInputElement;

  const value = input.value;


  const type = this.form.controls.typePhone.value;

  this.form.controls.phone.setValue(
    maskPhone(value, type),
    {
      emitEvent: false
    }
  );
}

  /**
   * Retorna os dados preenchidos no formulário.
   *
   * Apenas permite fechamento quando o formulário
   * estiver válido.
   *
   * @memberof ModalUserComponent
   */
  public save(): void {

    if(this.form.invalid) {
      return;
    }

    this.dialogRef.close(
      this.form.value
    );

  }


  /**
   * Fecha a modal sem retornar dados.
   *
   * @memberof ModalUserComponent
   */
  public close(): void {

    this.dialogRef.close();

  }


  /**
   * Indica se a modal está em modo visualização.
   *
   * @readonly
   * @returns {boolean}
   *
   * @memberof ModalUserComponent
   */
  public get isViewMode(): boolean {

    return this.data.mode === 'view';

  }
  


  /**
   * Inicializa os valores do formulário.
   *
   * Quando recebe usuário:
   * - Preenche os campos automaticamente.
   *
   * Quando está no modo visualização:
   * - Desabilita edição dos campos.
   *
   * @private
   * @memberof ModalUserComponent
   */
  private buildForm(): void {

    if(this.data.user) {
      this.form.patchValue(
        this.data.user
      );

      // O campo telefone nasce desabilitado (só é liberado quando um
      // tipo de telefone é selecionado). Em edição, o patchValue acima
      // já traz um tipo válido, então habilitamos o campo aqui mesmo,
      // sem resetar o valor recém-preenchido.
      if (this.data.user.typePhone) {
        this.form.controls.phone.enable();
      }
    }

    if(this.data.mode === 'view') {
      this.form.disable();
    }

    this.changeTypePhone();
  }

  private changeTypePhone(): void {
    this.form.controls.typePhone.valueChanges
  .pipe(
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe(type => {

    this.form.controls.phone.reset();

    if(type) {
      this.form.controls.phone.enable();
    } else {
      this.form.controls.phone.disable();
    }

  });
  }

}