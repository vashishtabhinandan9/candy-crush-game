document.addEventListener('DOMContentLoaded',()=>{
    const grid =document.querySelector(".grid");
    const width = 8;


    const candies=[];

    const candyColors=[
        "url(assets/blue-candy.png)",
        "url(assets/green-candy.png)",
        "url(assets/orange-candy.png)",
        "url(assets/purple-candy.png)",
        "url(assets/red-candy.png)",
        "url(assets/yellow-candy.png)"
        
    ]

    function createBoard(){
        for( let i=0;i< width*width;i++)
        {
            let candy = document.createElement('div');// it create a elemnet div and store itein square

            candy.setAttribute("draggable",true);
            candy.setAttribute("id",i);

            let randomColorIndex =Math.floor(Math.random() * candyColors.length);
           candy.style.backgroundImage=candyColors[randomColorIndex];
           grid.appendChild(candy); //this adds our div containing candy to teh inside of grid element
// in dom tree every parent has a child so here we are making changes to the child of grid
           

            candies.push(candy);

}
    }

    createBoard();

    let colorBeingDragged;
    let candyBeingDragged;
    let colorBeingReplaced;
    let candyBeingReplaced;
      


    candies.forEach(candy => { candy.addEventListener("dragstart",dragStart)});//these all are the difrent drap and drop events
    candies.forEach(candy => { candy.addEventListener("dragend",dragEnd)});
    candies.forEach(candy => { candy.addEventListener("dragover",(e)=>{e.preventDefault();})});
    candies.forEach(candy => { candy.addEventListener("dragleave",dragLeave)});
    candies.forEach(candy => { candy.addEventListener("dragenter",dragEnter)});
    candies.forEach(candy => { candy.addEventListener("drop",dragDrop)});
//start(id of the picked elemnt)=>leave(when you leave that id)=>drop(id of element where you drop the picked element)=>end(id of the picked element)
//above action are main ection we need , anything in between we dont need so we do prevent defau;lt on those, but having them is important 
    function dragStart(){
        colorBeingDragged=this.style.backgroundImage;
        candyBeingDragged=parseInt(this.id);
        
        //console.log(this.id,"dragstart");
    }

    function dragEnd(){
        /**
         * we need to check valid moves 
         * valid moves are we can move it to adjacent bloacks only
         */

        let validmoves=[
            candyBeingDragged+1 ,
            candyBeingDragged-1,
            candyBeingDragged+width,
            candyBeingDragged-width
            
        ]

        const isValid = validmoves.includes(candyBeingReplaced);
        if(candyBeingReplaced&& isValid){//tis valid checks for the adjacent and canybeigreplaed shceks when the replaced id is 0,null or undefined 
            candyBeingReplaced=null;
            candyBeingDragged=null;
            colorBeingDragged=null;
            colorBeingReplaced=null;
        }
        else if ( candyBeingReplaced && ! isValid){
            
        candies[candyBeingDragged].style.backgroundImage=colorBeingDragged;
        candies[candyBeingReplaced].style.backgroundImage=colorBeingReplaced;
    
        }

        else{
            candies[candyBeingDragged].style.backgroundImage=colorBeingDragged;
        }


        //console.log(this.id,"end");
    }
    
    function dragEnter(e){//e is the event here which is passed
        e.preventDefault();//prevent deafault will  prevent teh default action associated to that evetn and skio to the next line 

    }


    function dragLeave(){
        //console.log(this.id,"leave");
    }

    function dragDrop(){
        colorBeingReplaced=this.style.backgroundImage;
        candyBeingReplaced=parseInt(this.id);
        //console.log(this.id,"dragdrop");

        this.style.backgroundImage=colorBeingDragged;
        candies[candyBeingDragged].style.backgroundImage=colorBeingReplaced;
    }

    function generateRandomCandies() {
        let len = width * (width - 1); // 55
        for (let i = 0; i < len; i++) {
            if (candies[i + width].style.backgroundImage === '') //this checks if below thereis no candy then new candy need to be generated adn pushed down 
            
            {
                candies[i + width].style.backgroundImage = candies[i].style.backgroundImage
                candies[i].style.backgroundImage = ''
            }
            // Candy in first row has no backgroud
            if (i < width && candies[i].style.backgroundImage == '') {
                candies[i].style.backgroundImage = candyImages[
                    Math.floor(Math.random() * candyImages.length)
                ];
            }
        }
    }

    function checkRow(no_of_candies) {
        let invalidIndex = [];
        let len = width * width - no_of_candies
        for (let i = width - no_of_candies + 1; i <= len; i += width) {
            ///pushing elements in invalidIndex
            invalidIndex.push(i, i + 1);
            if (no_of_candies >= 4) invalidIndex.push(i + 2);
            if (no_of_candies == 5) invalidIndex.push(i + 3);
        }
        // console.log(no_of_candies, invalidIndex)
        for (let i = 0; i <= len; i++) {
            let candiesList = []
            //populate candiesList
            candiesList.push(i, i + 1, i + 2);
            if (no_of_candies >= 4) candiesList.push(i + 3);
            if (no_of_candies == 5) candiesList.push(i + 4);

            let desiredImage = candies[i].style.backgroundImage;

            /**
             * If i present in the  invalidIndex Array forget it;
             */
            if (invalidIndex.includes(i)) continue;
            /***
             * 
             * If Every Element satisfies the condition after arrow 
             * Or for every element the fuction returns true.
             * 
             * then the final result is true 
             */
            let match = candiesList.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += no_of_candies;
                // console.log(score)
                candiesList.forEach(index => candies[index].style.backgroundImage = "")
            }


        }

    }
});