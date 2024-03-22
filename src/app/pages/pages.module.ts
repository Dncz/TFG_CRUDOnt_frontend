import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';


@NgModule({
    declarations: [
        CreateComponent,
        UpdateComponent,
        DeleteComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule
    ]
})
export class PagesModule { }
