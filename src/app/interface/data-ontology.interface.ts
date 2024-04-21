import { DataPropertiesClass } from "./data-properties.interface";
import { ObjectProperty } from "./object-properties.interface";

export interface Restriction {
  typeIRI: string;
  typeName: string;
  valueIRI: string;
}

export interface CreateInstance {
  name: string;
  description?: string;
  objectProperties: ObjectProperty[];
  dataProperties: DataPropertiesClass[];
}

export interface DataProperty {
  name: string;
  IRI: string;
}

export interface DataPropertyTest {
  className: string;
  IRIs: string[];
  names: string[];
}

export interface RestrictionCardinality {
  dataPropertyName: string;
  restrictions : Restriction[];
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
