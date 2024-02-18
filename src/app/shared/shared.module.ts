import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { PaginationComponent } from './components/pagination/pagination.component';



@NgModule({
  declarations: [
    SideMenuComponent,
    HeaderComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SideMenuComponent,
    HeaderComponent,
    PaginationComponent
  ],
  // bootstrap: [HeaderComponent]
})
export class SharedModule { }
