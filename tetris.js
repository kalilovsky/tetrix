// Initialistion des variables pricipales
const largeurGrille = 14;
const hauteurGrille = 28;
let grilleGame;
const carreau = 20;	// Taille en pixels d'une case de la grille
let canvas = document.getElementById("mainViewGame");
let ctx = canvas.getContext("2d") ;
// Position de la forme sur le canvas
const XInitial = 5;
const YInitial = 0;
var formX = XInitial;
var formY = YInitial;
//Timing intervall
let timeInterval;
//intialisation des element html
let startButton = document.getElementById("startButton");
let versionButton = document.getElementById('versionButton')
let versionGraphique = "matrix"	
// Tableau de définition des formes
let forme = new Array();


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
        [0,0,0],
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

//lancer l'intervall de temps 
startButton.addEventListener("click", () => {
    if(timeInterval) {
            clearInterval(timeInterval);
            timeInterval=null;
            startButton.innerText = 'Start Game';
    }else {
        timeInterval = setInterval(moveDown,500);
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
    var myFont = new FontFace('myFont', 'url(./Font/Matrix.ttf)');
                    myFont.load().then(function(font){
                        document.fonts.add(font);
                        console.log('Font loaded');
                        ctx.font = "12px myFont"; // set font
                      })
    initGrille();
    actualisationCanvas();
   
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
numForme = Math.floor(Math.random()*forme.length);
actualisationCanvas();
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
    ctx.save();
    if (versionGraphique=='matrix') {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
    } else {
        ctx.clearRect(0,0,largeurGrille * carreau, hauteurGrille * carreau);
    }
    
    dessinerForme(grilleGame);
    actualisationGrille();
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