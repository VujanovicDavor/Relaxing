import { ExerciseCard } from "./exercise.card";

export class Playlist{
    cards: ExerciseCard[];

    constructor(){
        this.cards = new Array();
    }

    /**
     * Add an exercise at the end of the playlist
     * @param exercise 
     * @returns true if the element was added else false
     */
    addExercise(exercise: ExerciseCard): boolean{
        if(exercise == null){
            return false;
        }

        this.cards.push(exercise);
        return true;
    }

    /**
     * Add an exercise at an specific index
     * @param exercise 
     * @param index 
     * @returns true value if the card was successfully added
     */
    addExerciseAt(exercise: ExerciseCard, index: number): boolean{
        if(exercise == null || index >= this.cards.length || index < 0){
            return false;
        }
        this.cards.splice(index, 0, exercise);
        return true;
    }

    /**
     * Removes the last element of the array
     * @returns the removed exercise card
     */
    popExercise(): ExerciseCard{
        if(this.cards == null || this.cards.length == 0){
            return null;
        } else {
            return this.cards.pop();
        }
    }

    /**
     * Removes an element at the specific index
     * @param index 
     * @returns the removed exercise card
     */
    removeExerciseAt(index: number): ExerciseCard{
        if(index >= this.cards.length || index < 0){
            return null;
        } else{
            return this.cards.splice(index, 1)[0];
        }
    }

    /**
     * Returns the element at the specific index
     * @param index 
     * @returns 
     */
    get(index: number): ExerciseCard{
        if(index >= this.cards.length || index < 0){
            return this.cards[index];
        }
    }
}