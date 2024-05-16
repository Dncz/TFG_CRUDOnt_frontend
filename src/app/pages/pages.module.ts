import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

import { PagesRoutingModule } from './pages-routing.module';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ChipsComponent } from './create/components/chips/chips.component';


@NgModule({
    declarations: [
        CreateComponent,
        UpdateComponent,
        DeleteComponent,
        ChipsComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialModule,

    ]
})
export class PagesModule { }
