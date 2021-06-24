import { Photo, PhotoService } from '../app/services/photo.service';

export class ExerciseCard{
    public title: string;
    public content: string;
    public img: string;
    public id: string;
    public type: string;
    public minutes: number;
    public seconds: number;
    public minMoodScore: number;
    public maxMoodScore: number;
    public photo: Photo;
    public activityCounter: number;
    public lowerScore: number;
    public upperScore: number;

    constructor(){
        this.content = '';
        this.img = '';
        this.title = '';
        this.type = '';
        this.minutes = 0;
        this.seconds = 0;
        this.activityCounter = 0;
        this.lowerScore = 0;
        this.upperScore = 0;
    }
}