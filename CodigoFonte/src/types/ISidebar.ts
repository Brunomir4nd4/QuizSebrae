import { WPImage } from "./IWordpress";

export interface Sidebar {
  cycle_id: number;
  course_id: number;
  class_id: number;
  class_name: string;
  class_slug: string;
  cycle_name: string;
  cycle_slug: string;
  course_name: string;
  course_slug: string;
  logo: WPImage;
  logo_b: WPImage;
}