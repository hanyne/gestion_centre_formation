// model/course.ts
export class Course {
  _id?: string;
  title: string = '';
  description: string = '';
  instructor: string = '';
  image?: string; // This will store the path to the image (e.g., "uploads/image.jpg")
  rating?: number;
  duration?: string;
  price?: number;
  createdAt?: Date;
}