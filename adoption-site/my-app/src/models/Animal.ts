export default class Animal {
  id: number;
  photo: string; // Main photo URL (kept for backward compatibility)
  name: string;
  age: number;
  description: string;
  location: string;
  isAdopted: boolean;
  mediaFiles: string[]; // Array of file names/references for additional media

  constructor(
    id: number,
    photo: string,
    name: string,
    age: number,
    description: string,
    location: string,
    isAdopted: boolean,
    mediaFiles?: string[], // Optional array of media files
  ) {
    this.id = id;
    this.photo = photo;
    this.name = name;
    this.age = age;
    this.description = description;
    this.location = location;
    this.isAdopted = isAdopted;
    this.mediaFiles = mediaFiles || [];
  }

  // // Helper method to get main photo URL
  // getMainPhoto(): string {
  //   return this.mediaFiles.length > 0 
  //     ? `/api/animalfiles/download/${this.mediaFiles[0]}`
  //     : this.photo;
  // }

  // // Helper method to add a new media file
  // addMediaFile(fileName: string): void {
  //   this.mediaFiles.push(fileName);
  // }

  // // Helper method to remove a media file
  // removeMediaFile(fileName: string): void {
  //   this.mediaFiles = this.mediaFiles.filter(file => file !== fileName);
  // }
}