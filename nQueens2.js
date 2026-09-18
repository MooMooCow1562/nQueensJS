let timeout1;
let queens1;
let grid1;
let grid1Dimension;
let maxQueens1;
let startTime1;
let furthestRow1 = 0;
let freeRows = 0;

let CellTypes = {
	VALID: "_|",
	V_NUM: 1,
	INVALID: "X|",
	I_NUM: 2,
	QUEEN: "<b>Q</b>|",
	Q_NUM: 3,
	WAS_QUEEN: "W|",
	W_NUM: 4
}

const STOP_DRAW_BX = document.getElementById("stopDrawTilDone2")
const DRAW_ALL_BX = document.getElementById("drawAll2")
const QUEENS_NUMBER_IN = document.getElementById("qNum2")
const BOARD_OUT = document.getElementById("Board2")
const B_SIZE_IN = document.getElementById("bSize2")
const START_BTN = document.getElementById("Start2")

START_BTN.addEventListener("click", () => {
    clearTimeout(timeout1)
    timeout1 = setTimeout(run1)
	startTime1 = false
	shouldUnplace1 = false
})
STOP_DRAW_BX.addEventListener("change",forceDraw)
function step1() {
	//if the user said not to place any queens1, don't.
	if(queens1 === 0 || maxQueens1 === 0){
		return
	}
	stepCounter++
	if(queens1 <= freeRows){
		let openSpace = findFirstOpenSpace1(furthestRow1)
		if(openSpace !== -1){
			grid1[furthestRow1][openSpace] = CellTypes.Q_NUM
			//decrement queens1
			queens1--
			paintInvalidsFor1Queen1(furthestRow1, openSpace)
		}else{
			if(grid1Dimension > maxQueens1)
				while(findFirstOpenSpace1(furthestRow1) === -1){
					furthestRow1++
				}
			return
		}
		furthestRow1++
	}else{
		let q = findMostRecentQueen1()
		unpaintWasQueens1(q[0],q[1])
		furthestRow1 = q[1]
		grid1[q[1]][q[0]] = CellTypes.W_NUM
		unpaintInvalids1()
		repaintInvalids1()
		queens1++
	}
}

function unpaintInvalids1(){
	for(let y =0; y < grid1Dimension; y++){
		for(let x =0; x < grid1Dimension; x++){
			if(grid1[y][x] === CellTypes.I_NUM){
				grid1[y][x] = CellTypes.V_NUM
			}
		}
	}
}

function unpaintWasQueens1(x,y){
	//console.log("unpainting invalids for Q-> " + x+ " " + y)
	for(let y1 = y+1; y1 < grid1Dimension; y1++){
		for(let x1 = 0; x1 < grid1Dimension; x1++){
	//		console.log("Looking at square: " + x1 + " " + y1)
			if(grid1[y1][x1] === CellTypes.W_NUM){
				grid1[y1][x1] = CellTypes.V_NUM
			}
		}
	}
}

function repaintInvalids1(){
	for(let y =0; y < grid1Dimension; y++){
		for(let x =0; x < grid1Dimension; x++){
			if(grid1[y][x] === CellTypes.Q_NUM){
				paintInvalidsFor1Queen1(y,x)
			}
		}
	}	
}

function paintInvalidsFor1Queen1(y,x){
	for(let i = 0; i < grid1Dimension; i++){
		if(i!==y && grid1[i][x]===CellTypes.V_NUM){
			grid1[i][x] = CellTypes.I_NUM
		}
		if(i!==x && grid1[y][i]===CellTypes.V_NUM){
			grid1[y][i] = CellTypes.I_NUM
		}
		
		//return true if not current set cell.
		let selfCheck = (x1,y1) => {return (y1 !== y && x1 !== x)}
		//dynamic bounds checking.
		let boundsCheck = (x,y) => {return (y >= 0 && y < grid1Dimension) && (x >= 0 && x < grid1Dimension)}

		//directions
		let backwards = x - i
		let forwards = x + i
		let up = y - i
		let down = y + i
		
		if(selfCheck(backwards,up) && boundsCheck(backwards,up) && grid1[up][backwards]===CellTypes.V_NUM){
			grid1[up][backwards] = CellTypes.I_NUM
		}
		if(selfCheck(forwards,up) && boundsCheck(forwards,up)&& grid1[up][forwards]===CellTypes.V_NUM){
			grid1[up][forwards] = CellTypes.I_NUM
		}
		if(selfCheck(forwards,down) && boundsCheck(forwards,down)&& grid1[down][forwards]===CellTypes.V_NUM){
			grid1[down][forwards] = CellTypes.I_NUM
		}
		if(selfCheck(backwards,down) && boundsCheck(backwards,down)&& grid1[down][backwards]===CellTypes.V_NUM){
			grid1[down][backwards] = CellTypes.I_NUM
		}
	}
}

function findFirstOpenSpace1(row){
	return grid1[row].findIndex((val) => {return val === CellTypes.V_NUM})
}

function findMostRecentQueen1(){
	for(let y = grid1Dimension-1; y>=0; y--){
		for(let x = grid1Dimension-1; x>=0; x--){
			if(grid1[y][x] === CellTypes.Q_NUM){
				return [x,y]
			}
		}
	}
}

let stepCounter = 0
let loopsCounter = 0
let loopsModulo = Number(document.getElementById("speed2").value)
document.getElementById("speed2").addEventListener("change", (e)=>{loopsModulo = Number(e.target.value)})

function run1(){
	if(!startTime1){
		startTime1 = Date.now()
	}
	if(maxQueens1 > grid1Dimension){
		alert("Too many queens to place!")
		clearTimeout(timeout1)
        return
	}
	step1()
	loopsCounter++
	loopsCounter%= loopsModulo
	drawBoard1()
    if(queens1 === 0 || queens1 > Number(QUEENS_NUMBER_IN.value)){
		forceDraw()
		clearTimeout(timeout1)
		setTimeout(()=>{alert("Time taken in milliseconds: " + (Date.now() - startTime1) + "\nIterations Taken: " + stepCounter)}, 50)
        return
    }
    timeout1 = setTimeout(run1)
}

function create2dArray1(width) {
    let arr = []
    for (let i = 0; i < width; i++) {
        arr[i] = []
        for (let j = 0; j < width; j++) {
            arr[i][j] = CellTypes.V_NUM
        }
    }
    return arr;
}

//resets the entire simulation
function resetAndSet(e){
	furthestRow1 = 0
	displayCounter = 1
	stepCounter = 0
	//stop the timeout loop
    clearTimeout(timeout1)
	//reset the queens
	queens1 = Number(QUEENS_NUMBER_IN.value)
	maxQueens1 = Number(QUEENS_NUMBER_IN.value)
	//reset and resize the board
	let bWith = Number(B_SIZE_IN.value)
    grid1 = create2dArray1(bWith)
    grid1Dimension = bWith
	//draw the board
    forceDraw()
}

B_SIZE_IN.addEventListener("change", resetAndSet)
QUEENS_NUMBER_IN.addEventListener("change", resetAndSet)

document.getElementById("Step2").addEventListener("click", () => {
	step1()
	drawBoard1()
})

//draws board

function drawBoard1() {
	let newStr = ""
	freeRows = 0
    for (let y = 0; y < grid1Dimension; y++) {
		if(grid1[y].findIndex((val) => {return val === CellTypes.V_NUM}) !== -1)
			freeRows++
       	if(!STOP_DRAW_BX.checked){
			if(loopsCounter === 0){
				for (let x = 0; x < grid1Dimension; x++)
					newStr += drawCell1(x, y)
				newStr+="  |"
				newStr+="" + grid1[y].findIndex((val) => {return val === CellTypes.Q_NUM})
				newStr+="<br>"
			}
		}
    }
	if(STOP_DRAW_BX.checked){
		newStr = "Number of unoccupied rows: " + freeRows+ "<br>Number of unplaced queens: " + queens1+"<br>Steps taken: "+stepCounter
		BOARD_OUT.innerHTML = newStr
	}
	if(!STOP_DRAW_BX.checked && loopsCounter === 0){
		BOARD_OUT.innerHTML = newStr
	}
}

function forceDraw(){
	let newStr = ""
	freeRows = 0
    for (let y = 0; y < grid1Dimension; y++) {
		if(grid1[y].findIndex((val) => {return val === CellTypes.V_NUM}) !== -1)
			freeRows++
		for (let x = 0; x < grid1Dimension; x++)
			newStr += drawCell1(x, y)
		newStr+="  |"
		newStr+="" + grid1[y].findIndex((val) => {return val === CellTypes.Q_NUM})
		newStr+="<br>"
	}
	if(STOP_DRAW_BX.checked)
		newStr = "Number of unoccupied rows: " + freeRows+ "<br>Number of unplaced queens: " + queens1+"<br>Steps taken: "+stepCounter
	BOARD_OUT.innerHTML = newStr
}

BOARD_OUT.style.wordWrap = "break-word"
BOARD_OUT.style.width = grid1Dimension + "em"

//draws a cell, given two coordinates
function drawCell1(x, y) {
	let character
	switch(Number(grid1[y][x])){
		case CellTypes.Q_NUM:
			return CellTypes.QUEEN
		case CellTypes.I_NUM:
			return CellTypes.INVALID
		case CellTypes.W_NUM:
			return CellTypes.WAS_QUEEN
		case CellTypes.V_NUM:
			return CellTypes.VALID
		default:
			//nothing
	}
}

resetAndSet()
drawBoard1()