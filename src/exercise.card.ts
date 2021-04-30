export class ExerciseCard{
    title: string;
    content: string;
    img: string;
    scoreUpperBorder: number;
    scoreLowerBorder: number;

    constructor(){
        this.scoreUpperBorder = 0;
        this.scoreUpperBorder = 0;
        this.content = '';
        this.img = '';
        this.title = '';
    }

    createCard(title: string, content: string, img: string, scoreLowerBorder: number, scoreUpperBorder){
        this.scoreUpperBorder = scoreUpperBorder;
        this.scoreLowerBorder = scoreLowerBorder;
        this.content = content;
        this.img = img;
        this.title = title;
    }

    getCard(): HTMLElement{
        // init
        const ionCard: HTMLElement = document.createElement('ion-card');
        const ionHeader: HTMLElement = document.createElement('ion-card-header');
        const ionTitle: HTMLElement = document.createElement('ion-title');
        const ionContent: HTMLElement = document.createElement('ion-card-content');
        const img: HTMLImageElement = document.createElement('img');

        // declare
        ionTitle.textContent = this.title;
        ionContent.textContent = this.content;
        img.src = this.img;

        // append
        ionHeader.appendChild(ionTitle);
        ionCard.appendChild(ionHeader);
        ionCard.appendChild(img);
        ionCard.appendChild(ionContent);

        return ionCard;
    }

    getLowerBorder(): number{
        return this.scoreLowerBorder;
    }

    getUpperBorder(): number{
        return this.scoreUpperBorder;
    }
}