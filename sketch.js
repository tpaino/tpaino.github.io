let estaSonando = null;
function changeMusica(newTrackName) {
    if (estaSonando != null) {
        estaSonando.stop(); // Para lo que está sonando
    }
    estaSonando = loadSound(newTrackName, () => {
        estaSonando.loop(); // Suena en loop, se asegura de que la pista esté cargada antes de reproducirla
    }, (error) => {
        console.error('Error al cargar la pista: ', error); // Manejo de errores
    });
}

let start;
let comenzar = false; //en que habitacion empezamos
let roomLevel = 1;
let roomNumber = 1; //disparar
let merica = false; //correr
let quick = false;
let colorStart = 255; //carátula principal
function startGame() {
    start = loadImage("media/start.png");
    if (comenzar == false) {
        if (newRoom == false) changeMusica("media/YouBelongWithMe.mp3"); //musica con la que parte, al comenzar el juego cambia
        newRoom = true;
        image(start, 400, 400, 800, 800);
        textAlign(CENTER);
        textFont('serif');
        fill(colorStart);
        text("START", width / 2, 730); //hacer clic para comenzar
        if (310 < mouseX && mouseX < 495 && 690 < mouseY && mouseY < 740) {
            colorStart = color(188, 0, 0);
            cursor(HAND);
            if (mousePressed) {
                pausa = false;
                comenzar = true;
                newRoom = false;
            }
        } else {
            cursor(ARROW);
            colorStart = color(0);
        }
    }
}
function deathScreen() {
    //indica cuando perdiste
    if (hp <= 0) {
        return true;
    }
    return false;
}
let pausa = true; //cuando le pones pausa

let era;
function onScreen(x, y, z) {
    //indica si un objeto esta en pantalla
    return z / 2 < x && x < width - z / 2 && z / 2 < y && y < height - z / 2;
}
let mostrarBotas = true;
let mostrarGuitarra = true;
let mostrarMejora = true;
let masHP1 = true; //se puede recuperar vida matando a los bosses!!
let masHP2 = true; //–––––––––––––––––––––––––––––––––CAMBIO DE HABITACIÓN–––––––––––––––––––––––––––––––––
let permisoRtl, permisoLtr, permisoDtu, permisoUtd; //permisos para cambiar de habitación, se habilitan a medida que se avanza en el juego
let newRoom = false;
function openRtl(x, y) {
    //Rtl = right to left, es true cuando el personaje toca las puertas
    if (permisoRtl) {
        if (300 < y && y < 500 && x < dist1) {
            //si pongo dist1 = 60, se cambia solo una vez, NO HACER
            return true;
        }
    }
    return false;
}
function openLtr(x, y) {
    // Ltr = left to right
    if (permisoLtr) {
        if (300 < y && y < 500 && width - dist1 < x) {
            return true;
        }
    }
    return false;
}
function openDtu(y) {
    //Dtu = down to up
    if (permisoDtu) {
        if (y < dist1) {
            return true;
        }
    }
    return false;
}
function openUtd(y) {
    //Utd = up to down
    if (permisoUtd) {
        if (height - dist1 < y) {
            return true;
        }
    }
    return false;
} //–––––––––––––––––––––––––––––––––PERSONAJE–––––––––––––––––––––––––––––––––
let px, py, size;
function vel() {
    if (roomLevel == 5) {
        //cuando este en la ultima habitación, su vel cambia
        return 10;
    } else {
        return 30;
    }
}
let velActual;
let dist1;
let hp = 13; //health points
let maxHP = 12;
function hitbox() {
    //pierdes vida si se realiza un ataque en este radio
    if (roomLevel == 5) {
        return 15;
    } else return 60;
}
let velShoot = 35;
let damage = 5;
let disparando = false;
function hpTaylor() {
    //indicador visual de la vida restante
    rectMode(CORNER);
    noStroke();
    fill(255);
    rect(width - 280, 10, 270, 32);
    for (let i = width - 272; i < width - maxHP; i += 20) {
        fill(240, 137, 193);
        rect(i, 15, 15, 22);
    }
    rectMode(CENTER);
} //–––––––––––––––––––––––––––––––––MOVIMIENTO–––––––––––––––––––––––––––––––––
let w, a, s, d;
let shift, space;
function limite(x1, y1, x2, y2, tamano) {
    //toda interacción de taylor con un objeto fijo se puede regular con esta variable-función
    let x11 = x1 - tamano / 2;
    let y11 = y1 - tamano / 2;
    let x22 = x2 + tamano / 2;
    let y22 = y2 + tamano / 2;
    return x11 < px && px < x22 && y11 < py && py < y22;
} //limite(posObjetoX1,posObjetoY1,posObjetoX2,posObjetoY2, tamano personaje)
function limiteFinal(px, py, x1, y1, x2, y2, tamano) {
    //toda interacción de objeto1 con objeto2 fijo se puede regular con esta variable-función
    let x11 = x1 - tamano / 2;
    let y11 = y1 - tamano / 2;
    let x22 = x2 + tamano / 2;
    let y22 = y2 + tamano / 2;
    return x11 < px && px < x22 && y11 < py && py < y22;
}

class Bala {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    moverBala() {
        this.x += this.vx;
        this.y += this.vy;
    }
    showBala() {
        if (johnM() || jakeG())
            image(
                brokenH,
                this.x,
                this.y,
                size / 1.5,
                size / 1.5
            );
        //estos disparan corazones rotos
        else if (scooterB())
            image(disco, this.x, this.y, size * 2, size * 2); //él dispara CDs
    }
}
let disparo = []; //lista que almacenará las balas que disparamos
let lastShoot = 0; //último disparo
let newShoot = 200; //milisegundos entre disparos
function asesinar() {
    if (disparando && millis() - lastShoot > newShoot) {
        //si la barra espaciadora está presionada y ha pasado suficiente tiempo, dispara
        disparo.push(new Shoot(px, py, lastDirX, lastDirY));
        lastShoot = millis(); //actualiza el tiempo del último disparo
    }
    for (let i = disparo.size() - 1; i >= 0; i--) {
        //itera sobre los elementos que están dentro de la lista 'disparo'
        let shoot = disparo.get(i); //define la variable "shoot" como el objeto número i en la lista "disparo"
        if (pausa == false) {
            shoot.updateShoot();
            shoot.showShoot();
        }
        if (onScreen(shoot.x, shoot.y, 20)) {
            if (johnM()) {
                if (john.limites2(shoot.x, shoot.y)) {
                    //si choca con los bosses, el disparo se remueve
                    disparo.remove(i);
                }
            } else if (jakeG()) {
                if (jake.limites2(shoot.x, shoot.y)) {
                    disparo.remove(i);
                }
            } else if (scooterB()) {
                shoot.showShoot();
                if (scooter.limites2(shoot.x, shoot.y)) {
                    disparo.remove(i);
                }
            }
        }
    }
    if (newRoom == false) {
        // si cambia la pieza las balas desaparecen
        disparo.clear();
    }
}

class Shoot {
    limitShoot() {
        return (
            30 < this.x &&
            this.x < width + 30 &&
            -30 < this.y &&
            this.y < height + 30
        );
    }
    constructor(inicioX, inicioY, dirX, dirY) {
        this.x = inicioX;
        this.y = inicioY;
        this.vx = dirX * velShoot;
        this.vy = dirY * velShoot;
        this.dmg = damage;
        if (
            (this.vx == 0 && this.vy == 0) ||
            johnM() ||
            jakeG() ||
            scooterB()
        ) {
            this.vx = velShoot;
            this.vy = 0;
        }
        if (scooterB()) {
            this.vx = 0;
            if (py < scooter.bposY) this.vy = velActual + 1;
            else this.vy = -velShoot;
        }
    }
    updateShoot() {
        //actualizar la posición
        this.x += this.vx;
        this.y += this.vy;
        if (john.limites2(this.x, this.y) && johnM()) {
            bhp1 -= this.dmg;
            this.dmg = 0;
        }
        if (jake.limites2(this.x, this.y) && jakeG()) {
            bhp2 -= this.dmg;
            this.dmg = 0;
        }
        if (scooter.limites2(this.x, this.y) && scooterB()) {
            bhp3 -= this.dmg;
            this.dmg = 0;
        }
    }
    showShoot() {
        fill(255, 255, 0);
        noStroke();
        if (mostrarMejora == false)
            image(
                notaShoot,
                this.x,
                this.y,
                size * 1.5,
                size * 1.5
            );
        else
            image(
                notaShoot,
                this.x,
                this.y,
                size / 1.5,
                size / 1.5
            );
    }
} //las siguientes son funciones base para modelar cada pieza según su ubicación
function roomL(a, b, c, d) {
    //left
    era = a;
    stroke(b);
    line(width, 300, width, 500);
    roomLevel = c;
    roomNumber = d;
}
function roomC(b, c, d, e) {
    //center
    era = color(240, 137, 193);
    image(piso, 400, 400, 800, 800);
    stroke(b);
    line(0, 300, 0, 500);
    stroke(c);
    line(width, 300, width, 500);
    roomLevel = d;
    roomNumber = e;
}
function roomC1(b, c, d) {
    //center arriba
    era = color(240, 137, 193);
    image(piso, 400, 400, 800, 800);
    stroke(b);
    roomLevel = c;
    roomNumber = d;
    line(300, height, 500, height);
}
function roomR(a, b, c, d) {
    //right
    era = a;
    stroke(b);
    line(0, 300, 0, 500);
    roomLevel = c;
    roomNumber = d;
} //––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––JOHN MEYER––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//–––––––––––––variables–––––––––––––
let bhp1 = 50; // boss 1 health points
function johnM() {
    //indica si estamos en la habitacion del boss
    if (roomLevel == 2 && roomNumber == 1) {
        return true;
    }
    return false;
}
function johnVivo() {
    //indica si el boss esta vivo
    if (0 < bhp1) {
        return true;
    }
    return false;
}
let john; //crea el objeto john en la clase John
let balas1 = []; //lista que guardará las balas del boss 1
//–––––––––––––funciones–––––––––––––
function dearjohn() {
    //funcion principal que junta todas las clases relacionadas a este boss
    if (johnM() && johnVivo()) {
        //debe estar en la pieza de speak now
        if (pausa == false) {
            john.moverJohn();
        }
        john.mostrarJohn();
        for (let i = balas1.size() - 1; i >= 0; i--) {
            //para ir mostrando y actualizando la pos de las balas
            let bala1 = balas1.get(i); //define la variable "bala" como el objeto número i en la lista "balas"
            if (pausa == false) {
                bala1.moverBala(); //mueve la bala i
            }
            bala1.showBala(); //presenta la bala i
            if (onScreen(bala1.x, bala1.y, 15) == false) {
                balas1.remove(i); //si sale de los limites, la bala desaparece
            }
            if (
                px - hitbox() < bala1.x &&
                bala1.x < px + hitbox() &&
                py - hitbox() < bala1.y &&
                bala1.y < py + hitbox()
            ) {
                //si le pega al personaje, éste pierde vida
                hp -= 1;
                maxHP += 20;
                balas1.remove(i);
            }
        }
    }
    if (johnM() && johnVivo() == false) {
        //si el boss muere, se gana un album y aparece la llave del siguiente nivel. tb se regalan 3 vidas
        showSpeaknow = true;
        if (keyFearless) {
            image(fearlessKey, 400, 100, size, size);
            if (limite(350, 0, 450, 100, size)) keyFearless = false;
        }
        if (masHP1) {
            image(masHP, 400, 700, size, size);
            if (limite(350, 700, 450, 800, size)) {
                masHP1 = false;
                hp += 3;
                maxHP -= 60;
            }
        }
    }
}

class John {
    constructor(bposX, bposY) {
        this.bposX = bposX;
        this.bposY = bposY;
        this.velboss = 12;
        this.velbala = -12;
        this.contador = 0;
        this.contador2 = 0;
        this.reset2 = random(15, 30); // define cada cuanto tiempo el boss cambia de dirección
        this.reset = 15; // define el intervalo de tiempo entre balas
        this.mult = int(random(-2, 2));
    }

    limites2(x, y) {
        // no chocar con boss
        let size = 100; // Tamaño de referencia para los límites (ajusta según sea necesario)
        if (
            this.bposX - size < x && x < this.bposX + size &&
            this.bposY - size < y && y < this.bposY + size
        ) {
            return true;
        }
        return false;
    }

    moverJohn() {
        this.bposY += this.velboss;
        if (this.bposY < 100 || this.bposY > height - 100) {
            this.velboss *= -1;
        }

        // Regula el disparo de balas
        this.contador++;
        if (this.contador > this.reset) {
            this.disparar();
            this.contador = 0;
        }

        // Cambia la velocidad y dirección aleatoriamente
        if (this.bposY > 200 && this.bposY < height - 200) {
            this.contador2++;
            if (this.contador2 > this.reset2) {
                if (this.mult == 0) {
                    delay(1);
                    this.mult = int(random(-2, 2));
                }
                this.reset2 = random(15, 30);
                this.velboss = random(10, 15) * this.mult;
                this.contador2 = 0;
                this.mult = int(random(-2, 2));
            }
        }
    }

    disparar() {
        // Suma una bala a la lista, según cómo esté implementada
        balas1.push(new Bala(this.bposX, this.bposY, this.velbala, 0));
    }

    mostrarJohn() {
        // Dibuja al boss
        image(johnMayer, this.bposX, this.bposY, 150, 150); // Ajusta el tamaño del boss
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(this.bposX - 55, this.bposY - 85, 110, 30); // Barra de vida
        fill(255, 0, 0);
        rect(this.bposX - 50, this.bposY - 80, bhp1 * 2, 20); // Vida restante
        rectMode(CENTER);
    }
}

//–––––––––––––––––––––––––––––––––JAKE GYLLENHAAL–––––––––––––––––––––––––––––––––
//–––––––––––––variables–––––––––––––
let bhp2 = 100; // boss 2 health points (en general es todo muy similar al boss 1)
function jakeG() {
    if (roomLevel == 3 && roomNumber == 1) {
        return true;
    }
    return false;
}
function jakeVivo() {
    if (0 < bhp2) {
        return true;
    }
    return false;
}
let jake;
let balas2 = []; //lista que guardará las balas del boss 2
//–––––––––––––funciones–––––––––––––
function all2well() {
    //funcion principal que junta todas las clases relacionadas a este boss
    if (jakeG() && jakeVivo()) {
        if (pausa == false) {
            jake.moverJake();
        }
        jake.mostrarJake();
        for (let i = balas2.size() - 1; i >= 0; i--) {
            //para ir mostrando y actualizando la pos de las balas
            let bala2 = balas2.get(i); //define la variable "bala" como el objeto número i en la lista "balas"
            if (pausa == false) {
                bala2.moverBala(); //mueve la bala i
            }
            bala2.showBala(); //presenta la bala i
            if (onScreen(bala2.x, bala2.y, 15) == false) {
                balas2.remove(i); //si sale de los limites, la bala desaparece
            }
            if (
                px - hitbox() < bala2.x &&
                bala2.x < px + hitbox() &&
                py - hitbox() < bala2.y &&
                bala2.y < py + hitbox()
            ) {
                hp -= 1;
                maxHP += 20;
                balas2.remove(i);
            }
        }
    }
    if (jakeG() && jakeVivo() == false) {
        showRed = true;
        if (key1989) {
            image(nKey, 400, 100, size, size);
            if (limite(350, 0, 450, 100, size)) key1989 = false;
        }
        if (masHP2) {
            image(masHP, 400, 700, size, size);
            if (limite(350, 700, 450, 800, size)) {
                masHP2 = false;
                hp += 3;
                maxHP -= 60;
            }
        }
    }
}

class Jake {
    constructor(bposX, bposY) {
        this.bposX = bposX;
        this.bposY = bposY;
        this.velboss = 12;
        this.velbala = -15;
        this.contador = 0;
        this.contador2 = 0;
        this.reset2 = random(15, 30); // define cada cuanto tiempo el boss cambia de dirección
        this.reset = 10; // define el intervalo de tiempo entre balas
        this.mult = int(random(-2, 2)); // define la dirección a la que se dirigirá el boss
        this.size = 100; // Tamaño del boss (ajústalo según sea necesario)
    }

    limites2(x, y) {
        // Evitar colisión con el boss
        if (
            this.bposX - this.size < x &&
            x < this.bposX + this.size &&
            this.bposY - this.size < y &&
            y < this.bposY + this.size
        ) {
            return true;
        }
        return false;
    }

    moverJake() {
        this.bposY += this.velboss;
        if (this.bposY < 100 || this.bposY > height - 100) {
            this.velboss *= -1;
        }

        // Control de disparo
        this.contador++;
        if (this.contador > this.reset) {
            this.disparar();
            this.contador = 0;
        }

        // Cambiar de velocidad y dirección aleatoriamente
        if (this.bposY > 200 && this.bposY < height - 200) {
            this.contador2++;
            if (this.contador2 > this.reset2) {
                if (this.mult == 0) {
                    delay(5); // Se queda más tiempo para darle oportunidad al jugador
                    this.mult = int(random(-2, 2));
                }
                this.reset2 = random(15, 30);
                this.velboss = random(10, 15) * this.mult;
                this.contador2 = 0;
                this.mult = int(random(-2, 2));
            }
        }
    }

    disparar() {
        // Dispara 3 balas en vez de 1
        balas2.push(new Bala(this.bposX, this.bposY, this.velbala, this.velbala));
        balas2.push(new Bala(this.bposX, this.bposY, this.velbala - 2, 0));
        balas2.push(new Bala(this.bposX, this.bposY, this.velbala, -this.velbala));
    }

    mostrarJake() {
        image(jakeGyllenhaal, this.bposX, this.bposY, this.size * 1.5, this.size * 1.5);
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(this.bposX - 55, this.bposY - 85, 110, 30); // Barra de vida
        fill(255, 0, 0);
        rect(this.bposX - 50, this.bposY - 80, bhp2, 20); // Vida restante
        rectMode(CENTER);
    }
}
 //–––––––––––––––––––––––––––––––––SCOOTER BRAUN–––––––––––––––––––––––––––––––––
//–––––––––––––variables–––––––––––––
let bhp3 = 200; // boss 3 health points (también muy similar a los otros bosses
function scooterB() {
    if (roomLevel == 5 && roomNumber == 2) {
        return true;
    }
    return false;
}
function scooterVivo() {
    if (0 < bhp3) {
        return true;
    }
    return false;
}
let scooter;
let balas3 = []; //lista que guardará las balas del boss 3
//–––––––––––––funciones–––––––––––––
function kingOfThieves() {
    //funcion principal que junta todas las clases relacionadas a este boss
    if (scooterB() && scooterVivo()) {
        if (pausa == false) {
            scooter.moverScooterX();
            scooter.moverScooterY();
        }
        scooter.mostrarScooter();
        for (let i = balas3.size() - 1; i >= 0; i--) {
            //para ir mostrando y actualizando la pos de las balas
            let bala3 = balas3.get(i); //define la variable "bala" como el objeto número i en la lista "balas"
            if (pausa == false) {
                bala3.moverBala(); //mueve la bala i
            }
            bala3.showBala(); //presenta la bala
            let limitBala = limitTriang(bala3.x, bala3.y, 50, 300, 400, 0);
            if (
                limiteFinal(bala3.x, bala3.y, 0, 300, 50, 700, size) ||
                limiteFinal(bala3.x, bala3.y, 0, 700, 300, 800, size) ||
                limiteFinal(
                    bala3.x,
                    bala3.y,
                    750,
                    300,
                    800,
                    700,
                    size
                ) ||
                limiteFinal(bala3.x, bala3.y, 500, 700, 800, 800, size)
            ) {
                balas3.remove(i);
            }
            if (onScreen(bala3.x, bala3.y, 15) == false || limitBala < 17.7) {
                balas3.remove(i); //si sale de los limites, la bala desaparece
            }
            if (
                px - hitbox() < bala3.x + 20 &&
                bala3.x - 20 < px + hitbox() &&
                py - hitbox() < bala3.y + 20 &&
                bala3.y - 20 < py + hitbox()
            ) {
                hp -= 2;
                maxHP += 40;
                balas3.remove(i);
            }
        }
    }
    if (scooterB() && scooterVivo() == false) {
        //termina el juego!!
        showRep = true;
        pausa = true;
    }
}
class Scooter {
    constructor(bposX, bposY) {
        this.bposX = bposX;
        this.bposY = bposY;
        this.velbossX = 6;
        this.velbossY = 6;
        this.velbala = -9;
        this.contador = 0;
        this.contador1 = 0;
        this.contador2 = 0;
        this.reset1 = random(20, 40);
        this.reset2 = random(30, 40); // Intervalo para cambiar de dirección
        this.reset = 20; // Intervalo entre balas
        this.multX = int(random(-2, 2)); // Dirección en eje X
        this.multY = int(random(-2, 2)); // Dirección en eje Y
        this.size = 50; // Tamaño del boss
    }

    limites2(x, y) {
        // Evitar colisión con el boss
        if (
            this.bposX - this.size * 2 < x &&
            x < this.bposX + this.size * 2 &&
            this.bposY - this.size * 2 < y &&
            y < this.bposY + this.size * 2
        ) {
            return true;
        }
        return false;
    }

    moverScooterX() {
        this.bposX += this.velbossX;
        if (this.bposX < 100 || this.bposX > width - 100) {
            this.velbossX *= -1;
        }
        this.contador++;
        if (this.contador > this.reset) {
            this.disparar();
            this.contador = 0;
        }

        if (this.bposX > 200 && this.bposX < width - 200) {
            this.contador1++;
            if (this.contador1 > this.reset1) {
                if (this.multX === 0) {
                    this.multY = 0;
                    delay(5); // Se queda más tiempo pegado, permitiendo dispararle
                    this.multX = int(random(-2, 2));
                    this.multY = int(random(-2, 2));
                }
                this.reset1 = random(20, 30);
                this.velbossX = random(5, 8) * this.multX;
                this.contador1 = 0;
                this.multX = int(random(-2, 2));
            }
        }
    }

    moverScooterY() {
        this.bposY += this.velbossY;
        if (this.bposY < 400 || this.bposY > height - 200) {
            this.velbossY *= -1;
        }

        if (this.bposY > 500 && this.bposY < height - 300) {
            this.contador2++;
            if (this.contador2 > this.reset2) {
                if (this.multY === 0) {
                    this.multX = 0;
                }
                this.reset2 = random(30, 40);
                this.velbossY = random(5, 8) * this.multY;
                this.contador2 = 0;
                this.multY = int(random(-2, 2));
            }
        }
    }

    disparar() {
        // Disparar 8 balas
        balas3.push(new Bala(this.bposX, this.bposY, this.velbala, this.velbala));
        balas3.push(new Bala(this.bposX, this.bposY, this.velbala - 1, 0));
        balas3.push(new Bala(this.bposX, this.bposY, this.velbala, -this.velbala));
        balas3.push(new Bala(this.bposX, this.bposY, -this.velbala, -this.velbala));
        balas3.push(new Bala(this.bposX, this.bposY, -this.velbala + 1, 0));
        balas3.push(new Bala(this.bposX, this.bposY, -this.velbala, this.velbala));
        balas3.push(new Bala(this.bposX, this.bposY, 0, this.velbala - 1));
        balas3.push(new Bala(this.bposX, this.bposY, 0, -this.velbala + 1));
    }

    mostrarScooter() {
        image(scooterBraun, this.bposX, this.bposY, this.size * 4, this.size * 4);
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(this.bposX - 55, this.bposY - 85, 110, 30); // Barra de vida
        fill(255, 0, 0);
        rect(this.bposX - 50, this.bposY - 80, bhp3 / 2, 20); // Vida restante
        rectMode(CENTER);
    }
}

let select;
function gameOver() {
    pausa = false; //todo lo que es lo visual
    rectMode(CORNER);
    fill(0);
    rect(0, 0, width, height);
    rectMode(CENTER);
    fill(255);
    rect(width / 2, 590, 250, 100);
    fill(0);
    rect(width / 2, 590, 240, 90);
    textAlign(CENTER);
    fill(255);
    textFont('serif');
    text("GAME", width / 2, 300);
    fill(select);
    textFont('sans-serif');
    text("RESTART", width / 2, 605);
    fill(255, 0, 0);
    textFont('serif');
    text("OVER", width / 2, 460);
    if (280 < mouseX && mouseX < 520 && 545 < mouseY && mouseY < 635) {
        //lo interactivo
        cursor(HAND);
        select = color(255, 0, 0);
        if (mousePressed) {
            startOver();
            setup();
        }
    } else {
        cursor(ARROW);
        select = color(255);
    }
}
function startOver() {
    //resetea el juego
    imagenes();
    cursor(ARROW);
    px = width / 2;
    py = height / 2;
    roomLevel = 1;
    roomNumber = 1;
    pausa = true;
    mostrarBotas = true;
    mostrarGuitarra = true;
    mostrarMejora = true;
    merica = false;
    quick = false;
    masHP1 = true;
    masHP2 = true;
    newRoom = false;
    hp = 13; //health points
    maxHP = 12;
    velShoot = 35;
    damage = 5;
    disparando = false;
    lastShoot = 0; //último disparo
    newShoot = 200; //milisegundos entre disparos
    bhp1 = 50;
    bhp2 = 100;
    bhp3 = 200;
    keySpeaknow = true;
    keyFearless = true;
    keyRed = true;
    key1989 = true;
    keyRep = true;
    showDebut = false;
    showSpeaknow = false;
    showFearless = false;
    showRed = false;
    show1989 = false;
    showRep = false;
}

function preload() {
    lock = loadImage("media/lock.png");
    disco = loadImage("media/disco.png");
    brokenH = loadImage("media/brokenH.png");
    mejora = loadImage("media/notaMega.png");
    nKey = loadImage("media/1989Key.png");
    nTVCover = loadImage("media/1989TV.png");
    botas = loadImage("media/botas.png");
    fearlessKey = loadImage("media/fearlessKey.png");
    fearlessTVC = loadImage("media/FearlessTV.png");
    guitarra = loadImage("media/guitarra.png");
    jakeGyllenhaal = loadImage("media/jakeGyllenhaal.png");
    johnMayer = loadImage("media/johnMayer.png");
    loverC = loadImage("media/Lover.png");
    masHP = loadImage("media/masHP.png");
    notaShoot = loadImage("media/notaShoot.png");
    piso = loadImage("media/piso.png");
    redKey = loadImage("media/redKey.png");
    redTVC = loadImage("media/RedTV.png");
    repKey = loadImage("media/repKey.png");
    repC = loadImage("media/Reputation.png");
    taylorSwift = loadImage("media/rusia.png");
    scooterBraun = loadImage("media/scooterBraun.png");
    speakNowKey = loadImage("media/speaknowKey.png");
    speakNowTVC = loadImage("media/SpeakNowTV.png");
    debutC = loadImage("media/TaylorSwift.png");
  

}
let showDebut = false;
let showSpeaknow = false;
let showFearless = false;
let showRed = false;
let show1989 = false;
let showRep = false;
function mostrarImg() {
    imageMode(CORNER);
    if (showDebut) image(debutC, 10, height - 90, 80, 80);
    if (showSpeaknow) image(speakNowTVC, 100, height - 90, 80, 80);
    if (showFearless) image(fearlessTVC, 190, height - 90, 80, 80);
    if (showRed) image(redTVC, width - 90, height - 90, 80, 80);
    if (show1989) image(nTVCover, width - 180, height - 90, 80, 80);
    if (showRep) image(repC, width - 270, height - 90, 80, 80);
    imageMode(CENTER);
} //mostrar llaves
let keySpeaknow = true;
let keyFearless = true;
let keyRed = true;
let key1989 = true;
let keyRep = true; //–––––––––––––––––––––––––––––––––PRIMER PISO–––––––––––––––––––––––––––––––––
function lover() {
    if (newRoom == false) changeMusica("media/CruelSummer.mp3");
    newRoom = true;
    size = 100;
    permisoRtl = true;
    permisoLtr = false;
    permisoDtu = false;
    permisoUtd = false;
    roomR(color(255, 176, 204), color(201, 91, 134), 1, 1);
}
function pasillo1() {
    newRoom = true;
    size = 100;
    permisoRtl = true;
    permisoLtr = true;
    if (keySpeaknow == true) permisoDtu = false;
    //debe conseguir la llave para poder atravesar
    else permisoDtu = true;
    permisoUtd = false;
    roomC(color(165, 201, 165), color(255, 176, 204), 1, 2); // room(color fondo, color izquierda, color derecha, número de piso, número de habitación)
    newDtu();
    if (permisoDtu == false && newRoom) {
        //muro con candado
        fill(180, 93, 227);
        noStroke();
        rect(400, 50, width, 100);
        image(lock, 400, 50, 80, 80);
        if (limite(0, 0, width, 100, size)) {
            px -= dirX * velActual;
            py -= dirY * velActual;
        }
    }
}
function debut() {
    if (newRoom == false) changeMusica("media/PictureToBurn.mp3");
    newRoom = true;
    size = 100;
    permisoRtl = false;
    permisoLtr = true;
    permisoDtu = false;
    permisoUtd = false;
    roomL(color(165, 201, 165), color(121, 166, 121), 1, 3);
    if (keySpeaknow) {
        image(speakNowKey, 200, 400, size, size);
    }
    if (limite(150, 350, 250, 450, size)) {
        //te da la llave y aparece el power up
        if (keySpeaknow) {
            keySpeaknow = false;
            mostrarGuitarra = true;
        }
    }
    if (mostrarGuitarra && keySpeaknow == false) {
        image(guitarra, 700, 400, size, size);
        if (limite(650, 350, 750, 450, size)) {
            //te da el power up de disparar
            mostrarGuitarra = false;
            merica = true;
            showDebut = true;
        }
    }
} //–––––––––––––––––––––––––––––––––SEGUNDO PISO–––––––––––––––––––––––––––––––––
function speaknow() {
    if (newRoom == false) changeMusica("media/Haunted.mp3");
    newRoom = true;
    size = 100;
    if (johnM() && johnVivo() == false) permisoRtl = true;
    else permisoRtl = false;
    permisoLtr = false;
    permisoDtu = false;
    permisoUtd = false;
    roomR(color(199, 168, 203), color(148, 89, 156), 2, 1);
}
function pasillo2() {
    newRoom = true;
    size = 100;
    if (keyFearless == true) permisoRtl = false;
    else permisoRtl = true;
    permisoLtr = true;
    if (keyRed == true) permisoDtu = false;
    else permisoDtu = true;
    permisoUtd = true;
    roomC(color(239, 193, 128), color(199, 168, 203), 2, 2);
    newUtd();
    newDtu();
    if (permisoRtl == false && newRoom) {
        fill(239, 193, 128);
        noStroke();
        rect(50, 400, 100, 500);
        image(lock, 50, 400, 80, 80);
        if (limite(0, 150, 100, 650, size)) {
            px -= dirX * velActual;
            py -= dirY * velActual;
        }
    }
    if (permisoDtu == false && newRoom) {
        fill(207, 89, 106);
        noStroke();
        rect(400, 50, width, 100);
        image(lock, 400, 50, 80, 80);
        if (limite(0, 0, width, 100, size)) {
            px -= dirX * velActual;
            py -= dirY * velActual;
        }
    }
}
function fearless() {
    if (newRoom == false) changeMusica("media/Fearless.mp3");
    newRoom = true;
    size = 100;
    permisoRtl = false;
    permisoLtr = true;
    permisoDtu = false;
    permisoUtd = false;
    roomL(color(239, 193, 128), color(189, 141, 74), 2, 3);
    if (keyRed) {
        image(redKey, 200, 400, size, size);
    }
    if (limite(150, 350, 250, 450, size)) {
        //te da el power up de disparar
        if (keyRed) {
            keyRed = false;
            mostrarBotas = true;
        }
    }
    if (mostrarBotas && keyRed == false) {
        image(botas, 700, 400, size, size);
        if (limite(650, 350, 750, 450, size)) {
            //te da el power up de disparar
            mostrarBotas = false;
            quick = true;
            showFearless = true;
        }
    }
} //–––––––––––––––––––––––––––––––––TERCER PISO–––––––––––––––––––––––––––––––––
function redts() {
    if (newRoom == false) changeMusica("media/AllTooWell.mp3");
    newRoom = true;
    size = 100;
    if (jakeG() && jakeVivo() == false) permisoRtl = true;
    else permisoRtl = false;
    permisoLtr = false;
    permisoDtu = false;
    permisoUtd = false;
    roomR(color(207, 89, 106), color(122, 46, 57), 3, 1);
}
function pasillo3() {
    newRoom = true;
    size = 100;
    if (key1989 == true) permisoRtl = false;
    else permisoRtl = true;
    permisoLtr = true;
    if (keyRep == true) permisoDtu = false;
    else permisoDtu = true;
    permisoUtd = true;
    roomC(color(181, 229, 248), color(207, 89, 106), 3, 2);
    newUtd();
    newDtu();
    if (permisoRtl == false && newRoom) {
        fill(181, 229, 248);
        noStroke();
        rect(50, 400, 100, 500);
        image(lock, 50, 400, 80, 80);
        if (limite(0, 150, 100, 650, size)) {
            px -= dirX * velActual;
            py -= dirY * velActual;
        }
    }
    if (permisoDtu == false && newRoom) {
        fill(0);
        noStroke();
        rect(400, 50, width, 100);
        image(lock, 400, 50, 80, 80);
        if (limite(0, 0, width, 100, size)) {
            px -= dirX * velActual;
            py -= dirY * velActual;
        }
    }
}
function n1989() {
    if (newRoom == false) changeMusica("media/BadBlood.mp3");
    newRoom = true;
    size = 100;
    permisoRtl = false;
    permisoLtr = true;
    permisoDtu = false;
    permisoUtd = false;
    roomL(color(181, 229, 248), color(106, 163, 186), 3, 3);
    if (keyRep) {
        image(repKey, 200, 400, size, size);
    }
    if (limite(150, 350, 250, 450, size)) {
        //te da el power up de mejora
        if (keyRep) {
            keyRep = false;
            mostrarMejora = true;
        }
    }
    if (mostrarMejora && keyRep == false) {
        image(mejora, 700, 400, size, size);
        if (limite(650, 350, 750, 450, size)) {
            //te da el power up de mejora
            mostrarMejora = false;
            notaShoot = mejora;
            damage = 10;
            show1989 = true;
            velShoot = 25;
        }
    }
} //–––––––––––––––––––––––––––––––––CUARTO PISO–––––––––––––––––––––––––––––––––
function pasillo4() {
    newRoom = true;
    size = 100;
    permisoRtl = false;
    permisoLtr = false;
    permisoDtu = true;
    permisoUtd = true;
    roomC1(color(255), 4, 2);
    noStroke();
    fill(0);
    rect(400, 200, 800, 400);
    stroke(255);
    line(300, 0, 500, 0);
    newUtd();
    if (300 < px && px < 500) newDtu();
} //–––––––––––––––––––––––––––––––––QUINTO PISO–––––––––––––––––––––––––––––––––
function reputation() {
    if (newRoom == false) changeMusica("media/ReadyForIt.mp3");
    newRoom = true;
    size = 40;
    permisoRtl = false;
    permisoLtr = false;
    permisoDtu = false;
    if (scooterB() && scooterVivo() == false) permisoUtd = true;
    else permisoUtd = false;
    roomC1(color(0), 5, 2);
    noStroke();
    fill(6, 0, 89);
    rect(400, 400, width, height);
    rectMode(CORNER);
    fill(93, 118, 128);
    rect(50, 700, 300, 100);
    fill(99, 43, 51);
    rect(450, 700, 300, 100);
    rectMode(CENTER);
    fill(0);
    triangle(50, 300, 400, 0, 750, 300);
    rect(400, 500, 700, 400);
    rect(400, 750, 200, 100);
    let distTriang1 = limitTriang(px, py, 50, 300, 400, 0);
    let distTriang2 = limitTriang(px, py, 400, 0, 750, 300);
    newUtd();
    if (
        limite(0, 300, 50, 700, size) ||
        limite(0, 700, 300, 800, size) ||
        limite(750, 300, 800, 700, size) ||
        limite(500, 700, 800, 800, size)
    )
        px -= dirX * velActual;
    if (
        limite(0, 700, 300, 800, size) ||
        limite(500, 700, 800, 800, size)
    )
        py -= dirY * velActual;
    if (distTriang1 < 17.7 || distTriang2 < 17.7) {
        px -= dirX * velActual;
        py -= dirY * velActual;
    }
}
let dirX = 0;
let dirY = 0;
let lastDirX;
let lastDirY;
function keyPressed() {
    if (key == "w" || key == "W") {
        dirY = -1;
        lastDirY = -1;
        lastDirX = 0;
    }
    if (key == "a" || key == "A") {
        dirX = -1;
        lastDirX = -1;
        lastDirY = 0;
    }
    if (key == "s" || key == "S") {
        dirY = 1;
        lastDirY = 1;
        lastDirX = 0;
    }
    if (key == "d" || key == "D") {
        dirX = 1;
        lastDirX = 1;
        lastDirY = 0;
    }
    if (key == " " && merica) {
        disparando = true;
    }
    if (key == CODED) {
        if (keyCode == SHIFT && quick) {
            //corres con shift
            velActual = 2 * vel();
        }
        if (keyCode == CONTROL && deathScreen() == false) {
            pausa = true;
        }
    }
}
function keyReleased() {
    if (key == "w" || key == "W" || key == "s" || key == "S") {
        dirY = 0;
    }
    if (key == "a" || key == "A" || key == "d" || key == "D") {
        dirX = 0;
    }
    if (key == CODED) {
        //dejas de correr al soltarlo
        if (keyCode == SHIFT && quick) {
            velActual = vel();
        }
    }
    if (key == " " && merica) {
        disparando = false;
    }
}
function wasd() {
    px += dirX * velActual;
    py += dirY * velActual;
    px = constrain(px, size / 2, width - size / 2); //no puede salir de los bordes
    py = constrain(py, size / 2, height - size / 2);
    if (john.limites2(px, py) && johnM() && johnVivo()) {
        //si choca con los bosses, pierde vida
        px = john.bposX - 200;
        hp -= 1;
        maxHP += 20;
    }
    if (jake.limites2(px, py) && jakeG() && jakeVivo()) {
        px = jake.bposX - 200;
        hp -= 1;
        maxHP += 20;
    }
    if (scooter.limites2(px, py) && scooterB() && scooterVivo()) {
        px = 400;
        py = 650;
        hp -= 2;
        maxHP += 20;
    }
} //uso de chat gpt:
function limitTriang(px, py, x1, y1, x2, y2) {
    //limite con el techo
    let diagonal = sq(x2 - x1) + sq(y2 - y1); //formula matemática para encontrar la diagonal del triángulo
    //encontrar el punto sobre la línea más cercano para no pasarlo.
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / diagonal;
    t = constrain(t, 0, 1); //coordenadas del punto proyectado sobre la línea
    let proyX = x1 + t * (x2 - x1);
    let proyY = y1 + t * (y2 - y1); //devuelve la distancia entre el punto y su proyección
    return dist(px, py, proyX, proyY);
}
function newRtl() {
    //permiten cambiar de habitaciones
    let npx = px;
    let npy = py;
    if (openRtl(npx, npy)) {
        px = width - dist1;
        roomNumber += 1;
        newRoom = false;
    }
}
function newLtr() {
    let npx = px;
    let npy = py;
    if (openLtr(npx, npy)) {
        px = dist1;
        roomNumber -= 1;
        newRoom = false;
    }
}
function newDtu() {
    let npy = py;
    if (openDtu(npy)) {
        roomLevel += 1;
        py = height - dist1;
        newRoom = false;
        if (roomLevel == 5) velActual = vel();
    }
}
function newUtd() {
    let npy = py;
    if (openUtd(npy)) {
        roomLevel -= 1;
        py = dist1;
        newRoom = false;
        if (roomLevel == 4) velActual = vel();
    }
}
let seleccion1, seleccion2;
function escape() {
    //detiene lo que está ocurriendo en el juego
    rectMode(CENTER);
    textAlign(CENTER);
    fill(0, 200);
    rect(width / 2, height / 2, 400, 200);
    if (scooterB() && scooterVivo() == false) {
        //ganas
        textFont('sans-serif');
        fill(255);
        text("You win!", width / 2, height / 2);
    } else {
        textFont('sans-serif');
        fill(seleccion1);
        text("Resume", width / 2, 375);
        fill(seleccion2);
        text("Quit to title", width / 2, 450);
        if (310 < mouseX && mouseX < 495 && 340 < mouseY && mouseY < 375) {
            //reanudas el juego
            cursor(HAND);
            seleccion1 = era;
            if (mousePressed) {
                pausa = false;
            }
        } else if (
            260 < mouseX &&
            mouseX < 535 &&
            415 < mouseY &&
            mouseY < 450
        ) {
            //vuelves a comenzar
            cursor(HAND);
            seleccion2 = era;
            if (mousePressed) {
                comenzar = false;
                startOver();
            }
        } else {
            cursor(ARROW);
            seleccion1 = color(255);
            seleccion2 = color(255);
        }
    }
}
function showRoom() {
    if (roomLevel == 1) {
        if (roomNumber == 1) {
            lover();
        }
        if (roomNumber == 2) {
            pasillo1();
        }
        if (roomNumber == 3) {
            debut();
        }
    }
    if (roomLevel == 2) {
        if (roomNumber == 1) {
            speaknow();
        }
        if (roomNumber == 2) {
            pasillo2();
        }
        if (roomNumber == 3) {
            fearless();
        }
    }
    if (roomLevel == 3) {
        if (roomNumber == 1) {
            redts();
        }
        if (roomNumber == 2) {
            pasillo3();
        }
        if (roomNumber == 3) {
            n1989();
        }
    }
    if (roomLevel == 4) {
        pasillo4();
    }
    if (roomLevel == 5) {
        reputation();
    }
}

function setup() {
  preload();
    john = new John(700, 400); //posición inicial del boss
    jake = new Jake(700, 400);
    scooter = new Scooter(400, 400);
    createCanvas(800, 800);
    strokeWeight(50);
    strokeCap(SQUARE);
    px = width / 2;
    py = height / 2;
    imageMode(CENTER);
    rectMode(CENTER);
    velActual = vel();
    dist1 = 70;
    if (estaSonando != null) estaSonando.play(); 
  
}
function draw() {
  if (comenzar == false) startGame();
    else {
        showRoom();
        hp = constrain(hp, 0, 13);
        maxHP = constrain(maxHP, 12, 280);
        wasd();
        background(era);
        showRoom();
        image(taylorSwift, px, py, size, size);
        hpTaylor();
        all2well();
        dearjohn();
        kingOfThieves();
        newRtl();
        newLtr();
        asesinar();
        mostrarImg();
        if (pausa) {
            escape();
        }
        if (deathScreen()) {
            gameOver();
        }
    }
}