export interface Class {
  classURI: string;
  className: string;
  comment: string;
  clasification: string;
}

export interface Restriction {
  typeIRI: string;
  typeName: string;
  valueIRI: string;
}

export interface DataProperty {
  className: string;
  IRIs: string[];
  names: string[];
}

export interface RestrictionCardinality {
  dataPropertyName: string;
  restrictions : Restriction[];
}

export interface ObjectProperty {
  IRI: string;
  name: string;
  rangeIRI: string[];
  rangeName: string;
}

export interface Intance {
  IRI: string,
  name: string,
  description: string,
  label: string
}

export interface SelectedOption {
  objectPropertyName: string;
  instances: string[];
}

export interface DataPropertyForm {
  IRI: string,
  valueForm?: string,
  valuesFormArray?: string[],
}

export interface InformationForm {
  internName: string,
  label: string,
  dataProperties: DataPropertyForm[],
  objectProperties: SelectedOption[],
}
