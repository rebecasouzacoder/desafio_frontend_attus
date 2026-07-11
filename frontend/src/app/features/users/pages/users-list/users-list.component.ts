import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchComponent } from '../../components/search/search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CardGridComponent } from '../../components/card-grid/card-grid.component';
import { IUser } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { EmptyResultComponent } from '../../components/empty-result/empty-result.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { IUserCardAction } from '../../models/user-card-action.model';
import { ModalUserComponent } from '../../dialog/modal-user/modal-user.component';
/**
 * Componente responsável pela listagem de usuários do sistema.
 * Responsabilidades:
 * - Realizar a busca dos usuários através do UserService;
 * - Gerenciar estados da tela (carregamento e erro);
 * - Disponibilizar os dados para os componentes de apresentação.
 *
 * @export
 * @class UsersListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-users-list',
  imports: [
    SearchComponent,
    MatButtonModule,
    MatIcon,
    CardGridComponent,
    EmptyResultComponent,
    LoadingComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  /**
   * Lista de usuários carregados da API.
   *
   * @memberof UsersListComponent
   */
  public usersList = signal<IUser[]>([]);

  /**
   * Indica se a busca de usuários está em andamento.
   *
   * @memberof UsersListComponent
   */
  public loading = signal(false);

  /**
   * Indica se ocorreu erro durante a comunicação
   *
   * @memberof UsersListComponent
   */
  public error = signal(false);

  /**
   * Guarda o último termo de busca utilizado, para permitir
   * que uma nova tentativa (retry) após erro repita a mesma consulta.
   *
   * @private
   * @memberof UsersListComponent
   */
  private lastSearch?: string;

  /**
   * Serviço responsável pela comunicação
   * com a API de usuários.
   *
   * @private
   * @memberof UsersListComponent
   */
  private usersService = inject(UserService);

  private toast = inject(ToastService);

  private dialog = inject(MatDialog);

  /**
   * Referência utilizada pelo Angular para controlar
   * o ciclo de vida da subscription.
   *
   * @private
   * @memberof UsersListComponent
   */
  private destroyRef = inject(DestroyRef);

  /**
   * Inicializa o carregamento dos usuários
   * ao renderizar o componente.
   *
   * @memberof UsersListComponent
   */
  public ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Realiza a busca de usuários conforme termo informado.
   *
   * @param {string} value
   * @memberof UsersListComponent
   */
  public onSearch(value: string): void {
    this.lastSearch = value;
    this.loadUsers(value);
  }

  /**
   * Repete a última busca realizada após uma falha no carregamento.
   *
   * @memberof UsersListComponent
   */
  public onRetry(): void {
    this.loadUsers(this.lastSearch);
  }

  /**
   *
   *
   * @param {IUserCardAction} action
   * @memberof UsersListComponent
   */
  public handleUserAction(action: IUserCardAction): void {
    const { type, user } = action;
    this.openUserModal(type, user);
  }

  /**
   *
   *
   * @private
   * @param {('create' | 'edit' | 'view')} mode
   * @param {IUser} [user]
   * @memberof UsersListComponent
   */
  private openUserModal(mode: 'create' | 'edit' | 'view', user?: IUser): void {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      width: '90vw',
      maxWidth: '90vw',
      data: {
        mode,
        user,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {

        if (!result) {
          return;
        }

        this.loading.set(true);

        if (mode === 'create') {
          this.createUser(result);
        }

        if (mode === 'edit' && user?.id) {
          this.updateUser(user.id, result);
        }
      });
  }

  /**
   * Realiza a busca dos usuários através da API.
   * atualiza os estados:
   * - loading durante a requisição;
   * - usersList quando os dados são retornados;
   * - error em caso de falha.
   *
   * @private
   * @memberof UsersListComponent
   */
  private loadUsers(name?: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.usersList.set([]);

    this.usersService
      .getUsers(name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.usersList.set(users);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);

          this.toast.error('Não foi possível carregar os usuários');
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  /**
   * Realiza a criação de um novo usuário através da API.
   *
   * Após a criação com sucesso:
   * - Exibe uma mensagem de confirmação para o usuário;
   * - Atualiza a listagem de usuários para refletir o novo registro.
   *
   * Em caso de falha:
   * - Exibe uma mensagem de erro através do ToastService.
   *
   * @private
   * @param {IUser} body
   * @memberof UsersListComponent
   */
  private createUser(body: IUser): void {
    this.usersService
      .createUser(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Usuário criado com sucesso');

          this.loadUsers();
        },

        error: () => {
          this.toast.error('Não foi possível criar usuário');
        },
      });
  }

  /**
   * Realiza a atualização de um usuário existente através da API.
   * Após a atualização com sucesso:
   * - Exibe uma mensagem de confirmação para o usuário;
   * - Atualiza a listagem de usuários para manter os dados sincronizados.
   *
   * Em caso de falha:
   * - Exibe uma mensagem de erro através do ToastService.
   * @private
   * @param {number} id
   * @param {Partial<IUser>} body
   * @memberof UsersListComponent
   */
  private updateUser(id: number, body: Partial<IUser>): void {
    this.usersService
      .updateUser(id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Usuário atualizado com sucesso');

          this.loadUsers();
        },
        error: () => {
          this.toast.error('Não foi possível atualizar usuário');
        },
      });
  }
}
