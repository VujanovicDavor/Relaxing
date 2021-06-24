import { ExerciseCard } from "./exercise.card";

export class Playlist{
    public cards: ExerciseCard[];
    id: string;
    public name: string;
    public description: string;
    public activityCounter: number;

    constructor(){
        this.cards = new Array();
        this.id = '';
        this.name = '';
        this.description = '';
        this.activityCounter = 0;
    }

    createNewPlaylist(id: string, name:string, description: string, exercises: ExerciseCard[]){
        if(id == null || id.length == 0){
            return false;
        }
        
        if(name == null || name.length == 0){
            return false;
        }

        if(exercises == null || exercises.length == 0){
            return false;
        }

        this.cards = exercises;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}