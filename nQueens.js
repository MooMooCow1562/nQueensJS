let timeout;
let queens;
let grid;
let maxQueens;
const WAS_QUEEN = 3
const QUEEN_VAL = 2;
const INVALID_VAL = 1;
const VALID = 0;
let gridWidth=4;

function step() {
    placeQueen()
}

function queenWithinRange(x, y) {
    for (let direction = 0; direction < 8; direction++) {
        let list = getListOfSquares(x, y, direction)
        if (list.includes(QUEEN_VAL)) {
            return true
        }
    }
    return false
}

function unplaceQueen() {
    for (let y = gridWidth - 1; y > -1; y--) {
        for (let x = gridWidth - 1; x > -1; x--) {
            if (grid[y][x] === QUEEN_VAL) {
                unpaintInvalids([x,y])
                grid[y][x] = WAS_QUEEN
                return
            }
        }
    }
}

function unpaintInvalids(location = []) {
    for (let i = 0; i < 8; i++) {
        unpaintInDirection(location, i)
    }
    let newY = location[1] + 1
    let yCheck = (newY<gridWidth && newY>= 0)
    if(yCheck){
        for (let y = newY; y < gridWidth; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (grid[y][x] === WAS_QUEEN)
                    grid[y][x] = VALID
            }
        }
    }
}

function unpaintInDirection(location, direction) {
    let x = location[1]
    let y = location[0]
    try {
        switch (direction) {
            case 0: //ul
                return recurseInDirectionUnpaint([x, y], [-1, -1])
            case 1: //u
                return recurseInDirectionUnpaint([x, y], [0, -1])
            case 2: //ur
                return recurseInDirectionUnpaint([x, y], [1, -1])
            case 3: //r
                return recurseInDirectionUnpaint([x, y], [1, 0])
            case 4://dr
                return recurseInDirectionUnpaint([x, y], [1, 1])
            case 5://d
                return recurseInDirectionUnpaint([x, y], [0, 1])
            case 6://dl
                return recurseInDirectionUnpaint([x, y], [-1, 1])
            case 7://l
                return recurseInDirectionUnpaint([x, y], [-1, 0])
            default:
                return
        }
    } catch (e) {
    }
}

function recurseInDirectionUnpaint(location, direction) {
	//find direction
    let newY = location[1] + direction[1]
    let newX = location[0] + direction[0]
	let inBoundsCheck = (newY<gridWidth && newY>= 0) && (newX<gridWidth && newX>= 0)
    if (inBoundsCheck && (grid[newY][newX] !== QUEEN_VAL)) {
        if(grid[newY][newX] !== WAS_QUEEN){
            grid[newY][newX] = VALID
        }
        return recurseInDirectionUnpaint([newX,newY], direction)
    }
}

function placeQueen() {
    let havePlacedQueen = false;
    for (let y = 0; y < gridWidth; y++) {
        for (let x = 0; x < gridWidth; x++) {
            let withinRange = queenWithinRange(x, y)
            if (!withinRange && queens !== 0 && grid[y][x] === VALID && !havePlacedQueen) {
                    havePlacedQueen = true
                    grid[y][x] = QUEEN_VAL
                    queens--
            } else if (withinRange && grid[y][x] === VALID) {
                grid[y][x] = INVALID_VAL
            }
        }
    }
    //IF WE LACKED A QUEEN PLACEMENT, UNPLACE A QUEEN
    if (queens !== 0 && !havePlacedQueen) {
        unplaceQueen()
        queens++
    }
    //REPAINT INVALIDS
    for (let y = 0; y < gridWidth; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (queenWithinRange(x, y) && grid[y][x] === VALID) {
                grid[y][x] = INVALID_VAL
            }
        }
    }
}

function getListOfSquares(x, y, direction) {
    let list = []
    try {
        switch (direction) {
            case 0: //ul
                return recurseInDirectionList([x, y], [-1, -1], list)
            case 1: //u
                return recurseInDirectionList([x, y], [0, -1], list)
            case 2: //ur
                return recurseInDirectionList([x, y], [1, -1], list)
            case 3: //r
                return recurseInDirectionList([x, y], [1, 0], list)
            case 4://dr
                return recurseInDirectionList([x, y], [1, 1], list)
            case 5://d
                return recurseInDirectionList([x, y], [0, 1], list)
            case 6://dl
                return recurseInDirectionList([x, y], [-1, 1], list)
            case 7://l
                return recurseInDirectionList([x, y], [-1, 0], list)
        }
    } catch (e) {
    }
}

function recurseInDirectionList(location, direction , arr = [], depth = 0) {
    let newY = location[1] + direction[1]
    let newX = location[0] + direction[0]
    let yCheck = (newY<gridWidth && newY>= 0)
    let xCheck = (newX<gridWidth && newX>= 0)
    if (yCheck && xCheck && location && direction){
        arr[depth] = grid[newY][newX]
        arr = recurseInDirectionList([newX, newY], direction, arr, depth+1)
    }
    return arr
}
const stopDrawBox = document.getElementById("stopDrawTilDone1");
const BOARD = document.getElementById("Board1")
let startTime
function run(){
	if(!startTime){
		startTime = Date.now()
	}
	step()
	if(!stopDrawBox.checked){
		drawBoard()
	}
    if(queens === 0 || queens > Number(document.getElementById("qNum1").value)){
        drawBoard()
        clearTimeout(timeout)
		console.log(Date.now() - startTime)
		startTime = false;
        return
    }
    timeout = setTimeout(run)
}

document.getElementById("Start1").addEventListener("click", () => {
    clearTimeout(timeout)
    timeout = setTimeout(run)
})
document.getElementById("Step1").addEventListener("click", () => {
	step()
	drawBoard()
})
document.getElementById("bSize1").addEventListener("change", resizeBoard)
document.getElementById("qNum1").addEventListener("change", updateQueens)

function create2dArray(width) {
    let arr = []
    for (let i = 0; i < width; i++) {
        arr[i] = []
        for (let j = 0; j < width; j++) {
            arr[i][j] = VALID
        }
    }
    return arr;
}

function updateQueens(e) {
    clearTimeout(timeout)
    if (e)
        queens = Number(e.currentTarget.value)
    else{
        queens = Number(document.getElementById("qNum1").value)
		maxQueens = Number(document.getElementById("qNum1").value)
	}
    let bWith = Number(document.getElementById("bSize1").value)
    grid = create2dArray(bWith)
    gridWidth = bWith
    drawBoard()
}

function resizeBoard(e) {
    clearTimeout(timeout)
    let boardWidth
    if (e)
        boardWidth = Number(e.currentTarget.value)
    else
        boardWidth = Number(document.getElementById("bSize1").value)
    grid = create2dArray(boardWidth)
    gridWidth = boardWidth
    drawBoard()
    updateQueens()
}



//draws board separately from the computations for the board.
function drawBoard() {
	let newStr = ""
    for (let y = 0; y < gridWidth; y++) {
        for (let x = 0; x < gridWidth; x++) {
            newStr += drawCell(x, y)
		}
		newStr+="<br>"
    }
	BOARD.innerHTML = newStr
	BOARD.style.wordWrap = "break-word"
	BOARD.style.width = gridWidth + "em"
}



//draws a cell, given two coordinates
function drawCell(x, y) {
	let character
	switch(Number(grid[y][x])){
		case QUEEN_VAL:
			return character = "<b>Q</b>|"
		case INVALID_VAL:
			return character = "X|"
		case WAS_QUEEN:
			return character = "W|"
		case VALID:
			return character = "_|"
		default:
			return character = "_|"
	}
}

updateQueens()
resizeBoard()