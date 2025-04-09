// src/app/model/enrollment.ts
export class Enrollment {
    _id?: string;
    user?: string;
    course?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    enrollmentDate?: Date;
    status?: 'pending' | 'confirmed' | 'completed';
  }