export class ExerciseCard{
    title: string;
    content: string;
    img: string;
    id: string;
    type: string;

    constructor(){
        this.content = '';
        this.img = '';
        this.title = '';
        this.type = '';
    }

    createCard(id: string ,title: string, content: string, img: string, type: string){
        this.content = content;
        this.img = img;
        this.title = title;
        this.id = id;
        this.type = type;
    }

    toCard(): HTMLElement{
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

    toListItem(): HTMLElement{
        //init
        const item: HTMLElement = document.createElement('ion-item');
        
        //declare
        item.textContent = this.title;
        return item;
    }
}