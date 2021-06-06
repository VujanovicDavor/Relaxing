export class ExerciseCard{
    public title: string;
    public content: string;
    public img: string;
    public id: string;
    public type: string;
    public fileName: string;

    constructor(){
        this.content = '';
        this.img = '';
        this.title = '';
        this.type = '';
        this.fileName = '';
    }

    createCard(id: string ,title: string, content: string, img: string, type: string){
        this.content = content;
        this.img = img;
        this.title = title;
        this.id = id;
        this.type = type;
    }

    static toCard(card: ExerciseCard): HTMLElement{
        if(card == null){
            return null;
        }

        // init
        const ionCard: HTMLElement = document.createElement('ion-card');
        const ionHeader: HTMLElement = document.createElement('ion-card-header');
        const ionTitle: HTMLElement = document.createElement('ion-title');
        const ionContent: HTMLElement = document.createElement('ion-card-content');
        const img: HTMLImageElement = document.createElement('img');

        // declare
        ionTitle.textContent = card.title;
        ionContent.textContent = card.content;
        img.src = card.img;

        // append
        ionHeader.appendChild(ionTitle);
        ionCard.appendChild(ionHeader);
        ionCard.appendChild(img);
        ionCard.appendChild(ionContent);

        return ionCard;
    }

    static toListItem(card: ExerciseCard): HTMLIonItemElement{
        // init
        const item: HTMLIonItemElement = document.createElement('ion-item');
        
        // declare
        item.textContent = card.title;
        return item;
    }
}