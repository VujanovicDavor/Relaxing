import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Dir } from 'node:fs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public async addNewPhotoToGallery(){

    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      }).catch(() => {
        console.log('closed camera');
      });
  
      const savedImageFile = await this.savePicture(capturedPhoto);
      this.photos.unshift(savedImageFile);
  
      Storage.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      });
    } catch (error) {
      console.log('DINGS');
    }
  }

  private async savePicture(cameraPhoto) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    }
  }

  public async loadSaved() {
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    for(let photo of this.photos){
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });

      photo.webviewPath = 'data:image/jpeg;base64,${readFile.data}';
    }
  }

  private async readAsBase64(cameraPhoto){
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob()

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  }).catch(() => {
    console.log('no photo');
  });

  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";

  constructor() { }
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
