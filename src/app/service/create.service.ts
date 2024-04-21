import { Intance, DataProperty, Restriction, DataPropertyTest } from './../interface/data-ontology.interface';
import { Injectable } from '@angular/core';
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

  getclass(className: string): Observable<Class> {
    return this.http.get<Class>(`${environment.apiUrl}/classes/${className}`);
  }

  // Funcion para obtener los datos de la API
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${environment.apiUrl}/classes`).pipe(
      map(data => this.mapToClass(data))
    );
  }

  public getDataProperties(className: string): Observable<DataProperty[]> {
    return this.http.get<DataProperty[]>(`${environment.apiUrl}/dataProperties/${className}`).pipe(
      map(data => {
        return data.map(item => ({
          name: item.name,
          IRI: item.IRI
        }));
      })
    );
  }

  public mapDataPropertiesTest(data: any): DataPropertyTest {
    return {
      className: data.className,
      IRIs: data.IRIs.split(/,\s*/),
      names: data.names.split(/,\s*/)
    };
  }

  public getDataPropertiesTest(): Observable<DataPropertyTest[]> {
    const observables: Observable<DataPropertyTest>[] = [];
    this._classNames.forEach(className => {
      observables.push(this.http.get<DataPropertyTest>(`${environment.apiUrl}/dataProperties/${className}`).pipe(
        map(data => this.mapDataPropertiesTest(data))
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
          description: item.description,
          label: item.label
        }));
      })    );
  }

  public getRestrictions(className: string, dataPropertyName: string): Observable<Restriction[]> {
    return this.http.get<Restriction[]>(`${environment.apiUrl}/restrictionDataProperty/${className}/${dataPropertyName}`).pipe(
      map(data => {
        return data.map(item => ({
          typeIRI: item.typeIRI,
          typeName: item.typeName,
          valueIRI: item.valueIRI
        }));
      })
    );

  }
}
