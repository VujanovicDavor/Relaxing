import { Injectable, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Dir, readFile } from 'node:fs';
import * as jsonData from '../default_data/data.json';

@Injectable({
  providedIn: 'root'
})
export class PhotoService implements OnInit{

  public async getPhoto(): Promise<string>{
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
      console.log(this.photos);
      return Promise.resolve(savedImageFile.webviewPath);
    } catch (error) {
      return Promise.reject();
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

  async ngOnInit(){
    
  }

  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";

  constructor() { }
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
