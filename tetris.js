// Initialistion des variables pricipales
const largeurGrille = 14;
const hauteurGrille = 28;
let grilleGame;
const carreau = 20;	// Taille en pixels d'une case de la grille
let canvas = document.getElementById("mainViewGame");
let ctx = canvas.getContext("2d");
//init next canvas
let canvasNext = document.getElementById('nextForme');
let ctxNext = canvasNext.getContext("2d");
// Position de la forme sur le canvas
const XInitial = 5;
const YInitial = 0;
var formX = XInitial;
var formY = YInitial;
//Timing intervall
let timeInterval;
let delay = 500
//intialisation des element html
let startButton = document.getElementById("startButton");
let versionButton = document.getElementById('versionButton')
let versionGraphique = "matrix"	
// Tableau de définition des formes
let forme = new Array();
let gameVal = {
    score :0,
    level :0
}

// attribution du temps en fonction du level
const niveau = {
    0: 800,
    1: 720,
    2: 630,
    3: 550,
    4: 470,
    5: 380,
    6: 300,
    7: 220,
    8: 130,
    9: 100,
    10: 80,
    11: 80,
    12: 80,
    13: 70,
    14: 70,
    15: 70,
    16: 50,
    17: 50,
    18: 50,
    19: 30,
    20: 30,
    // 29+ is 20ms
  }
  Object.freeze(niveau); //bloqué l'objet level ce qui fait qu'on restera figer à 29 si on depasse
  //création de l'objet points
  const points = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
    }
  Object.freeze(points); //et le figer 
  
forme[0]= [
    [	// rotation 0
        [0,0,0,0],
        [1,1,1,0],
        [0,0,1,0],
        [0,0,0,0]
    ],
    [	// rotation 1
        [0,1,0,0],
        [0,1,0,0],
        [1,1,0,0],
        [0,0,0,0]
    ],
    [	// rotation 2
        [0,0,0,0],
        [1,0,0,0],
        [1,1,1,0],
        [0,0,0,0]
    ],
    [	// rotation 3
        [0,1,1,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
    ]
]; 

forme[1] = [
    [	// rotation 0 (cette forme là n'a besoin que de 2 rotations)
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0]
    ],
    [	// rotation 1
        [0,1,0,0],
        [0,1,1,0],
        [0,0,1,0],
        [0,0,0,0]
    ]        
];

forme[2] = [
    [	// rotation 0 (cette forme là n'a besoin que de 2 rotations)
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ],
    [	// rotation 1
        [0,1,0,0],
        [1,1,0,0],
        [1,0,0,0],
        [0,0,0,0]
    ]        
];

forme[3]= [
    [	// rotation 0
        [0,0,0,0],
        [0,1,0,0],
        [1,1,1,0],
        [0,0,0,0]
    ],
    [	// rotation 1
        [0,1,0,0],
        [0,1,1,0],
        [0,1,0,0],
        [0,0,0,0]
    ],
    [	// rotation 2
        [0,0,0,0],
        [1,1,1,0],
        [0,1,0,0],
        [0,0,0,0]
    ],
    [	// rotation 3
        [0,1,0,0],
        [1,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
    ]
]; 

forme[4]= [
    [	// rotation 0
        [0,0,0,0,0],
        [0,0,0,0,0],
        [1,1,1,1,0],
        [0,0,0,0,0]
    ],
    [	// rotation 1
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0]
    ]
]; 
forme[5]= [
    [	// rotation 0
        [0,0,0],
        [1,1,0],
        [1,1,0],
        [0,0,0]
    ]
]; 
//faire le tableau des couleurs des formes
let couleursForme = new Array;
couleursForme[0] = ["red","blue"]
couleursForme[1] = ["yellow","purple"]
couleursForme[2] = ["blueviolet","brown"]
couleursForme[3] = ["chocolate","crimson"]
couleursForme[4] = ["darkblue","darkorange"]
couleursForme[5] = ["green","deeppink"]
// initialisation aléatoire de la forme qui vient et la rotation numero 1
let nextForme = Math.floor(Math.random()*forme.length);
let numForme = Math.floor(Math.random()*forme.length);
let rotation = 0;
let oldRotation = rotation;


// lors de l'initialistion de la fenetre aller à la fonction init ()
window.onload = init ();

//Gestion des touches claviers
document.onkeydown = function(e) {
    let key = e.key
    switch (key){
        case "ArrowUp":
            rotationForm();            
            break;
        
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "a": //cheatcode pour Amadou !!!!!
            numForme ++;
            if (numForme> forme.length-1) numForme = 0;
            if (rotation > forme[numForme].length-1) rotation = 0
            actualisationCanvas();
            break;
        case "z":
            moveUp();
            break;
    }
    }

//verifier si il y a des lignes
function linesCheck () {
    let lines = 0
    //boucle pour verifier chaque ligne
    grilleGame.forEach ((row,y)=>{
        //boucle qui verifier que chaque valeur dans une ligne est pllus grande que ZERO
        if(row.every(valeur => valeur>0)){
            lines++
            //enlevé la ligne dans la ligne du tableau
            grilleGame.splice(y,1); 
            //la remplacer par une autre ligne en haut remplie de zéro
            grilleGame.unshift(Array(largeurGrille).fill("")) 
            scoreLevel(lines);
        }

    });
}
//actualisation du score et du level
function scoreLevel (ligne){
    gameVal.score += points[ligne];
    gameVal.level+=1
    delay=niveau[gameVal.level]
}

//gameover
function gameOver(){
     
        delay=0
        ctx.font = "36px Matrix";
        ctx.fillText("GAME OVER", 2*carreau-10, 14*carreau+10);
    
}
//lancer l'intervall de temps 
startButton.addEventListener("click", () => {
    if(timeInterval) {
            clearInterval(timeInterval);
            timeInterval=null;
            startButton.innerText = 'Start Game';
    }else {
        timeInterval = setInterval(moveDown,delay);
        startButton.innerText = 'Pause Game';
    }
})
//changement de version graphique
versionButton.addEventListener("click",()=>{
if (versionGraphique === "matrix") {
    versionGraphique = "std"
    versionButton.innerText="Matrix Mode"
    ctx.clearRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
    actualisationCanvas();
}else { 
    versionGraphique = "matrix"
    versionButton.innerHTML = "Old Mode"
    ctx.clearRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
    actualisationCanvas();
}
    
})

function init ()
{
    canvas.height = (hauteurGrille) * carreau;
    canvas.width = largeurGrille*carreau;
    canvas.style.border = "3px solid red";
    var myFont = new FontFace('myFont', 'url(/Font/Matrix.ttf)');
                    myFont.load().then(function(font){
                        document.fonts.add(font);
                        console.log('Font loaded');
                        ctx.font = "12px myFont"; // set font
                      }) 
    //init du ctx pour la prochaine forme
    canvasNext.height = 8*carreau;
    canvasNext.width=8*carreau
    //canvasNext.style.border = "3px solid red";
    initGrille();
    actualisationCanvas();
    
                      
}
//Dessin de la prochaine forme
function initNextForme(){
    
    //aléatoire de la prochaine forme
    nextForme = Math.floor(Math.random()*forme.length);
    //dessiner le prochaine forme
    
}

// dessin next form
function dessinNextForm (){
    forme[nextForme][0].forEach((col,x) => {
        forme[nextForme][0][x].forEach((valeur,y)=>{
            if (valeur===1){
                if (versionGraphique==="matrix"){
                  ctxNext.fillStyle ="green";
                  ctxNext.font = "Matrix";
                  ctxNext.fillText(valeur, (~~y+3)*carreau-10, (~~x+3)*carreau+10);
                  
                } else {
                    //dessiner le rectangle
                    ctxNext.fillStyle = couleursForme[numForme][0];
                    ctxNext.fillRect((3 + ~~y)*carreau, (3+~~x)*carreau,carreau,carreau);
                    //Dessiner les bordures
                    ctxNext.fillStyle = couleursForme[numForme][1];
                    ctxNext.fillRect((3 + ~~y)*carreau + 1, (3+~~x)*carreau + 1,carreau - 2,carreau - 2);
               
                }
            }
        });
    });
    ctxNext.font = "16px Matrix";
    ctxNext.fillText("Score : "+gameVal.score, carreau-10, carreau+10);
    ctxNext.fillText("Level : "+gameVal.level, carreau-10, 2*carreau+10);
    ctxNext.fillText("Delat : "+delay, carreau-10, 3*carreau+10);
}
//nettoyage du CTX de nextform avant nouveau dessin
function nextFormeClean() {
          
        ctxNext.clearRect(0,0,8 * carreau, 8 * carreau);
    
}
// initialisation du tableau à deux dimension du board

function initGrille()
{

grilleGame = Array.from({ length: hauteurGrille+1 }, () => Array(largeurGrille).fill(""));

}

function collisionDetect (dx,dy){
    ;
    return forme[numForme][rotation].every((col,index1) => {
       return forme[numForme][rotation][index1].every((valeur,index2)=>{
            //recherche du 1 dans la forme actuelle
            x = dx+formX+~~index2;
            y = dy+formY+~~index1;
            ///quand la valeur est egal à 1 on effectue les testes de collision
            // sinon pas la peine
            if (valeur ==1) { 
            return ((murInterne(x) && limiteBasse(y) && caseVide(x,y)))
            } else {
                return true;
            }
        });
    });
    
   

}
function murInterne (x){
    return x >= 0 && x < largeurGrille;
}
function limiteBasse(y){
    return y <= hauteurGrille;
}
function caseVide(x,y){
    return grilleGame[y][x]==="";
}
//création de la nouvelle forme et fixation de la forme en bas
function nouvelleForm (){
    
figerForm();
formX = XInitial;
formY = YInitial;
rotation = 0;
numForme = nextForme
if (!collisionDetect(0,1)) {
    let i = collisionDetect(0,1)
    gameOver();
} else {


initNextForme();
actualisationCanvas();
}
}
//figer la forme à sa place et la faire entrer réelement dans le tableau du board quand la forme 
// fais un collision en mouvement vers le bas
function figerForm(){
    forme[numForme][rotation].forEach((col,index1) => {
        forme[numForme][rotation][index1].forEach((valeur,index2)=>{
            if (valeur===1){
                grilleGame[index1+formY][index2+formX]=numForme+1;
            }
        });
    });
}
function actualisationGrille(){
    
    //dessiner la grille sur le Canvas
    for (i in grilleGame) {
        for (n in grilleGame[i]){
        if (versionGraphique === 'matrix'&& grilleGame[i][n]!=0) {
            let testets = Math.floor(Math.random()*10)
            ctx.fillText(testets, (~~n)*carreau, (~~i)*carreau);
        
        } else if (grilleGame[i][n]!="") {
            //dessiner le rectangle
            ctx.fillStyle = couleursForme[grilleGame[i][n]-1][0];
            ctx.fillRect((~~n)*carreau, (~~i-1)*carreau,carreau,carreau);
            //Dessiner les bordures
            ctx.fillStyle = couleursForme[grilleGame[i][n]-1][1];
            ctx.fillRect((~~n)*carreau + 1, (~~i-1)*carreau + 1,carreau - 2,carreau - 2);
            
        }
        }
    }   
    
    }

function actualisationCanvas ()
{
    linesCheck();
    ctx.save();
    if (versionGraphique=='matrix') {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
    } else {
        ctx.clearRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
    }
    
    dessinerForme(grilleGame);
    actualisationGrille();
    nextFormeClean()
    dessinNextForm();
    ctx.restore();
}

                  

//dessiner la form actuelles
function dessinerForme(grilleArray) {

    forme[numForme][rotation].forEach((col,index1) => {
        forme[numForme][rotation][index1].forEach((valeur,index2)=>{
            if (valeur===1){
                if(versionGraphique==='matrix'){
                    
                  ctx.fillStyle ="green";
                  let testets = Math.floor(Math.random()*10)
                  
                  ctx.font = "Matrix";
                  ctx.fillText(testets, (~~index2+formX)*carreau, (formY+~~index1)*carreau);
                } else{
                //dessiner le rectangle
                ctx.fillStyle = couleursForme[numForme][0];
                ctx.fillRect((formX + ~~index2)*carreau, (formY+~~index1-1)*carreau,carreau,carreau);
                //Dessiner les bordures
                ctx.fillStyle = couleursForme[numForme][1];
                ctx.fillRect((formX + ~~index2)*carreau + 1, (formY+~~index1-1)*carreau + 1,carreau - 2,carreau - 2);
                
                }
            }
        });
    });
}
//faire descendre la forme active
function moveDown (){
    if (!collisionDetect(0,1)){ //si une collision avec la bordure
        nouvelleForm(); //fixer l'ancienne form et créer une nouvelle
       
    }else { // Si il n'y a aucune collision detéctés 
        formY++;
        actualisationCanvas();
  }
}
function moveUp (){
   
    if (collisionDetect(0,-1)){
        formY --;
        actualisationCanvas();
    }
}
function moveLeft (){
    // formX --;
    if (collisionDetect(-1,0)){
        formX--;
        actualisationCanvas();
    }
}
function moveRight (){
    
    if (collisionDetect(1,0)){
        formX ++;;
        actualisationCanvas();
    }
}
function rotationForm(){
    oldRotation = rotation;
    rotation++;
    //si on arrive à la fin des rotation on revient à l'index zero dans le tableau
    if (rotation > forme[numForme].length-1) rotation = 0;
    //detection de la collision si il y'a une rotation
    if (!collisionDetect(0,0)){
            rotation = oldRotation; 
           } else {
            actualisationCanvas();
         }   
     
}