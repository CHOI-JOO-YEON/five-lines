const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
    AIR,
    FLUX,
    UNBREAKABLE,
    PLAYER,
    STONE, FALLING_STONE,
    BOX, FALLING_BOX,
    KEY1, LOCK1,
    KEY2, LOCK2
}

interface Tile {
    isCanFall(): boolean;

    isAir(): boolean;

    isLock1(): boolean;

    isLock2(): boolean;

    isFalling(): boolean;


    draw(g: CanvasRenderingContext2D, x: number, y: number): void;

    moveHorizontal(dx: number): void;

    moveVertical(dy: number): void;

    update(x: number, y: number): void;
}

export class Air implements Tile {
    isCanFall(): boolean {
        return false;
    }

    isAir(): boolean {
        return true;
    }


    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }


    isFalling(): boolean {
        return false;
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
    }

    moveHorizontal(dx: number) {
        moveToTile(playerx + dx, playery);
    }

    moveVertical(dy: number) {
        moveToTile(playerx, playery + dy);
    }


    update(x: number, y: number): void {
    }
}

class Box implements Tile {

    private fallStrategy: FallStrategy;

    isCanFall(): boolean {
        return true;
    }

    constructor(falling: FallingState) {
        this.fallStrategy = new FallStrategy(falling);
    }


    isAir(): boolean {
        return false;
    }


    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }

    isFalling(): boolean {
        return this.fallStrategy.getFalling().isFalling();
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#8b4513";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(dx: number) {
        this.fallStrategy.getFalling().moveHorizontal(this, dx);
    }

    moveVertical(dy: number) {
    }


    update(x: number, y: number): void {
    }
}


class Flux implements Tile {
    isCanFall(): boolean {
        return false;
    }


    isAir(): boolean {
        return false;
    }

    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }

    isFalling(): boolean {
        return false;
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#ccffcc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(dx: number) {
        moveToTile(playerx + dx, playery);
    }

    moveVertical(dy: number) {
        moveToTile(playerx, playery + dy);
    }


    update(x: number, y: number): void {
    }
}

class KeyConfiguration{
    constructor(private color:string, private _1: boolean, private removeStrategy:RemoveStrategy) {}
    getColor(){
        return this.color;
    }
    is1() {return this._1}
    getRemoveStrategy(){return this.removeStrategy}

}


class Key implements Tile {
    constructor(private keyConfiguration:KeyConfiguration) {

    }

    isCanFall(): boolean {
        return false;
    }

    isAir(): boolean {
        return false;
    }

    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }


    isFalling(): boolean {
        return false;
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = this.keyConfiguration.getColor();
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(dx: number) {
        remove(this.keyConfiguration.getRemoveStrategy());
        moveToTile(playerx + dx, playery);
    }

    moveVertical(dy: number) {
        remove(this.keyConfiguration.getRemoveStrategy());
        moveToTile(playerx, playery + dy);
    }


    update(x: number, y: number): void {
    }
}

class Lock implements Tile {
    constructor(private keyConfiguration:KeyConfiguration) {
    }

    isCanFall(): boolean {
        return false;
    }

    isAir(): boolean {
        return false;
    }


    isLock1(): boolean {
        return this.keyConfiguration.is1();
    }

    isLock2(): boolean {
        return !this.keyConfiguration.is1();
    }

    isFalling(): boolean {
        return false;
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = this.keyConfiguration.getColor();
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(dx: number) {

    }

    moveVertical(dy: number) {

    }


    update(x: number, y: number): void {
    }
}

class Player implements Tile {
    isCanFall(): boolean {
        return false;
    }


    isAir(): boolean {
        return false;
    }


    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }

    isFalling(): boolean {
        return false;
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
    }

    moveHorizontal(dx: number) {

    }

    moveVertical(dy: number) {

    }


    update(x: number, y: number): void {
    }
}

interface FallingState {
    isFalling(): boolean;

    moveHorizontal(tile: Tile, dx: number): void;
}

class Falling implements FallingState {
    isFalling(): boolean {
        return true;
    }

    moveHorizontal(tile: Tile, dx: number) {

    }
}

class Resting implements FallingState {
    isFalling(): boolean {
        return false;
    }

    moveHorizontal(tile: Tile, dx: number) {
        if (map[playery][playerx + dx + dx].isAir()
            && map[playery + 1][playerx + dx].isAir()) {
            map[playery][playerx + dx + dx] = tile;
            moveToTile(playerx + dx, playery);
        }
    }
}

class FallStrategy {
    constructor(private falling: FallingState) {
    }


    update(tile: Tile, x: number, y: number) {
        this.falling = map[y + 1][x].isAir() ? new Falling() : new Resting();
        this.drop(tile, x, y);
    }

    private drop(tile: Tile, x: number, y: number) {
        if (this.falling.isFalling()) {
            map[y + 1][x] = tile;
            map[y][x] = new Air();
        }
    }

    getFalling() {
        return this.falling;
    }
}

class Stone implements Tile {
    private fallStrategy: FallStrategy;

    isCanFall(): boolean {
        return true;
    }

    constructor(falling: FallingState) {
        this.fallStrategy = new FallStrategy(falling);
    }

    isAir(): boolean {
        return false;
    }


    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }


    isFalling(): boolean {
        return this.fallStrategy.getFalling().isFalling();
    }

    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#0000cc";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(dx: number) {
        this.fallStrategy.getFalling().moveHorizontal(this, dx);
    }

    moveVertical(dy: number) {

    }


    update(x: number, y: number): void {
        this.fallStrategy.update(this, x, y);
    }
}

class Unbreakable implements Tile {
    isCanFall(): boolean {
        return false;
    }


    isAir(): boolean {
        return false;
    }

    isLock1(): boolean {
        return false;
    }

    isLock2(): boolean {
        return false;
    }


    isFalling(): boolean {
        return false;
    }


    draw(g: CanvasRenderingContext2D, x: number, y: number) {
        g.fillStyle = "#999999";
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    moveHorizontal(dx: number) {
    }

    moveVertical(dy: number) {

    }


    update(x: number, y: number): void {
    }
}

interface Input {
    isRight(): boolean;

    isLeft(): boolean;

    isUp(): boolean;

    isDown(): boolean;

    handle(): void
}

class Right implements Input {
    isRight() {
        return true
    }

    isLeft() {
        return false
    }

    isUp() {
        return false
    }

    isDown() {
        return false
    }

    handle() {
        moveHorizontal(1);
    }

}

class Left implements Input {
    isRight() {
        return false
    }

    isLeft() {
        return true
    }

    isUp() {
        return false
    }

    isDown() {
        return false
    }

    handle() {
        moveHorizontal(-1);
    }
}

class Up implements Input {
    isRight() {
        return false
    }

    isLeft() {
        return false
    }

    isUp() {
        return true
    }

    isDown() {
        return false
    }

    handle() {
        moveVertical(-1);
    }
}

class Down implements Input {
    isRight() {
        return false
    }

    isLeft() {
        return false
    }

    isUp() {
        return false
    }

    isDown() {
        return true
    }

    handle() {
        moveVertical(1);
    }
}

let playerx = 1;
let playery = 1;


let rawMap: RawTile[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 3, 0, 1, 1, 2, 0, 2],
    [2, 4, 2, 6, 1, 2, 0, 2],
    [2, 8, 4, 1, 1, 2, 0, 2],
    [2, 4, 1, 1, 1, 9, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile[][];
interface RemoveStrategy {
    check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy {
    check(tile: Tile) {
        return tile.isLock1();
    }
}

class RemoveLock2 implements RemoveStrategy {
    check(tile: Tile) {
        return tile.isLock2();
    }
}

const YELLOW_KEY =
    new KeyConfiguration("#ffcc00", true, new RemoveLock1());

const BLUE_KEY =
    new KeyConfiguration("#00ccff", false, new RemoveLock2());
function transformTile(tile: RawTile) {
    switch (tile) {
        case RawTile.AIR:
            return new Air();
        case RawTile.BOX:
            return new Box(new Falling());
        case RawTile.KEY1:
            return new Key(YELLOW_KEY);
        case RawTile.KEY2:
            return new Key(BLUE_KEY);
        case RawTile.FALLING_BOX:
            return new Box(new Resting());
        case RawTile.FLUX:
            return new Flux();
        case RawTile.FALLING_STONE:
            return new Stone(new Falling());
        case RawTile.LOCK1:
            return new Lock(YELLOW_KEY)
        case RawTile.LOCK2:
            return new Lock(BLUE_KEY);
        case RawTile.PLAYER:
            return new Player();
        case RawTile.STONE:
            return new Stone(new Resting());
        case RawTile.UNBREAKABLE:
            return new Unbreakable();

    }
}

function transformMap() {
    map = new Array(rawMap.length);
    for (let y = 0; y < rawMap.length; y++) {
        map[y] = new Array(rawMap[y].length);
        for (let x = 0; x < rawMap[y].length; x++) {
            map[y][x] = transformTile(rawMap[y][x]);
        }
    }
}

let inputs: Input[] = [];



function remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (shouldRemove.check(map[y][x])) {
                map[y][x] = new Air();
            }
        }
    }
}


function moveToTile(newx: number, newy: number) {
    map[playery][playerx] = new Air();
    map[newy][newx] = new Player();
    playerx = newx;
    playery = newy;
}

function moveHorizontal(dx: number) {
    map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
    map[playery + dy][playerx].moveVertical(dy);
}

function update() {
    handleInputs();
    updateMap();
}


function handleInputs() {
    while (inputs.length > 0) {
        let input = inputs.pop();
        input.handle();
    }
}

function updateMap() {
    for (let y = map.length - 1; y >= 0; y--) {
        for (let x = 0; x < map[y].length; x++) {
            updateTile(x, y);
        }
    }
}

function updateTile(x: number, y: number) {
    map[y][x].update(x, y);
}

function draw() {
    let g = createGraphics();
    drawMap(g);
    drawPlayer(g);
}

function createGraphics() {
    let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
    let g = canvas.getContext("2d");

    g.clearRect(0, 0, canvas.width, canvas.height);
    return g;
}


function drawMap(g: CanvasRenderingContext2D) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            map[y][x].draw(g, x, y);
        }
    }
}


function drawPlayer(g: CanvasRenderingContext2D) {
    g.fillStyle = "#ff0000";
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
    let before = Date.now();
    update();
    draw();
    let after = Date.now();
    let frameTime = after - before;
    let sleep = SLEEP - frameTime;
    setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
    transformMap();
    gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
    if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
    else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
    else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
    else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

