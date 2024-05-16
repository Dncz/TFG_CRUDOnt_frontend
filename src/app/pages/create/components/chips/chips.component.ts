import { CreateService } from './../../../../service/create.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ObjectProperty, Intance, SelectedOption } from '../../../../interface/data-ontology.interface';
import { ResponseError } from '../../../../interface/errors-interface';


@Component({
  selector: 'app-create-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input() public objectProperiesChild: ObjectProperty[] = [];
  @Input() public selectedInstancesChild: string[] = [];
  @Output() public chipIndex: EventEmitter<number | null> = new EventEmitter();

  public emitEvent(): void {
    if (this.selectedChipIndex !== null) {
      this.chipIndex.emit(this.selectedChipIndex);
    }
  }

  constructor(private CreateService: CreateService) { }

  public getObjectProperties(): ObjectProperty[] {
    return this.objectProperiesChild;
  }

  public selectedChipIndex: number | null = null;
  public objectPropertiesSelected: SelectedOption[] = [];
  public toggleSelection(index: number): void {
    if (this.selectedChipIndex === index) {
      this.selectedChipIndex = null; // Deseleccionar si se hace clic en el chip ya seleccionado
      this.intances = []; // Limpiar las instancias
      this.selectedInstancesChild = []; // Limpiar las instancias seleccionadas
    } else {
      if (this.selectedChipIndex !== index && this.selectedInstancesChild.length !== 0) {
        // buscar si ya existe el nombre en el array de objectPropertiesSelected
        const found = this.objectPropertiesSelected.find(option => option.objectPropertyName === this.objectProperiesChild[this.selectedChipIndex!].name);
        if (found) {
          found.instances = this.selectedInstancesChild;
        } else {
          this.saveObjectPropertiesOptions();
        }
        this.selectedInstancesChild = [];
      } else if (this.selectedChipIndex !== null && this.selectedInstancesChild.length === 0) {
        const foundIndex = this.objectPropertiesSelected.findIndex(option => option.objectPropertyName === this.objectProperiesChild[this.selectedChipIndex!].name);
        if (foundIndex !== -1) {
          this.objectPropertiesSelected.splice(foundIndex, 1);
        }
      }

      this.selectedChipIndex = index; // Seleccionar el chip si se hace clic en él
      this.initializeSelectedOptions(index);
      const rangeName = this.getRangeName();
      if (rangeName !== 'Not found rangeName?' && rangeName !== 'Not found Predicate?') {
        this.loadIntances(rangeName);
      }
    }
    this.emitEvent();
  }

  public intances: Intance[] = [];
  private loadIntances(rangeName: string): void {
    this.CreateService.getIntances(rangeName).subscribe((response: Intance[] | ResponseError) => {
      if ('status' in response) {
        console.error(response.error);
        return;
      }
      this.intances = response;
    });
  }

  public getRangeName(): string {
    if (this.selectedChipIndex != null) {
      const foundPredicate = this.objectProperiesChild[this.selectedChipIndex].rangeName;
      return foundPredicate ? foundPredicate : 'Not found Predicate?';
    }
    return 'Not found rangeName?';
  }

  public initializeSelectedOptions(chipIndex: number): void {
    const found = this.objectPropertiesSelected.find(option => option.objectPropertyName === this.objectProperiesChild[chipIndex].name);
    if (found) {
      this.selectedInstancesChild = found.instances;
    } else {
      this.selectedInstancesChild = [];
    }
  }


  public isSelected(index: number): boolean {
    return this.selectedChipIndex === index;
  }

  public saveObjectPropertiesOptions(): void {
    if (this.selectedChipIndex !== null && this.selectedInstancesChild.length !== 0) {
      this.objectPropertiesSelected.push({
        objectPropertyName: this.objectProperiesChild[this.selectedChipIndex].name,
        instances: this.selectedInstancesChild
      });
    }
  }

}
