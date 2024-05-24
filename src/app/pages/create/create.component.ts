import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable, of, switchMap, tap } from 'rxjs';

import { CreateService } from './../../service/create.service';
import { Class, DataPropertyForm, DataProperty, InformationForm, Restriction, SelectedOption } from './../../interface/data-ontology.interface';
import { ObjectProperty, Intance, RestrictionCardinality } from '../../interface/data-ontology.interface';
import { ResponseError } from '../../interface/errors-interface';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {

  public classes: Class[] = [];

  constructor(private fb: FormBuilder, public createService: CreateService) {
    console.log('CreateComponent inicializado con CreateService:', createService);
  }

  ngOnInit(): void {
    this.loadDataOntology();
  }

  private loadDataOntology(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.createService.getClasses().subscribe(response => {
      if ('status' in response) {
        console.error(response.error);
        return;
      }
      this.classes = response;
      this.loadDataProperties();
    });
  }

  public getClassesName(): string[] {
    return this.classes.map(c => c.className);
  }

  public getComment(className: string): string{
    const classData = this.classes.find(c => c.className === className);
    return classData ? classData.comment : '';
  }

  public dataPropertiesTest: DataProperty[] = [];
  private loadDataProperties(): void {
    this.createService.getDataProperties().subscribe(dataProperties => {
      this.dataPropertiesTest = dataProperties;
    });
  }

  private getRangeName(): string {
    if (this.selectedChipIndex != null) {
      const foundPredicate = this.objectProperies[this.selectedChipIndex].rangeName;
      return foundPredicate ? foundPredicate : 'Not found Predicate';
    }
    return 'Not found rangeName';
  }

  public titleInstances(): string {
    const range = this.getRangeName();
    if (range === 'Not found rangeName')
      return 'Not found rangeName';
    return `Instances of ${range} and subclases`
  }

  public intances: Intance[] = [];
  private loadIntances(rangeName: string): void {
    this.createService.getIntances(rangeName).subscribe((response: Intance[] | ResponseError) => {
      if ('status' in response) {
        console.error(response.error);
        return;
      }
      this.intances = response;
    });
  }

  public getIntances(): Intance[] {
    return this.intances;
  }

  public getPrincipalNameInstance(intance: Intance): string {
    // retornar el nombre o el label, si label es "No label" retornar el nombre
    return intance.label !== 'No label' ? intance.label : intance.name;
  }

  public track(index: number, instance: Intance): string {
    return instance ? instance.name : " "; // Ajusta esto según la estructura de tus instancias
  }

  private getDataProperties(className: string): string[] {
    const dataProperty = this.dataPropertiesTest.find(dataProperty => dataProperty.className === className);
    return dataProperty ? dataProperty.names : [];
  }

  public objectProperies: ObjectProperty[] = [];
  private loadObjectPropertiesByClassName(className: string): Observable<ObjectProperty[] | ResponseError> {
    return this.createService.getObjectProperties(className).pipe(
      tap((response: ObjectProperty[] | ResponseError) => {
        if ('status' in response) {
          console.error(response.error);
          return;
        }
        this.objectProperies = response;
      }
    ));
  }

  public restrictionsDataProperties: RestrictionCardinality[] = [];
  private loadResctrictionsByDataProperty(className: string, dataProperty: string): void {
    this.createService.getRestrictions(className, dataProperty).subscribe((response: Restriction[] | ResponseError) => {
      if ('status' in response) {
        console.error(response.error);
        return;
      }
      this.restrictionsDataProperties.push({
        dataPropertyName: dataProperty,
        restrictions: response
      });
    });
  }

  private loadRestrictions(className: string): void {
    const dataProperties = this.getDataProperties(className);
    dataProperties.forEach(dataProperty => {
      this.loadResctrictionsByDataProperty(className, dataProperty);
    });
  }

  private getRestrictionsDataProperties() : RestrictionCardinality[] {
    return this.restrictionsDataProperties;
  }

  public getObjectProperties(): ObjectProperty[] {
    return this.objectProperies;
  }

  private clear(): void {
    this.objectProperies = []; // Limpiar las propiedades de objetos
    this.restrictionsDataProperties = []; // Limpiar las restricciones de las propiedades de datos
    this.showObjectProperties = false; // Ocultar la lista de propiedades de datos
    this.selectedChipIndex = null; // Deseleccionar el chip seleccionado
    this.formOntology.markAsUntouched(); // Marcar el formulario como no tocado
  }

  public isLoading: boolean = false;

  // Funcionalidades para mostrar u ocultar el formulario
  public activeForm: string | null = null;
  public toggleForm(className: string): void {
    // Mostrar u ocultar el formulario según el botón presionado
    this.activeForm = (this.activeForm === className) ? null : className;

    if (this.activeForm === className) {
      this.showLoadingBar();
      this.clearForm();
      // Eliminar todos los controles existentes en el formulario formOntology
      const formTestControls = Object.keys(this.formOntology.controls);
      formTestControls.forEach(controlName => {
        this.formOntology.removeControl(controlName);
      });
      this.loadRestrictions(className);
      // Si el formulario está activo, obtener los predicados
      if (this.restrictionsDataProperties.length !== 0) {
        // console.log('restrictionsDataProperties', this.restrictionsDataProperties);
      }
      // Esto es para que se ejecute la función de carga de propiedades de objetos antes de crear el formulario
      this.loadObjectPropertiesByClassName(className).pipe(
        switchMap(() => {
          this.createForm();
          return of(null); // return an observable to maintain the chain
        })
      ).subscribe(() => {
        this.hideLoadingBar();
      });
      this.intances = []; // Limpiar las instancias
      this.formOntology.get('nameInstance')?.setValue(''); // Limpiar el campo de nombre de instancia
    }
    this.clear();
    this.clearForm();
  }

  private showLoadingBar(): void {
    this.isLoading = true;
  }

  private hideLoadingBar(): void {
    this.isLoading = false;
  }

  // Comprobar si el formulario está activo: si el formulario está activo, se muestra el botón de ocultar
  public isFormActive(className: string): boolean {
    return this.activeForm === className;
  }

  // Función para dividir el nombre de la clase en palabras separadas por espacios
  public splitCamelCase(className: string): string {
    return className.split(/(?=[A-Z])/).join(" ");
  }

  // Función para mostrar u ocultar la lista de propiedades de datos
  public showObjectProperties: boolean = false; // Variable para controlar la visibilidad de la lista de checkboxes
  public viewObjectProperties() {
    this.showObjectProperties = !this.showObjectProperties; // Cambia el valor booleano cuando se hace clic en el botón
  }

  public objectPropertiesSelected: SelectedOption[] = [];
  public selectedChipIndex: number | null = null;
  public toggleSelection(index: number, selectedClassName: string): void {
    if (this.selectedChipIndex === index) {
      this.selectedChipIndex = null; // Deseleccionar si se hace clic en el chip ya seleccionado
      this.intances = []; // Limpiar las instancias
      this.selectedInstances = []; // Limpiar las instancias seleccionadas
    } else {
      if (this.selectedChipIndex !== index && this.selectedInstances.length !== 0) {
        // buscar si ya existe el nombre en el array de objectPropertiesSelected
        const found = this.objectPropertiesSelected.find(option => option.objectPropertyName === this.objectProperies[this.selectedChipIndex!].name);
        if (found) {
          found.instances = this.selectedInstances;
        } else {
          this.saveObjectPropertiesOptions();
        }
        this.selectedInstances = [];
      } else if (this.selectedChipIndex !== null && this.selectedInstances.length === 0) {
        const foundIndex = this.objectPropertiesSelected.findIndex(option => option.objectPropertyName === this.objectProperies[this.selectedChipIndex!].name);
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
  }

  private initializeSelectedOptions(chipIndex: number): void {
    const found = this.objectPropertiesSelected.find(option => option.objectPropertyName === this.objectProperies[chipIndex].name);
    if (found) {
      this.selectedInstances = found.instances;
    } else {
      this.selectedInstances = [];
    }
  }

  private saveObjectPropertiesOptions(): void {
    if (this.selectedChipIndex !== null && this.selectedInstances.length !== 0) {
      this.objectPropertiesSelected.push({
        objectPropertyName: this.objectProperies[this.selectedChipIndex].name,
        instances: this.selectedInstances
      });
    }
  }

  public selectedInstances: string[] = [];
  public onSelectionChange(event: MatSelectionListChange) {
    const selectedOptions = event.source.selectedOptions.selected.map(option => option.value);
    if (this.selectedChipIndex !== null) {
      this.selectedInstances = selectedOptions;
    }
  }

  public isSelected(index: number): boolean {
    return this.selectedChipIndex === index;
  }

  public formOntology: FormGroup = this.fb.group({
    labelName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[A-Z][A-Za-z0-9 ]*$')]]
  });

  private clearForm(): void {
    this.formOntology.reset();
    this.formOntology.addControl('labelName', this.fb.control('', [Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[A-Z][A-Za-z0-9 ]*$')]));
  }

  public ifControlKeyIsConteinedInNameOfSomeControlOfFormArray(control: string): boolean {
    // primero busca si el nombre del control contiene la palabra 'Array' en el formulario formOntology
    // buscar en los nombres del formulario formOntology si contiene la palabra control + 'Array'
    const formTestControls = Object.keys(this.formOntology.controls);
    return formTestControls.some(controlName => controlName.includes(control + 'Array'));
  }

  private createForm(): void {
    const restrictionsDataProperties = this.getRestrictionsDataProperties();

    restrictionsDataProperties.forEach((data, index) => {
      // añadir cada nombre de la property al formOntology Test
      if (data.restrictions) {
        const findR: Restriction | undefined = data.restrictions.find(restriction => (restriction.typeName === 'someValuesFrom') ||
                                                      (restriction.typeName === 'qualifiedCardinality' && restriction.valueIRI != '1') ||
                                                      (restriction.typeName === 'maxQualifiedCardinality' && restriction.valueIRI != '1') ||
                                                      (restriction.typeName === 'minQualifiedCardinality' && restriction.valueIRI === '1'));
        if (findR) {
          const validators = this.getValidatorsForDataProperty(data.restrictions);
          this.formOntology.addControl(data.dataPropertyName, this.fb.control('', validators));
          this.formOntology.addControl(data.dataPropertyName + 'Array', this.fb.array([]));
        } else {
          console.log('Restricciones: ', data.restrictions)
          const validators = this.getValidatorsForDataProperty(data.restrictions);
          console.log('Validators: ', validators)
          this.formOntology.addControl(data.dataPropertyName, this.fb.control('', validators));
        }
      }
    })
  }

  public onAddElementToFormArray(dataProperty: string): void {
    const field = this.formOntology.get(dataProperty) as FormControl;
    const formArray = this.formOntology.get(dataProperty+'Array') as FormArray;

    if (field.invalid) return;
    if (field.value === '' || field.value === null) return;

    const newElement = this.fb.control(field.value, field.validator);

    formArray.push(newElement);
    field.reset();
  }

  public onDelElementToFormArray(dataProperty: string, index: number): void {
    const formArray = this.formOntology.get(dataProperty) as FormArray;
    if (formArray)
      formArray.removeAt(index);
  }

  public getFormArrayOfFormOntology(dataProperty: string): FormArray {
    return this.formOntology.get(dataProperty) as FormArray;
  }

  // ver si el campo es un formArray o no de formOntology
  public isFormArrayControlOfFormOntology(control: string): boolean {
    const abstractControl = this.formOntology.get(control);
    return abstractControl instanceof FormArray;
  }

  private getValidatorsForDataProperty(restrictions: Restriction[]): ValidatorFn[] {
    const validators = [Validators.required];

      if (restrictions) {
        restrictions.forEach(restriction => {

          if (restriction.valueIRI.includes('string')) {
            validators.push(Validators.pattern('^[A-Z][A-Za-z0-9 ]*$'));
            validators.push(Validators.minLength(3));
          } else
          if (restriction.valueIRI.includes('integer')) {
            validators.push(Validators.pattern('^[0-9 ]*$'));
            validators.push(Validators.maxLength(10));
            validators.push(Validators.minLength(1));
          } else if (restriction.valueIRI.includes('double')) {
            validators.push(Validators.pattern('^([1-9]\d*|0)([\.]\d+)?$')); // FIX: la exp está bien, pero muestra el error en el campo de texto
            validators.push(Validators.maxLength(10));
            validators.push(Validators.minLength(1));
          } else {
            validators.push(Validators.pattern('^[A-Za-z0-9 ]*$'));
            validators.push(Validators.maxLength(146));
            validators.push(Validators.minLength(1));
          }
          if (restriction.typeName === 'someValuesFrom') {
            validators.shift();
          }
        });
      }

      return validators;
  }

  public showPlusIconForDataPropertyTypeSomeValuesFrom(dataPropertyArray: string): boolean {
    const restrictions = this.restrictionsDataProperties.find(restriction => restriction.dataPropertyName === dataPropertyArray.replace('Array', ''))?.restrictions;
    const formArray = this.formOntology.get(dataPropertyArray) as FormArray;
    if (restrictions) {
      let showButton = false;
      restrictions.forEach(restriction => {
        switch (restriction.typeName) {
          case 'someValuesFrom':
            showButton = true;
            break;

          case 'maxQualifiedCardinality':
            if (restriction.valueIRI === "1") {
              showButton = false;
            }
            if (formArray.length > parseInt(restriction.valueIRI)) {
              showButton = false;
            } else {
              showButton = true;
            }
            break;

          case 'minQualifiedCardinality':
            if (restriction.valueIRI === '1') {
              showButton = true;
            }
            if(formArray.length < parseInt(restriction.valueIRI)) {
              showButton = true;
            } else {
              showButton = false;
            }

            break;

          case 'qualifiedCardinality':
            if (restriction.valueIRI === '1') {
              showButton = false;
            }

            if (formArray.length > parseInt(restriction.valueIRI)) {
              showButton = false;
            } else {
              showButton = true;
            }
            break;

          default:
            break;
        }
      });

      return showButton;
    }
    return false;
  }

  public isValidField(field: string): boolean | null {
    return this.formOntology.controls[field].errors && this.formOntology.controls[field].touched;
  }

  public isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  public isValidFieldInArrayOfFormOntology(dataProperty: string, index: number): boolean | null {
    const formArray = this.formOntology.get(dataProperty) as FormArray;
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  public getFieldErrorInArrayOfFormOntology(dataProperty: string, index: number): string | null {
    const formArray = this.formOntology.get(dataProperty) as FormArray;
    if (!formArray.controls[index].errors) {
      return null;
    }

    const errors = formArray.controls[index].errors;
    for (const key of Object.keys(errors || {})) {
      if (errors) {
        switch (key) {
          case 'required':
            return 'This field is required';
          case 'pattern':
            const patternError = errors['pattern'];
            if (patternError.requiredPattern === '^[A-Z][A-Za-z0-9 ]*$') {
              return 'Invalid pattern. The field must contain only letters, numbers, or spaces. The first letter must be uppercase.';
            } else if (patternError.requiredPattern === '^[0-9 ]*$') {
              return 'Invalid pattern. The field must contain only numbers.';
            } else if (patternError.requiredPattern === '^([1-9]\d*|0)([\.]\d+)?$') {  // FIX: la exp está bien, pero muestra el error en el campo de texto
              return 'Invalid pattern. The field must contain only numbers or decimal points and using dot as decimal separator.';
            } else {
              return 'Invalid pattern.';
            }
          case 'minlength':
            return `The field must have at least ${ errors['minlength'].requiredLength } characters`;
          case 'maxlength':
            return `The field must have at most ${ errors['maxlength'].requiredLength } characters`;
          default:
            return 'Unknown error';
        }
      }
    }
    return null;
  }

  public getFieldError(field: string): string | null {
    if (!this.formOntology.controls[field].errors) {
      return null;
    }

    const errors = this.formOntology.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'pattern':
          const patternError = errors['pattern'];
          console.log(patternError.requiredPattern)
          if (patternError.requiredPattern === '^[A-Z][A-Za-z0-9 ]*$') {
            return 'Invalid pattern. The field must contain only letters, numbers, or spaces. The first letter must be uppercase.';
          } else if (patternError.requiredPattern === '^[0-9 ]*$') {
            return 'Invalid pattern. The field must contain only numbers.';
          } else if (patternError.requiredPattern === '^([1-9]\d*|0)([\.]\d+)?$') {  // FIX: la exp está bien, pero muestra el error en el campo de texto
            return 'Invalid pattern. The field must contain only numbers or decimal points and using dot as decimal separator.';
          } else {
            return 'Invalid pattern.';
          }
        case 'minlength':
          return `The field must have at least ${ errors['minlength'].requiredLength } characters`;
        case 'maxlength':
          return `The field must have at most ${ errors['maxlength'].requiredLength } characters`;
        default:
          return 'Unknown error';
      }
    }
    return null;
  }

  public abbreviateInternName(className: string): string {
    const abreviateClass = className.slice(0, 5) + '_';
    const labelFormValid = this.formOntology.get('labelName')?.valid;
    if (labelFormValid) {
      const labelForm: string = this.formOntology.get('labelName')?.value;
      const words: string[] = labelForm.split(' ');
      const abbreviatedWords: string[] = words.map(word => word.slice(0, 4));
      const abbreviatedLabel: string = abbreviatedWords.join('_');
      return abreviateClass + abbreviatedLabel;
    }
    return abreviateClass + Math.random().toString(10);
  }

  public saveInformationOfForm(className: string): InformationForm | Error {
    if (this.formOntology.invalid) {
      this.formOntology.markAllAsTouched();
      return new Error('The form is invalid');
    }

    const internName = this.abbreviateInternName(className);
    const label = this.formOntology.get('labelName')?.value;
    const dataPropertiesNames: string[] | undefined = this.dataPropertiesTest.find(dataProperty => dataProperty.className === className)?.names;
    if (dataPropertiesNames) {
      const dataProperties: DataPropertyForm[] = dataPropertiesNames.map(dataPropertyName => {
        const formArray = this.formOntology.get(dataPropertyName + 'Array') as FormArray;
        if (formArray) {
          const values: string[] = formArray.controls.map(control => control.value);
          return {
            IRI: dataPropertyName,
            valuesFormArray: values
          };
        } else {
          return {
            IRI: dataPropertyName,
            valueForm: this.formOntology.get(dataPropertyName)?.value
          };
        }
      });

      const objectProperties: SelectedOption[] = this.objectPropertiesSelected;
      return {
        internName: internName,
        label: label,
        dataProperties: dataProperties,
        objectProperties: objectProperties
      }
    }

    return new Error('Error to save information of form');
  }

  public removeHas(name: string): string {
    return name.replace('has', '');
  }

  onSubmit(): void {
    if (this.formOntology.invalid) {
      this.formOntology.markAllAsTouched();
      return;
    }

    if (this.activeForm === null)
      return;

    const informationForm: InformationForm | Error = this.saveInformationOfForm(this.activeForm);
    if (informationForm instanceof Error) {
      console.error(informationForm);
      return;
    }
    console.log(informationForm);

    this.createService.createInstance(informationForm, this.activeForm).subscribe(response => {
      if (response.status === 201) {
        const dataPropertiesNames: string[] | undefined = this.dataPropertiesTest.find(dataProperty => dataProperty.className === this.activeForm)?.names;
        if (dataPropertiesNames != undefined) {
          dataPropertiesNames.forEach(dataPropertyName => {
            const formArray: FormArray = this.formOntology.get(dataPropertyName + 'Array') as FormArray;
            if (formArray) {
              formArray.clear();
            }
          });
        }
        this.formOntology.reset();
      }
      console.log(response);
    });
    console.log(this.formOntology.value);
  }

}
