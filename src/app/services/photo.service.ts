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
      return Promise.resolve(savedImageFile.filepath);
    } catch (error) {
      return Promise.reject();
    }
  }

  public async getPhotosFromStorage(){
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
  }

  public async storePhotos(){
    console.log(this.photos);
    Storage.set( {key: this.PHOTO_STORAGE, value: JSON.stringify(this.photos) });
    console.log('NO Errror');
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

  getPhotoByFileName(imgFileName: string): Photo{
    for(let i = 0; i < this.photos.length; i++){
      if(this.photos[i].filepath == imgFileName){
        return this.photos[i];
      }
    }

    return null;
  }

  public async getWebViewPath(){
    for(let photo of this.photos){
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  deletePhotoByFileName(imgFileName: string){
    for(let i = 0; i < this.photos.length; i++){
      if(imgFileName == this.photos[i].filepath){
        this.photos.splice(i, 1);
        return true;
      }
    }

    return false;
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
