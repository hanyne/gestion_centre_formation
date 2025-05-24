export interface User {
  _id: string;
  email: string;
  role: 'apprenant' | 'formateur' | 'admin';
  nom?: string;
  prenom?: string;
}