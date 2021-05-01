export class Mood{
    relaxLevel: number = 0;
    productivityLevel: number = 0;
    satisfactionLevel: number = 0;
    dateTime: Date = null;
    minRange: number = 1;
    maxRange: number = 5;

    constructor(){}

    updateRange(minRange: number, maxRange: number): boolean{
        if(minRange >= 1 && minRange < maxRange && maxRange - minRange >= 5){
            this.minRange = minRange;
            this.maxRange = maxRange;
            return true;
        } else{
            return false;
        }
    }

    /**
     * 
     * @returns score
     * @returns -1 if error in calculation occures or default values are not overwritten
     */
    getMoodScore(): number{
        if(!this.checkDefaultValue()){
            return this.relaxLevel + this.productivityLevel + this.satisfactionLevel;
        } else {
            return -1;
        }
    }

    private checkDefaultValue(): boolean{
        if(this.relaxLevel == 0 || this.productivityLevel == 0 || this.satisfactionLevel == 0 || this.dateTime == null){
            return true;
        } else{
            return false;
        }
    }
}