
// export interface ObjectPropertiesClass {
//   classIRI: string;
//   className: string;
//   objectProperties: string[];
//   clasification: string;
// }

export interface ObjectProperty {
  IRI: string;
  name: string;
  rangeIRI: string[];
  rangeName: string;
}
