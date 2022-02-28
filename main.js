document.addEventListener('DOMContentLoaded',()=>{
    const grid =document.querySelector(".grid");
    const width = 8;
    let score=0;


    const candies=[];

    const candyColors=[
        "url(assets/blue-candy.png)",
        "url(assets/green-candy.png)",
        "url(assets/orange-candy.png)",
        "url(assets/purple-candy.png)",
        "url(assets/red-candy.png)",
        "url(assets/yellow-candy.png)"
        
    ]
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            let candy = document.createElement('div');
            let randomImageIndex = Math.floor(Math.random() * candyColors.length);

            candy.setAttribute("draggable", true);
            candy.setAttribute("id", i);
            candy.style.backgroundImage = candyColors[randomImageIndex];//this adds our div containing candy to teh inside of grid element
            // in dom tree every parent has a child so here we are making changes to the child of grid
                       

            grid.appendChild(candy);
            
            candies.push(candy)
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

// function flow when you pick a candy 
//start(id of the picked elemnt)=>leave(when you leave that id)=>drop(id of element where you drop the picked element)=>end(id of the picked element)
//above action are main ection we need , anything in between we dont need so we do prevent defau;lt on those, but having them is important 
    function dragStart(){
        colorBeingDragged=this.style.backgroundImage;
        candyBeingDragged=parseInt(this.id);
        
        //console.log(this.id,"dragstart");
    }

    function dragLeave(){
        //console.log(this.id,"leave");
    }

    

    function dragDrop(){ //swap the color of two candy being swithced
        colorBeingReplaced=this.style.backgroundImage; //stores the image where you are willing to go (target candy )
        candyBeingReplaced=parseInt(this.id);//(target candy id )
        //console.log(this.id,"dragdrop");

        this.style.backgroundImage=colorBeingDragged;//color of picked element is put in the target  candy 
        candies[candyBeingDragged].style.backgroundImage=colorBeingReplaced;//color of target candy is put in picked candy  
    }

   function dragEnd(){
        /**
         * we need to check valid moves 
         * valid moves are we can move it to adjacent bloacks only
         */

        let validMoves=[
            candyBeingDragged+1 ,
            candyBeingDragged-1,
            candyBeingDragged+width,
            candyBeingDragged-width
            
        ]

        console.log(candyBeingReplaced, "In drag End", candyBeingDragged)

const inValidMove = (candyBeingDragged + candyBeingReplaced) % width == width - 1 &&(candyBeingDragged % width == 0 || candyBeingReplaced % width == 0);
//this condition is for suppose for width 8 row end is 7. now we swap 7 & 8 then it would be a alid move as 7 and 8 are 
//ajacent mathematicalybut on grid 7 is row end and 8 is first elemnt in next row.so to avoid this we dothis above condition
/**
 * above condtion explanation
 *  (candyBeingDragged + candyBeingReplaced) % width == width - 1  this cheks that the in swap wheather therw is row cahnge or not .it  means 
 * swapping is is like between (7,15),(7,8). also this iperation is true for the last column only itmeans swapping shoudlinclude 
 * lastcloumnelements(7,15,23,31,39,47,55,63)
 *  so now both these operationa are valid but only(7,15) should happen for the we have 2nd condition
 * 
 * above condtion has cheked operation will include one of the last row elemnt (say 7) and is  switched by 15 or by 8
 * 
 * (candyBeingDragged % width == 0 || candyBeingReplaced % width == 0) thsi cheks that one of the swap element would be is the firat row 
 * for say(7,8)swap 8 is in first columns . thes 1st columns elements are divisble by 8 so thsi logic is used to know that one of the elemtn 
 * is first column and swap between the first column elemtn adn last column elemnt is invalid so stop it  
 */
        const isValidMove = validMoves.includes(candyBeingReplaced) && !inValidMove;
        
        let onboard =true;
        if(candyBeingReplaced == null || candyBeingReplaced==undefined){
            onboard=false;//wehavve to make this conditon because earlier when the candy was placed on 0 it was 
//getting subsituted for all this shouldn't happen so we only want when candy is outside of board only then
//below could should execute but earlier for candybeigreplaced = 0 was also treated like case candybeigreplaced= null or undefined 
        }

        if (onboard && isValidMove) {  
        //this isvalidmove  checks for the candybeingraplaced in the valid move array
        // and onboard checks when the replacedcandy  id is 0,null or undefined 
       // (it means you have put candy outside the grid or someunvalid postion)

       /**
        * here case with 0 is it gives false so this coditon is not satisfied 
        * hence it is getting replaced by all
        */
    
            init();//soo if move maked lies inside the box and is also a valid move then go to init function and
            //set all things null again 
            candyBeingReplaced=null;
            candyBeingDragged=null;
            colorBeingDragged=null;
            colorBeingReplaced=null;
            
        }
        else if ( onboard && !isValidMove){//maked move lies inside the box but is invalid move
            //so revert the changes made 
// what we have done is we ae swapping every candy when it is dropped  . no matter valid move or not 
//so candy is already been swapped but here we are reverting those changes 
        candies[candyBeingDragged].style.backgroundImage=colorBeingDragged;
        candies[candyBeingReplaced].style.backgroundImage=colorBeingReplaced;
        }

        
         
       

        //console.log(this.id,"end");
    }
    
    
    
    function dragEnter(e){//e is the event here which is passed
        e.preventDefault();//prevent deafault will  prevent teh default action associated to that evetn and skio to the next line 

    }


    

   
    function generateRandomCandies() {
        let len = width * (width - 1); // 55
        for (let i = 0; i < len; i++) {
            if (candies[i + width].style.backgroundImage === '') 
            //this checks if below thereis no candy then new candy need to be generated adn pushed down 

            {
                candies[i + width].style.backgroundImage = candies[i].style.backgroundImage//this shifts the candy one step down 

                candies[i].style.backgroundImage = ''//sets the candy  you are on = to no candy
            }
            
            // Candy in first row has no backgroud
            if (i < width && candies[i].style.backgroundImage == '') {
                //makes the new candy which are not in the frame rain from top 
                candies[i].style.backgroundImage = candyColors[Math.floor(Math.random() * candyColors.length)];
            }
        }
    }

    function checkRow(no_of_candies) { // cheks the matching candies in a row and deletes them if exist  
        
        let invalidIndex = [];//this array stores the invaleid index for example row end at 7 . and candy at i = 6 , then
  // per our logic it cheks 3 next candies so 6,7,8. but 8th candy starts from the next row it should'nt be included.because 
  //we need 3 candies which are together . jence we need an array where we push invalid indexes 

        let len = width * width - no_of_candies ; // this is the maximim value that varaible i can take when iterating
 // the board so if no_of_candies =3 then maximim candy no we need to reach is 61 beacuse after that  62,62
 // will be automaticaly included as we need to check for next 3 candies      

        for (let i = width - no_of_candies + 1; i <= len; i += width) {
            ///pushing elements in invalidIndex
            invalidIndex.push(i, i + 1);// for 3,4,5 . //invalid index are 6 and 7 because as suppose 3 elemenys needto be picked 
            //so 6,7 ,8 are chhosen but 8 is in next row 
            if (no_of_candies >= 4) invalidIndex.push(i + 2);//for 4 and 5
            if (no_of_candies == 5) invalidIndex.push(i + 3);//for 5 
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
 * or you coul apply this logic where you check whether the index is of last columns or not if yes 
 * then skip it 
             * examlple for 3 candies 
             * if((i>width-2) &&  (i%width ==2 || i%width ==1 )){continue;}cheks whether index is of last 2 columns
             */
            if (invalidIndex.includes(i)) continue;
            
            
            /***
             * 
             * If Every Element satisfies the condition after arrow 
             * Or for every element the fuction returns true.
             * 
             * then the final result is true 
             */
            let match = candiesList.every((index) => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += no_of_candies;
                // console.log(score)
                candiesList.forEach(index => candies[index].style.backgroundImage = "")
            }


        }

    }


    function checkColumnforFive() {
        let len = width * (width - 4);

        for (let i = 0; i < len; i++) {
            let fiveCandies = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            let desiredImage = candies[i].style.backgroundImage;

            /***
             * 
             * If Every Element satisfies the condition after arrow 
             * Or for every element the fuction returns true.
             * then the final result is true 
             * 
             */
            let match = fiveCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += 5;
                console.log(score)
                fiveCandies.forEach(index => candies[index].style.backgroundImage = "")
            }

        }
    }

    function checkColumnforFour() {
        let len = width * (width - 3);

        for (let i = 0; i < len; i++) {
            let fourCandies = [i, i + width, i + width * 2, i + width * 3];
            let desiredImage = candies[i].style.backgroundImage;

            /***
             * 
             * If Every Element satisfies the condition after arrow 
             * Or for every element the fuction returns true.
             * then the final result is true 
             * 
             */
            let match = fourCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += 4;
                console.log(score)
                fourCandies.forEach(index => candies[index].style.backgroundImage = "")
            }

        }
    }

    function checkColumnforThree() {
        let len = width * (width - 2);

        for (let i = 0; i < len; i++) {
            let threeCandies = [i, i + width, i + width * 2];
            let desiredImage = candies[i].style.backgroundImage;

            /***
             * 
             * If Every Element satisfies the below condition after arrow 
             * Or for every element the fuction returns true.
             * then the final result is true 
             * 
             */

            let match = threeCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += 3;
                console.log(score)
                threeCandies.forEach(index => candies[index].style.backgroundImage = "")
            }

        }
    }

    function init() {
        checkRow(5);
        checkColumnforFive();
        checkRow(4);
        checkColumnforFour();
        checkRow(3);
        checkColumnforThree()
        generateRandomCandies();//fillls the gap created by clearing of candy pairs 
    }
    init();

    window.setInterval(function () {
        init()
    }, 100);

});