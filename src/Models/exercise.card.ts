import { Photo, PhotoService } from '../app/services/photo.service';

export class ExerciseCard{
    public title: string;
    public content: string;
    public img: string;
    public id: string;
    public type: string;
    public fileName: string;
    public minutes: number;
    public seconds: number;
    private primaryType: string;
    private secondaryType: string;

    constructor(){
        this.content = '';
        this.img = '';
        this.title = '';
        this.type = '';
        this.fileName = '';
        this.minutes = 0;
        this.seconds = 0;
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