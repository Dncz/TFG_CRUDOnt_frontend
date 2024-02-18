import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  public ClassForm: FormGroup = this.fb.group({
    nameClass: [''],
    propertiesArray: this.fb.array([
      ['property1'],
      ['property2'],
    ]),
  });

  public mockDataForm: FormGroup = this.fb.group({
    className: [''],
    dataTypeProperties: this.fb.array([]),
  });

  public mockData = [
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Population",
    //   "className": "Population",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasGeographicalContext, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasMaxAge, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasMinAge, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasSize, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasYear",
    //   "dataTypeProperties": "hasDescription, hasGeographicalContext, hasMaxAge, hasMinAge, hasSize, hasYear"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#NormalDistributionExpression",
    //   "className": "NormalDistributionExpression",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasAverageParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasOffsetParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasScaleParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasStandardDeviationParameter",
    //   "dataTypeProperties": "hasAverageParameter, hasOffsetParameter, hasScaleParameter, hasStandardDeviationParameter"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Utility",
    //   "className": "Utility",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasCalculationMethod, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasExpectedValue, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasGeographicalContext, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasSource, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasTemporalBehavior, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasYear",
    //   "dataTypeProperties": "hasCalculationMethod, hasDescription, hasExpectedValue, hasGeographicalContext, hasSource, hasTemporalBehavior, hasYear"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#DiseasePathway",
    //   "className": "DiseasePathway",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasCondition",
    //   "dataTypeProperties": "hasCondition"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#AdHocExpression",
    //   "className": "AdHocExpression",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasExpressionValue",
    //   "dataTypeProperties": "hasExpressionValue"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#ProbabilityDistributionExpression",
    //   "className": "ProbabilityDistributionExpression",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasAverageParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasOffsetParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasScaleParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasStandardDeviationParameter",
    //   "dataTypeProperties": "hasAverageParameter, hasOffsetParameter, hasScaleParameter, hasStandardDeviationParameter"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Strategy",
    //   "className": "Strategy",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasCondition, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription",
    //   "dataTypeProperties": "hasCondition, hasDescription"
    // },
    // {
    //   "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#ManifestationPathway",
    //   "className": "ManifestationPathway",
    //   "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasCondition",
    //   "dataTypeProperties": "hasCondition"
    // }
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#RareDisease",
      "className": "RareDisease",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToDO, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToGARD, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToICD, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToOMIM, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToORDO, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToSNOMED",
      "dataTypeProperties": "hasDescription, hasRefToDO, hasRefToGARD, hasRefToICD, hasRefToOMIM, hasRefToORDO, hasRefToSNOMED",
      "comentario": "A Disease with very low  prevalence"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#HealthTechnology",
      "className": "HealthTechnology",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription",
      "dataTypeProperties": "hasDescription",
      "comentario": "Any treatment, drug, test... that may be applied to a patient"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#DiagnosisIntervention",
      "className": "DiagnosisIntervention",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription",
      "dataTypeProperties": "hasDescription",
      "comentario": "An intervention intended to establish the presence/absence of certain disease or condition"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Stage",
      "className": "Stage",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRefToICD",
      "dataTypeProperties": "hasDescription, hasRefToICD",
      "comentario": "A phase or step in the progression of a disease"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Cost",
      "className": "Cost",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasExpectedValue, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasGeographicalContext, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasSource, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasTemporalBehavior, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasYear",
      "dataTypeProperties": "hasDescription, hasExpectedValue, hasGeographicalContext, hasSource, hasTemporalBehavior, hasYear",
      "comentario": "Cost related to any class"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Drug",
      "className": "Drug",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription",
      "dataTypeProperties": "hasDescription",
      "comentario": "A natural or synthetic remedy for a disease or manifestation"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#ScreeningIntervention",
      "className": "ScreeningIntervention",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription",
      "dataTypeProperties": "hasDescription",
      "comentario": "An intervention to identifiy the subset of population who may have certain disease or condition and require further testing to obtain a final diagnosis"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Guideline",
      "className": "Guideline",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasCondition, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDose, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasFrequency, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasHoursInterval, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasRange",
      "dataTypeProperties": "hasCondition, hasDescription, hasDose, hasFrequency, hasHoursInterval, hasRange",
      "comentario": "The way a treatment, drug, test... is applied. It defines a period of time (range), dose, frequency, etc."
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Development",
      "className": "Development",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasCondition, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription",
      "dataTypeProperties": "hasCondition, hasDescription",
      "comentario": "Certain progression of a Disease that comprises a specific set of manifestations or a set of pathways to such manifestations"
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Parameter",
      "className": "Parameter",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasExpectedValue, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasGeographicalContext, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasSource, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasYear",
      "dataTypeProperties": "hasDescription, hasExpectedValue, hasGeographicalContext, hasSource, hasYear",
      "comentario": "Parameters used for computing outcomes or characterize certain class. They have a source, a geographical context, year, description and value."
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#Population",
      "className": "Population",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasDescription, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasGeographicalContext, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasMaxAge, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasMinAge, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasSize, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasYear",
      "dataTypeProperties": "hasDescription, hasGeographicalContext, hasMaxAge, hasMinAge, hasSize, hasYear",
      "comentario": ""
    },
    {
      "class": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#NormalDistributionExpression",
      "className": "NormalDistributionExpression",
      "dataTypePropertiesIRIs": "http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasAverageParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasOffsetParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasScaleParameter, http://www.ull.es/iis/simulation/ontologies/disease-simulation#hasStandardDeviationParameter",
      "dataTypeProperties": "hasAverageParameter, hasOffsetParameter, hasScaleParameter, hasStandardDeviationParameter",
      "comentario": ""
    }
  ];

  // currentPage = 1;
  // pageSize = 5;

  // onPageChange(page: number): void {
  //   this.currentPage = page;
  // }

  // getFormsForCurrentPage() {
  //   const start = (this.currentPage - 1) * this.pageSize;
  //   const end = start + this.pageSize;
  //   this.mockDataForm = new FormGroup({}); // Create a new instance of FormGroup
  //   return this.mockData.slice(start, end);
  // }

  constructor(private fb: FormBuilder) { }

  onSubmit(): void {
    console.log(this.ClassForm.value);
    this.ClassForm.reset();
  }

  get_properties(): FormArray{
    return this.ClassForm.get('propertiesArray') as FormArray;
  }

  getFormGroup(className: string): FormGroup {
    const classData = this.mockData.find(data => data.className === className);
    const propertiesArray = classData ? classData.dataTypeProperties.split(', ') : [];
    const formControls = propertiesArray.map(property => this.fb.control(''));
    return this.fb.group({
      className: [className],
      dataTypeProperties: this.fb.array(formControls)
    });
  }

  get_dataTypeProperties(className: string): string[]{
    const classData = this.mockData.find(data => data.className === className);
    if (classData) {
      // return classData.dataTypeProperties.split(', ');
      return classData.dataTypeProperties.split(', ').map(property => property.replace('has', '')); // remove 'has' from the property name
    }
    return [];
  }

  get_comment(className: string): string{
    const classData = this.mockData.find(data => data.className === className);
    return classData ? classData.comentario : '';
  }

  get_classNameArray(): string[] {
    // get de los nombres de las clases del mockData
    return this.mockData.map((data) => data.className);
  }
}
