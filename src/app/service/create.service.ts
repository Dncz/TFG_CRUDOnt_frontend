import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { ObjectProperty, Class, Intance, Restriction, DataProperty, InformationForm } from './../interface/data-ontology.interface';
import { ResponseError } from './../interface/errors-interface';
import { ResponsePost } from './../interface/response-interface';


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

  getClasses(): Observable<Class[] | ResponseError> {
    return this.http.get<Class[] | ResponseError>(`/api/classes`).pipe(
      map(
        (data: Class[] | ResponseError) => {
          if ('status' in data) {
            return {
              error: data.error,
              status: data.status
            };
          }
          return this.mapToClass(data);
        }
      )
    );
  }

  public mapDataProperties(data: any): DataProperty {
    return {
      className: data.className,
      IRIs: data.IRIs.split(/,\s*/),
      names: data.names.split(/,\s*/)
    };
  }

  public getDataProperties(): Observable<DataProperty[]> {
    const observables: Observable<DataProperty>[] = [];
    this._classNames.forEach(className => {
      observables.push(this.http.get<DataProperty>(`/api/dataProperties/${className}`).pipe(
        map(data => this.mapDataProperties(data))
      ));
    });
    return forkJoin(observables);
  }

  public getObjectProperties(className: string): Observable<ObjectProperty[] | ResponseError> {
    return this.http.get<ObjectProperty[] | ResponseError>(`/api/objectProperties/${className}`).pipe(
      map((data: ObjectProperty[] | ResponseError) => {
        if ('status' in data) {
          return {
            error: data.error,
            status: data.status
          };
        }
        return data.map(item => ({
          IRI : item.IRI,
          name: item.name,
          rangeIRI: item.rangeIRI,
          rangeName: item.rangeName
        }));
      })
    );
  }

  public getIntances(rangeName: string): Observable<Intance[] | ResponseError> {
    return this.http.get<Intance[] | ResponseError>(`/api/getIntances/${rangeName}`).pipe(
      map(data => {
        if ('status' in data) {
          return {
            error: data.error,
            status: data.status
          };
        }
        return data.map(item => ({
          IRI: item.IRI,
          name: item.name,
          description: item.description,
          label: item.label
        }));
      })    );
  }

  public getRestrictions(className: string, dataPropertyName: string): Observable<Restriction[] | ResponseError> {
    return this.http.get<Restriction[] | ResponseError>(`/api/restrictionDataProperty/${className}/${dataPropertyName}`).pipe(
      map(data => {
        if ('status' in data) {
          return {
            error: data.error,
            status: data.status
          };
        }
        return data.map(item => ({
          typeIRI: item.typeIRI,
          typeName: item.typeName,
          valueIRI: item.valueIRI
        }));
      })
    );
  }

  public createInstance(InformationForm: InformationForm, className: string): Observable<ResponsePost> {
    return this.http.post<ResponsePost>(`/api/createInstance/${className}`, InformationForm, {observe: 'response'}).pipe(
      map((response: HttpResponse<ResponsePost>) => {
        return {
          message: response.body!.message,
          status: response['status']
        };
      })
    );
  }
}
