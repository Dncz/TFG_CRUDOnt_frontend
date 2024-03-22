import { CreateService } from './../../service/create.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Class } from '../../interface/classes.interface';
import { DataPropertiesClass } from '../../interface/data-properties.interface';
import { ObjectProperty } from '../../interface/object-properties.interface';
import { DataOntology, Intance } from '../../interface/data-ontology.interface';


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
  }

  public dataOntology: DataOntology[] = [];
  private loadDataOntology(): void {
    this.loadClasses();
  }

  private loadClasses(): void {
    this.createService.getClasses().subscribe(classes => {
      this.classes = classes;
      this.loadDataProperties()
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

  // TODO: mejorar las dataProperties
  public dataProperties: DataPropertiesClass[] = [];
  private loadDataProperties(): void {
    this.createService.getDataPropertiesClass().subscribe(properties => {
      this.dataProperties = properties;
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

  public track(index: number, instance: Intance): string {
    return instance ? instance.name : " "; // Ajusta esto según la estructura de tus instancias
  }

  public getDataProperties(className: string): string[] {
    const cls = this.dataProperties.find(item => item.className === className);
    return cls ? cls.dataTypeProperties : [];
  }


  public objectProperies: ObjectProperty[] = [];
  private loadObjectPropertiesByClassName(className: string): void {
    this.createService.getObjectProperties(className).subscribe(properties => {
      this.objectProperies = properties;
    });
  }

  public getObjectProperties(className: string): ObjectProperty[] {
    return this.objectProperies;
  }

  public mockDataForm: FormGroup = this.fb.group({
    className: [''],
    dataTypeProperties: this.fb.array([]),
  });

  // Funcionalidades para mostrar u ocultar el formulario
  public activeForm: string | null = null;
  public toggleForm(className: string): void {
    // Mostrar u ocultar el formulario según el botón presionado
    this.activeForm = (this.activeForm === className) ? null : className;
    if (this.activeForm === className) {
      // Si el formulario está activo, obtener los predicados
      // this.getPredicates(className);
      this.loadObjectPropertiesByClassName(className);
      this.intances = []; // Limpiar las instancias // TODO: no se si esto es necesario
    }
    this.objectProperies = []; // Limpiar las propiedades de objetos
    this.showObjectProperties = false; // Ocultar la lista de propiedades de datos
    this.selectedChipIndex = null; // Deseleccionar el chip seleccionado
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
    className: ['', [Validators.required, Validators.minLength(10)]],
  });

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  // TODO: crear el formulario por el nombre, sus dataPropiedades
  // de las ObjectPropiedades no hace falta poner campos porque serán botones
  public createForm() {

  }

  // onSubmit(): void {
  //   console.log(this.ClassForm.value);
  //   this.ClassForm.reset();
  // }

}
