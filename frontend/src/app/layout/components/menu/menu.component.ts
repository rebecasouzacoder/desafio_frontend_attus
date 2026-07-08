import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { IMenu } from '../../models/menu.model';

import { MatIconModule } from '@angular/material/icon';

/**
 * Componente responsável pela renderização e controle do menu lateral
 * da aplicação.
 *
 * @export
 * @class MenuComponent
 */
@Component({
  selector: 'app-menu',
  imports: [MatIconModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
/**
 * Lista de itens disponíveis no menu de navegação.
 *
 * @type {IMenu[]}
 * @memberof MenuComponent
 */
public menuItems: IMenu[] = [
  {
    title: 'Usuários',
    url: 'users-list',
    icon: 'supervised_user_circle',
  }
];

/**
 * Instância do Router responsável pelo controle
 * da navegação e identificação da rota atual.
 *
 * @private
 * @memberof MenuComponent
 */
private router = inject(Router);

/**
 * Verifica se o item do menu corresponde à rota atualmente ativa.
 * Utilizado para aplicar estilos de destaque no item selecionado.
 *
 * @param {string} url
 * @return {*}  {boolean}
 * @memberof MenuComponent
 */
public isActive(url: string): boolean {
    return this.router.url.includes(url);
}

/**
 * Navega para a url do item selecionado
 *
 * @param {string} url
 * @memberof MenuComponent
 */
public goToUrl(url: string): void {
  this.router.navigate([url])
}
}
