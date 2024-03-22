import { Intance } from './../interface/data-ontology.interface';
import { DataPropertiesClass } from './../interface/data-properties.interface';
import { Injectable } from '@angular/core';
// import { v4 as uuid } from 'uuid';  // esto es para generar un id unico
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Class } from '../interface/classes.interface';
import { Observable, forkJoin, map } from 'rxjs';
import { ObjectProperty } from '../interface/object-properties.interface';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  private _classNames: string[] = [];

  constructor(private http: HttpClient) {
  }

  private mapToClass(data: any[]): Class[] {
    this._classNames = data.map(item => item.className);
    return data.map(item => ({
      classURI: item.classURI,
      className: item.className,
      comment: item.comentario,
      clasification: item.clasification
    }));
  }

  private mapDataPropertiesClass(data: any): DataPropertiesClass {
    return {
      classIRI: data.classIRI,
      className: data.className,
      dataTypePropertiesIRI: data.dataTypePropertiesIRI,
      dataTypeProperties: data.dataTypeProperties.split(/,\s*/).map((property: string) => property.replace('has', '')),
      comment: data.comment,
      clasification: data.clasification
    };
  }

  getclass(className: string): Observable<Class> {
    return this.http.get<Class>(`${environment.apiUrl}/classes/${className}`);
  }

  // Funcion para obtener los datos de la API
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${environment.apiUrl}/classes`).pipe(
      map(data => this.mapToClass(data))
    );
  }

  public getDataPropertiesClass(): Observable<DataPropertiesClass[]> {
    const observables: Observable<DataPropertiesClass>[] = [];
    this._classNames.forEach(className => {
      observables.push(this.http.get<DataPropertiesClass>(`${environment.apiUrl}/dataProperties/${className}`).pipe(
        map(data => this.mapDataPropertiesClass(data))
      ));
    });
    return forkJoin(observables);
  }

  public getObjectProperties(className: string): Observable<ObjectProperty[]> {
    return this.http.get<ObjectProperty[]>(`${environment.apiUrl}/objectProperties/${className}`).pipe(
      map(data => {
        return data.map(item => ({
          IRI : item.IRI,
          name: item.name.replace('has', ''),
          rangeIRI: item.rangeIRI,
          rangeName: item.rangeName
        }));
      })
    );
  }

  public getIntances(rangeName: string): Observable<Intance[]> {
    return this.http.get<Intance[]>(`${environment.apiUrl}/getIntances/${rangeName}`).pipe(
      map(data => {
        return data.map(item => ({
          IRI: item.IRI,
          name: item.name,
          description: item.description
        }));
      })    );
  }
}
