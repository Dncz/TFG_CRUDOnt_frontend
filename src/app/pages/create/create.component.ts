import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable, of, switchMap, tap } from 'rxjs';

import { Class } from '../../interface/classes.interface';
import { CreateService } from './../../service/create.service';
import { ObjectProperty } from '../../interface/object-properties.interface';
import { DataPropertyTest, Restriction } from './../../interface/data-ontology.interface';
import { Intance, RestrictionCardinality } from '../../interface/data-ontology.interface';


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
    this.createService.getClasses().subscribe(classes => {
      this.classes = classes;
      this.loadDataPropertiesTest();
      // this.loadObjectProperties()
    });
  }

  public getClassesName(): string[] {
    return this.classes.map(c => c.className);
  }

  public get_comment(className: string): string{
    const classData = this.classes.find(c => c.className === className);
    return classData ? classData.comment : '';
  }

  public dataPropertiesTest: DataPropertyTest[] = [];
  private loadDataPropertiesTest(): void {
    this.createService.getDataPropertiesTest().subscribe(dataProperties => {
      this.dataPropertiesTest = dataProperties;
    });
  }

  public getRangeName(className: string): string {
    if (this.selectedChipIndex != null) {
      const foundPredicate = this.objectProperies[this.selectedChipIndex].rangeName;
      return foundPredicate ? foundPredicate : 'Not found Predicate?';
    }
    return 'Not found rangeName?';
  }

  public intances: Intance[] = [];
  public loadIntances(rangeName: string): void {
    this.createService.getIntances(rangeName).subscribe(instances => {
      this.intances = instances;
      // console.log('instances', instances);
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

  public getDataProperties(className: string): string[] {
    const dataProperty = this.dataPropertiesTest.find(dataProperty => dataProperty.className === className);
    return dataProperty ? dataProperty.names : [];
  }

  public objectProperies: ObjectProperty[] = [];
  private loadObjectPropertiesByClassName(className: string): Observable<ObjectProperty[]> {
    return this.createService.getObjectProperties(className).pipe(
      tap(properties => {
        this.objectProperies = properties;
      }
    ));
  }

  public restrictionsDataProperties: RestrictionCardinality[] = [];
  private loadResctrictionsByDataProperty(className: string, dataProperty: string): void {
    this.createService.getRestrictions(className, dataProperty).subscribe(restrictions => {
      this.restrictionsDataProperties.push({
        dataPropertyName: dataProperty,
        restrictions: restrictions
      });
    });
  }

  private loadRestrictions(className: string): void {
    const dataProperties = this.getDataProperties(className);
    dataProperties.forEach(dataProperty => {
      this.loadResctrictionsByDataProperty(className, dataProperty);
    });
  }

  public getRestrictionsDataProperties() : RestrictionCardinality[] {
    return this.restrictionsDataProperties;
  }

  public getObjectProperties(className: string): ObjectProperty[] {
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
      // Eliminar todos los controles existentes en el formulario formTestOntology
      const formTestControls = Object.keys(this.formTestOntology.controls);
      formTestControls.forEach(controlName => {
        this.formTestOntology.removeControl(controlName);
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
      this.intances = []; // Limpiar las instancias // TODO: no se si esto es necesario
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
  public view_objectProperties() {
    this.showObjectProperties = !this.showObjectProperties; // Cambia el valor booleano cuando se hace clic en el botón
  }

  // TODO: crear una array par guardar los datos seleccionados de la lista de instancias
  // osea
  // datos a guardas = [{
  //  objectPropertyName: string,
  //  intances: string[],
  // }]
  public selectedChipIndex: number | null = null;
  public toggleSelection(index: number, selectedClassName: string): void {
    if (this.selectedChipIndex === index) {
      this.selectedChipIndex = null; // Deseleccionar si se hace clic en el chip ya seleccionado
      this.intances = []; // Limpiar las instancias
    } else {
      this.selectedChipIndex = index; // Seleccionar el chip si se hace clic en él
      const rangeName = this.getRangeName(selectedClassName);
      if (rangeName !== 'Not found rangeName?' && rangeName !== 'Not found Predicate?') {
        // console.log('rangeName', rangeName);
        this.loadIntances(rangeName);
      }
    }
  }

  public selectedInstances: string[] = [];
  public onSelectionChange(event: MatSelectionListChange) {
    const selectedOptions = event.source.selectedOptions.selected.map(option => option.value);
    this.selectedInstances = selectedOptions;
  }

  public isSelected(index: number): boolean {
    return this.selectedChipIndex === index;
  }

  public formOntology: FormGroup = this.fb.group({
    labelName: ['', [Validators.required,
                        Validators.minLength(3),
                        Validators.pattern('^[A-Z][A-Za-z0-9 ]*$')]],
    dataProperties: this.fb.array([]),
  });

  public formTestOntology: FormGroup = this.fb.group({
    labelName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[A-Z][A-Za-z0-9 ]*$')]]
  });

  public clearForm(): void {
    this.formTestOntology.reset();
    this.formTestOntology.addControl('labelName', this.fb.control('', [Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[A-Z][A-Za-z0-9 ]*$')]));
  }

  public ifControlKeyIsConteinedInNameOfSomeControlOfFormArray(control: string): boolean {
    // primero busca si el nombre del control contiene la palabra 'Array' en el formulario formTestOntology
    // buscar en los nombres del formulario formTestOntology si contiene la palabra control + 'Array'
    const formTestControls = Object.keys(this.formTestOntology.controls);
    return formTestControls.some(controlName => controlName.includes(control + 'Array'));
  }

  public createForm(): void {
    const restrictionsDataProperties = this.getRestrictionsDataProperties();

    restrictionsDataProperties.forEach((data, index) => {
      // añadir cada nombre de la property al formOntology Test
      if (data.restrictions) {
        const findR: Restriction | undefined = data.restrictions.find(restriction => (restriction.typeName === 'someValuesFrom') ||
                                                      (restriction.typeName === 'qualifiedCardinality' && restriction.valueIRI != '1') ||
                                                      (restriction.typeName === 'maxQualifiedCardinality' && restriction.valueIRI != '1') ||
                                                      (restriction.typeName === 'minQualifiedCardinality' && restriction.valueIRI === '1'));
        if (findR) {
          const validators = this.getValidatorsForDataProperty(data.dataPropertyName, data.restrictions);
          this.formTestOntology.addControl(data.dataPropertyName, this.fb.control('', validators));
          this.formTestOntology.addControl(data.dataPropertyName + 'Array', this.fb.array([]));
        } else {
          const validators = this.getValidatorsForDataProperty(data.dataPropertyName, data.restrictions);
          this.formTestOntology.addControl(data.dataPropertyName, this.fb.control('', validators));
        }
      }
    })
  }

  public onAddElementToFormArray(dataProperty: string): void {
    const field = this.formTestOntology.get(dataProperty) as FormControl;
    const formArray = this.formTestOntology.get(dataProperty+'Array') as FormArray;

    if (field.invalid) return;
    if (field.value === '' || field.value === null) return;

    const newElement = this.fb.control(field.value, field.validator);

    formArray.push(newElement);
    field.reset();
  }

  public onDelElementToFormArray(dataProperty: string, index: number): void {
    const formArray = this.formTestOntology.get(dataProperty) as FormArray;
    if (formArray)
      formArray.removeAt(index);
  }

  public getFormArrayOfFormTestOntology(dataProperty: string): FormArray {
    return this.formTestOntology.get(dataProperty) as FormArray;
  }

  // ver si el campo es un formArray o no de FormTestOntology
  public isFormArrayControlOfFormOntology(control: string): boolean {
    const abstractControl = this.formTestOntology.get(control);
    return abstractControl instanceof FormArray;
  }

  private getValidatorsForDataProperty(dataProperty: string, restrictions: Restriction[]): ValidatorFn[] {
    const validators = [Validators.required];

      // console.log('dataProperty', dataProperty);
      // console.log('restrictions', restrictions);
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
            validators.push(Validators.pattern('^-?([1-9]\d*)([\.,]\d+)?$')); // FIX: la exp está bien, pero muestra el error en el campo de texto
            validators.push(Validators.maxLength(10));
            validators.push(Validators.minLength(1));
          } else {
            validators.push(Validators.pattern('^[A-Za-z0-9 ]*$'));
            validators.push(Validators.maxLength(10));
            validators.push(Validators.minLength(1));
          }
          if (restriction.typeName === 'someValuesFrom') {
            validators.shift();
          }
        });
      }
      // console.log('validators', validators);
      return validators;
  }

  public showPlusIconForDataPropertyTypeSomeValuesFrom(dataPropertyArray: string): boolean {
    const restrictions = this.restrictionsDataProperties.find(restriction => restriction.dataPropertyName === dataPropertyArray.replace('Array', ''))?.restrictions;
    const formArray = this.formTestOntology.get(dataPropertyArray) as FormArray;
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

  public addAdditionalDataProperty(index: number): void {
    const control = this.dataPropertiesFormArray;
    control.insert(index + 1, this.fb.control(''));
  }

  public isValidField(field: string): boolean | null {
    return this.formTestOntology.controls[field].errors && this.formTestOntology.controls[field].touched;
  }

  public isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  public isValidFieldInArrayOfFormTestOntology(dataProperty: string, index: number): boolean | null {
    const formArray = this.formTestOntology.get(dataProperty) as FormArray;
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  public getFieldErrorInArrayOfFormTestOntology(dataProperty: string, index: number): string | null {
    const formArray = this.formTestOntology.get(dataProperty) as FormArray;
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
            } else if (patternError.requiredPattern === '^-?([1-9]\d*)([\.,]\d+)?$') {  // FIX: la exp está bien, pero muestra el error en el campo de texto
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

  public getFieldErrorArray(i: number): string | null {
    const control = this.dataPropertiesFormArray.at(i);
    if (!control.errors) {
      return null;
    }

    const errors = control.errors;
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'pattern':
          const patternError = errors['pattern'];
          if (patternError.requiredPattern === '^[A-Z][A-Za-z0-9 ]*$') {
            return 'Invalid pattern. The field must contain only letters, numbers, or spaces. The first letter must be uppercase.';
          } else if (patternError.requiredPattern === '^[0-9 ]*$') {
            return 'Invalid pattern. The field must contain only numbers.';
          } else if (patternError.requiredPattern === '^-?([1-9]\d*)([\.,]\d+)?$') {  // FIX: la exp está bien, pero muestra el error en el campo de texto
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

  public getFieldError(field: string): string | null {
    if (!this.formTestOntology.controls[field].errors) {
      return null;
    }

    const errors = this.formTestOntology.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'pattern':
          const patternError = errors['pattern'];
          if (patternError.requiredPattern === '^[A-Z][A-Za-z0-9 ]*$') {
            return 'Invalid pattern. The field must contain only letters, numbers, or spaces. The first letter must be uppercase.';
          } else if (patternError.requiredPattern === '^[0-9 ]*$') {
            return 'Invalid pattern. The field must contain only numbers.';
          } else if (patternError.requiredPattern === '^-?([1-9]\d*)([\.,]\d+)?$') {  // FIX: la exp está bien, pero muestra el error en el campo de texto
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

  get dataPropertiesFormArray(): FormArray {
    return this.formOntology.get('dataProperties') as FormArray;
  }

  onSubmit(): void {
    if (this.formOntology.invalid) {
      this.formOntology.markAllAsTouched();
      return;
    }

    console.log(this.formOntology.value);
  }

}
