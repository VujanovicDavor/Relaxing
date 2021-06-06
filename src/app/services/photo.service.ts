import { Injectable, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Dir } from 'node:fs';
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
      return Promise.resolve(savedImageFile.filepath);
    } catch (error) {
      return Promise.reject();
    }
  }

  private async getPhotosFromStorage(){
    this.photos = await JSON.parse((await Storage.get({ key: this.PHOTO_STORAGE })).value);
  }

  public async storePhoto(){
    Storage.set({key: this.PHOTO_STORAGE, value: JSON.stringify(this.photos) })
  }

  public async clearStorage(){
    await Storage.clear();
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

  async getPhotoByFileNameFromStorage(imgFileName: string){
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    for(let photo of this.photos){
      if(imgFileName == photo.filepath){ // Load img
        return photo;
      }
    }
  }

  async getPhotoByFileName(imgFileName: string){
    
  }

  async getWebViewPath(photo: Photo){
    Filesystem.readFile({
      path: photo.filepath,
      directory: Directory.Data
    });
    return photo.webviewPath = 'data:image/jpeg;base64,${readFile.data}';
  }

  async deletePhotoByFileName(imgFileName: string){
    Filesystem
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
    this.getPhotosFromStorage();
  }

  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";

  constructor() { }
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
