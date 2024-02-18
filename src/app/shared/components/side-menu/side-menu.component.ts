import { Component } from '@angular/core';

interface MenuItem {
  title: string;
  route: string;
}

@Component({
  selector: 'shared-side-menu',
  templateUrl: './side-menu.component.html',
  styles: ``
})
export class SideMenuComponent {
  public reactiveMenu: MenuItem[] = [
    { title: 'Create', route: './appOntology/create' },
    { title: 'Update', route: './appOntology/update' },
    { title: 'Delete', route: './appOntology/delete' }
  ];

  public authMEnu: MenuItem[] = [
    { title: 'Registro', route: './auth' }
  ];

}
