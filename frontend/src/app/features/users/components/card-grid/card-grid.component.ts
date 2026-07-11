import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IUser } from '../../models/user.model';
import { IUserCardAction, UserCardActionType } from '../../models/user-card-action.model';

/**
 * Componente responsável pela apresentação visual
 * da lista de usuários em formato de cards.
 *
 * @export
 * @class CardGridComponent
 */
@Component({
  selector: 'app-card-grid',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss',
})
export class CardGridComponent {
  /**
   *  Lista de usuários que serão exibidos nos cards.
   * 
   * O valor é obrigatório e deve ser informado pelo
   * componente pai.
   *
   * @memberof CardGridComponent
   */
  public usersList = input.required<IUser[]>();

  /**
   * Evento emitido quando uma ação é realizada
   * em um usuário.
   *
   * @memberof CardGridComponent
   */
  public action = output<IUserCardAction>();

  public onAction(type: UserCardActionType, user: IUser): void {
    this.action.emit({type, user})
  }
}
