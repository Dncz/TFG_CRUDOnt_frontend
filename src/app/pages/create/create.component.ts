import { DataPropertyTest, Restriction } from './../../interface/data-ontology.interface';
import { CreateService } from './../../service/create.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Class } from '../../interface/classes.interface';
import { DataPropertiesClass } from '../../interface/data-properties.interface';
import { ObjectProperty } from '../../interface/object-properties.interface';
import { DataProperty, Intance, RestrictionCardinality } from '../../interface/data-ontology.interface';
import { Observable, of, switchMap, tap } from 'rxjs';


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
    // this.loadClasses();
    this.loadDataOntology();
    // this.formOntology.reset();
  }

  // public dataOntology: DataOntology[] = [];
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

  // public dataProperties: DataProperty[] = [];
  // private loadDataPropertiesByClassName(className: string): void {
  //   this.createService.getDataProperties(className).subscribe(properties => {
  //     this.dataProperties = properties;
  //   });
  // }

  public dataPropertiesTest: DataPropertyTest[] = [];
  private loadDataPropertiesTest(): void {
    this.createService.getDataPropertiesTest().subscribe(dataProperties => {
      this.dataPropertiesTest = dataProperties;
    });
  }

  public getRangeName(className: string): string {
    if (this.selectedChipIndex != null) {
      // const selectedObjectProperty = this.objectProperies[this.selectedChipIndex].name;
      // const foundPredicate = this.predicates.find(predicate => predicate.objectPropertyName === selectedObjectProperty);
      const foundPredicate = this.objectProperies[this.selectedChipIndex].rangeName;
      return foundPredicate ? foundPredicate : 'Not found Predicate?';
    }
    return 'Not found rangeName?';
  }

  public intances: Intance[] = [];
  public loadIntances(rangeName: string): void {
    this.createService.getIntances(rangeName).subscribe(instances => {
      this.intances = instances;
      console.log('instances', instances);
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
  // public getDataProperties(className: string): DataProperty[] {
  //   return this.dataProperties;
  // }


  public objectProperies: ObjectProperty[] = [];
  private loadObjectPropertiesByClassName(className: string): Observable<ObjectProperty[]> {
    // this.createService.getObjectProperties(className).subscribe(properties => {
    //   this.objectProperies = properties;
    //   this.loadRestrictions(className);
    //this.createForm(className); // TODO: ver si esto se puede hacer de otra forma!!!!
    // });
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
      // console.log('restrictions', restrictions);
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

  // public mockDataForm: FormGroup = this.fb.group({
  //   className: [''],
  //   dataTypeProperties: this.fb.array([]),
  // });

  private clear(): void {
    this.objectProperies = []; // Limpiar las propiedades de objetos
    this.restrictionsDataProperties = []; // Limpiar las restricciones de las propiedades de datos
    this.showObjectProperties = false; // Ocultar la lista de propiedades de datos
    this.selectedChipIndex = null; // Deseleccionar el chip seleccionado
    this.formOntology.markAsUntouched(); // Marcar el formulario como no tocado
  }
  // Funcionalidades para mostrar u ocultar el formulario
  public activeForm: string | null = null;
  public toggleForm(className: string): void {
    // Mostrar u ocultar el formulario según el botón presionado
    this.activeForm = (this.activeForm === className) ? null : className;

    if (this.activeForm === className) {
      this.clearDataPropertiesFormArray();
      this.loadRestrictions(className);
      // Si el formulario está activo, obtener los predicados
      if (this.restrictionsDataProperties.length !== 0) {
        console.log('restrictionsDataProperties', this.restrictionsDataProperties);
      }
      // Esto es para que se ejecute la función de carga de propiedades de objetos antes de crear el formulario
      this.loadObjectPropertiesByClassName(className).pipe(
        switchMap(() => {
          this.createForm(className);
          return of(null); // return an observable to maintain the chain
        })
      ).subscribe();
      // this.loadDataPropertiesByClassName(className);
      this.intances = []; // Limpiar las instancias // TODO: no se si esto es necesario
      //this.createForm(className); // FIX: Si pongo eso ahi, va bien y no hay errores del tipo "Cannot read property", pero las restricciones para las validationes no se aplican
      this.formOntology.get('nameInstance')?.setValue(''); // Limpiar el campo de nombre de instancia
    }
    this.clear();
    // this.objectProperies = []; // Limpiar las propiedades de objetos
    // this.showObjectProperties = false; // Ocultar la lista de propiedades de datos
    // this.selectedChipIndex = null; // Deseleccionar el chip seleccionado
    // this.formOntology.markAsUntouched(); // Marcar el formulario como no tocado
    // this.restrictionsDataProperties = []; // Limpiar las restricciones de las propiedades de datos
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
        console.log('rangeName', rangeName);
        this.loadIntances(rangeName);
      }
    }
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

  // TODO: poner las restricciones de las data properties
  public createForm(className: string): void {
    // Limpiar el FormArray de dataProperties
    // while (this.dataPropertiesFormArray.length !== 0) {
    //   this.dataPropertiesFormArray.removeAt(0);
    // }
    this.clearDataPropertiesFormArray();

    const dataProperties = this.getDataProperties(className);
    const restrictionsDataProperties = this.getRestrictionsDataProperties();

    dataProperties.forEach(dataProperty => {
      const validators = [Validators.required];

      const restrictions = restrictionsDataProperties.find(restriction => restriction.dataPropertyName === dataProperty)?.restrictions;
      console.log('restrictions', restrictions);
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
      console.log('validators', validators);

      const control = this.fb.control('', validators);
      this.dataPropertiesFormArray.push(control);
    });
  }

  private clearDataPropertiesFormArray(): void {
    while (this.dataPropertiesFormArray.length !== 0) {
      this.dataPropertiesFormArray.removeAt(0);
    }
  }

  public showPlusIconForDataPropertyTypeSomeValuesFrom(dataProperty: string): boolean {
    const restrictions = this.restrictionsDataProperties.find(restriction => restriction.dataPropertyName === dataProperty)?.restrictions;
    if (restrictions) {
      // return restrictions.some(restriction => restriction.typeName === 'someValuesFrom');
      let showButton = false;
      //let counterMax = 0;
      //let counterMin = 0;
      restrictions.forEach(restriction => {
        switch (restriction.typeName) {
          case 'someValuesFrom':
            showButton = true;
            break;

          case 'maxQualifiedCardinality':
            if (restriction.valueIRI === "1") {
              showButton = false;
            }
            //counterMax++;
            //showButton = true;
            break;

          case 'minQualifiedCardinality':
            if (restriction.valueIRI === '1') {
              showButton = true;
            }
            //counterMin++;
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

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
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
    if (!this.formOntology.controls[field].errors) {
      return null;
    }

    const errors = this.formOntology.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'pattern':
          return 'Invalid pattern. The field must start with a capital letter';
        case 'minlength':
          return `The field must have at least ${ errors['minlength'].requiredLength } characters`;
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
