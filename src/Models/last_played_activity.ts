import { ExerciseCard } from "./exercise.card";
import { Playlist } from "./playlist";


export class LastPlayedActivity{
    public _exercise: ExerciseCard;
    public _playlist: Playlist;

    constructor() {
        this._exercise = null;
        this._playlist = null;
    }
}