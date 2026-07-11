import { Component, inject, OnInit, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {MatSidenavModule} from '@angular/material/sidenav';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';

/**
 * Componente responsável pela estrutura do menu lateral
 * da aplicação utilizando o componente MatSidenav do Angular Material.
 * Atua como um container de layout, agrupando:
 * - Menu de navegação;
 * - Footer do menu lateral;
 * - Controle visual da área lateral do sistema.
 *
 * @export
 * @class LayoutComponent
 */
@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, MenuComponent, FooterComponent, MatIconModule, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
 /**
  * Serviço do Angular CDK responsável por observar
  * mudanças no tamanho da tela.
  *
  * @private
  * @memberof LayoutComponent
  */
 private breakpoint = inject(BreakpointObserver);

 /**
  * Controla se a aplicação está sendo exibida
  * em um dispositivo mobile.
  *
  * @memberof LayoutComponent
  */
 public isMobile = signal(false);

 /**
  * Inicializa a observação do breakpoint.
  * 
  *
  * @memberof LayoutComponent
  */
 public ngOnInit(): void {
    this.breakpoint
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
 }

}
