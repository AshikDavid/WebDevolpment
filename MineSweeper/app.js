//document.addEventListener('DOMContentLoaded',() =>{

//})
const grid = document.querySelector('.grid');
const flagsLeft = document.querySelector('#flags-left');
const result = document.querySelector('#result');
const width = 10;
let bombAmt = 20;
let squares = [];
let isGameOver=false;
let flag=0;



function createBoard() {
    flagsLeft.innerHTML = bombAmt;
    //get shuffled game array with random bomb
    const bombArray = Array(bombAmt).fill('bomb');
    const emptyArray = Array(width * width - bombAmt).fill('valid');
    const gameArray = emptyArray.concat(bombArray);
    const shuffleArray = gameArray.sort(() => Math.random() - .5)
    // console.log(shuffleArray);
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.id = i;
        square.classList.add(shuffleArray[i]);
        grid.appendChild(square);
        squares.push(square);

        //normal click
        square.addEventListener('click', function () {
           click(square);
        });
        square.addEventListener('contextmenu', function (e) { 
            e.preventDefault() ;
            addFlag(square);
        });

        //  console.log(squares);
    }
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains('valid')) {

            if (i < 89 && squares[i + width].classList.contains('bomb'))
                total++;
            if (i > 10 && squares[i - width].classList.contains('bomb'))
                total++;
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
                total++;
            if (i > 98 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
                total++;
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb'))
                total++;
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb'))
                total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb'))
                total++;
            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb'))
                total++;
            squares[i].setAttribute('data',total);
        }

    }
}

createBoard();

function addFlag(square){
    if(isGameOver)
        return;
    if(!square.classList.contains('checked')&&(flag<bombAmt)){
        if(!square.classList.contains('flag')){
            square.classList.add('flag');
            square.innerHTML='🚩';
            flag++;
            flagsLeft.innerHTML=bombAmt-flag;
            checkForWin();
        }
        else{
            square.classList.remove('flag');
            square.innerHTML='';
            flag--;
            flagsLeft.innerHTML=bombAmt-flag;
        }
    }
}

function click(square) {
    let currentId=square.id;
    if(isGameOver || square.classList.contains('checked') || square.classList.contains('flag'))
        return;
    if(square.classList.contains('bomb'))
        gameOver(square);
    else{
        let total=square.getAttribute('data');
        if(total!=0){
            square.classList.add('checked');
            if(total===1)
                square.classList.add('one')
            if(total===2)
                square.classList.add('two');
            if(total===3)
                square.classList.add('three');
            if(total===4)
                square.classList.add('four');
            square.innerHTML=total;
            return;
        }
        checkSquare(square,currentId);
    }
    square.classList.add('checked');
}

// checkSquare function
function checkSquare(square, currentId) {
  const isLeftEdge = (currentId % width === 0);
  const isRightEdge = (currentId % width === width - 1);

  // Use setTimeout to introduce a delay for a visual effect
  setTimeout(() => {
    // Check and reveal neighboring squares based on the current square's position

    // Left square
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Top-right square
    if (currentId > 9 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Top square
    if (currentId > 10) {
      const newId = squares[parseInt(currentId - width)].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Top-left square
    if (currentId > 11 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Right square
    if (currentId < 98 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Bottom-left square
    if (currentId < 90 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Bottom-right square
    if (currentId < 88 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    // Bottom square
    if (currentId < 89) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10); // Introduce a 10-millisecond delay for a visual effect
}


function gameOver(square){
    result.innerHTML="!!Game Over!!";
    isGameOver=true;

    squares.forEach(square=>{
        if(square.classList.contains('bomb')){
            square.innerHTML="💣";
            square.classList.remove('bomb');
            square.classList.add('checked');
        }
    })
}

function checkForWin(){
    let matches=0;
    for(let i=0;i<squares.length;i++){
        if(squares[i].classList.contains('flag')&& squares[i].classList.contains('bomb')){
            matches++;
        }
        if(matches===bombAmt){
            result.innerHTML="You Won";
            isGameOver=true;
        }
    }
}

