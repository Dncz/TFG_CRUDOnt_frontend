
// export interface DataProperties {
//   name: string;
//   restriction: [
//   ]
// }

export interface Restriction {
  restriction: string;
  restrictionType: string;
  restrictionValue: string;
  restrictionTypeName: string;
}

export interface DataProperty {
  name: string;
  IRI: string;
  restrictionTypeName: string;
  restrictionValue?: string;
}

export interface ObjectProperty {
  name: string;
  IRI: string;
  restrictionTypeName: string;
  restrictionValue: string;
}

export interface DataOntology {
  classIRI: string;
  className: string;
  comment: string;
  clasification: string;
  dataProperties: DataProperty[];
  objectPropertiesNames: ObjectProperty[];
}

export interface Predicate {
  objectPropertyURI: string,
  objectPropertyName: string,
  rangeURI: string,
  rangeName: string

}

export interface Intance {
  IRI: string,
  name: string,
  description: string
}
