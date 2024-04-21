import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from '../material/material.module';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    HeaderComponent,
    LoadingBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatProgressBarModule
  ],
  exports: [
    HeaderComponent,
    LoadingBarComponent
  ],
  // bootstrap: [HeaderComponent]
})
export class SharedModule { }
