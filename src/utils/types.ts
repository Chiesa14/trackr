export type MultiStepFormComponents = {
  headerTitle: string;
  headerDescription: string | undefined;
  component: React.ReactNode;
};

export interface SignUpFormData {
  name: string | undefined;
  surname: string | undefined;
  password: string | undefined;
  email: string | undefined;
  role: string | undefined;
  cellNumber: string | undefined;
  idOrPassoport: string | undefined;
}
