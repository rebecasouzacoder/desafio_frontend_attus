import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchComponent } from '../../components/search/search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CardGridComponent } from "../../components/card-grid/card-grid.component";
import { IUser } from '../../models/user.model';
import { UserService } from '../../services/user.service';
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
  imports: [SearchComponent, MatButtonModule, MatIcon, CardGridComponent],
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
   * Serviço responsável pela comunicação
   * com a API de usuários.
   *
   * @private
   * @memberof UsersListComponent
   */
  private usersService = inject(UserService);

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
   * Realiza a busca dos usuários através da API.
   * atualiza os estados:
   * - loading durante a requisição;
   * - usersList quando os dados são retornados;
   * - error em caso de falha.
   *
   * @private
   * @memberof UsersListComponent
   */
  private loadUsers(): void {
    this.loading.set(true);

    this.usersService.getUsers().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.usersList.set(users);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }
}
