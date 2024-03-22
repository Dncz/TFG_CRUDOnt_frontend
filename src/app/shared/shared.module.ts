import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    SideMenuComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    // MaterialModule
  ],
  exports: [
    SideMenuComponent,
    HeaderComponent
  ],
  // bootstrap: [HeaderComponent]
})
export class SharedModule { }
