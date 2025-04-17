// src/app/model/course.ts
export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    bio?: string;
  };
  image: string;
  rating: number;
  duration: string;
  price: number;
  createdAt: Date;
}