export class Mood{
    public relaxLevel: number = 0;
    public productivityLevel: number = 0;
    public satisfactionLevel: number = 0;
    public dateTime: Date = null;
   

    constructor(){
        this.relaxLevel = 0;
        this.productivityLevel = 0;
        this.satisfactionLevel = 0;
    }
}