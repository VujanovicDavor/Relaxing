import { Photo, PhotoService } from '../app/services/photo.service';

export class ExerciseCard{
    public title: string;
    public content: string;
    public img: string;
    public id: string;
    public type: string;
    public webViewPath: string;
    public minutes: number;
    public seconds: number;
    public photo: Photo;
    private primaryType: string;
    private secondaryType: string;
    public activityCounter: number;

    constructor(){
        this.content = '';
        this.img = '';
        this.title = '';
        this.type = '';
        this.webViewPath = '';
        this.minutes = 0;
        this.seconds = 0;
        this.activityCounter = 0;
    }

    public getPrimaryType(): string {
        return this.primaryType;
    }

    public setPrimaryType(type: string): void {
        if(type == ''){} // implement types (create different types)
    }

    public getSecondaryType(): string {
        return this.secondaryType;
    }

    public setSecondaryType(type: string){
        if(type == ''){} //implement types
    }
}