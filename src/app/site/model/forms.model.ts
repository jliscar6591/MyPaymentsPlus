export interface Form {
  formKey: string,
  formName: string,
  isMultipleSubmissionTrue: boolean,
  fields: Fields[]

}

export interface Fields {
  formFieldId: number,
  displayOrder: number,
  prompt: string,
  isRequired: boolean,
  toolTip: string,
  fieldTextArea: string,
  fieldType: number,
  choices: Choices[],
}

export interface Choices {
  display: string,
  value: string
}
