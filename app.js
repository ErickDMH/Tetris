document.addEventListener('DOMContentLoaded', ()=> {
  const grid = document.querySelector('.grid')
  let squares =  []
  for(let squares_count = 0; squares_count < 210; squares_count++ ){
    let square = document.createElement('div')
    if(squares_count > 199){
      square.classList.add('taken')
    }
    squares.push(square)
    grid.appendChild(square)
  }
  
  const miniGrid = document.querySelector('.mini-grid')
  let miniSquares =  []
  for(let squaresCount = 0; squaresCount < 16; squaresCount++ ){
    let square = document.createElement('div')
    square.classList.add('mini')
    miniSquares.push(square)
    miniGrid.appendChild(square)
  }

  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPositon = 4
  let currentRotation = 0

  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = []
  current = theTetrominoes[random][currentRotation]

  function draw() {
    current.forEach(index => {
      squares[currentPositon + index].classList.add('tetromino')
      squares[currentPositon + index].style.backgroundColor = colors[random]
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPositon + index].classList.remove('tetromino')
      squares[currentPositon + index].style.backgroundColor = ''
    })
  }

  function control(e) {
    switch(e.keyCode){
    case 37: {
      moveLeft()
      break
    }
    case 38: {
      rotate()
      break
    }
    case 39: {
      moveRight()
      break
    }
    case 40: {
      moveDown()
      break
    }
  }
  }
  document.addEventListener('keyup', control)

  function moveDown() {
    undraw()
    currentPositon += width
    draw()
    freeze()
  }

  function freeze() {
    if(current.some(index => squares[currentPositon + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPositon + index].classList.add('taken'))
      random = nextRandom 
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPositon = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPositon + index) % width === 0)
    if(!isAtLeftEdge) currentPositon -=1
    if(currentPositon.some(index => squares[currentPositon + index].classList.contains('taken'))){
      currentPositon +=1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPositon + index) % width === width -1)
    if(!isAtRightEdge) currentPositon +=1
    if(currentPositon.some(index => squares[currentPositon + index].classList.contains('taken'))){
      currentPositon -=1
    }
    draw()
  }
  
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  //miniGrid
  const displayWidth = 4
  let displayIndex = 0

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ]

  function displayShape(){
    miniSquares.forEach(square => {
      square.classList.remove('tetromino')      
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index =>{
      miniSquares[displayIndex + index].classList.add('tetromino')
      miniSquares[displayIndex + index].style.backgroundColor = colors[nextRandom]      
    })
  }

  startButton.addEventListener('click', ()=>{
    if(timerId){
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })

  function addScore() {
    for( let i = 0; i < 199; i +=width){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))){
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')          
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        console.log(squaresRemoved)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if(current.some(index => squares[currentPositon +index].classList.contains('taken'))){
      scoreDisplay.innerHTML  ='end'
      clearInterval(timerId)
    }
  }
})