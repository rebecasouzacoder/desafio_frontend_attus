import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

/**
 * Componente responsável pela estrutura do menu lateral
 * da aplicação utilizando o componente MatSidenav do Angular Material.
 * Atua como um container de layout, agrupando:
 * - Menu de navegação;
 * - Footer do menu lateral;
 * - Controle visual da área lateral do sistema.
 *
 * @export
 * @class SidenavComponent
 */
@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule, MenuComponent, FooterComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

}
