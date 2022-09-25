//Assigning all the necessary global variables.
var path, gazelle;
var badguy1, badguy2, badguy3;
var pathImg, gazelleRunning, gazelleCollided;

var badguyLionImg, badguyTigerImg, badguyHunterImg;
var gameOverImg, restartImg;

var lionCG, tigerCG, hunterCG;

var END =0;
var PLAY =1;
var gameState = PLAY;

var distance;
var gameOver, restart;
var obstaclesGroup;

var edges;

function preload(){
//Loading all the necessary animations and images.
    pathImg = loadImage("Road.png");
    gazelleRunning = loadAnimation("gazellestanding.png","gazellerunning.png");
    gazelleCollided = loadAnimation("gazelledead.png");

    badguyLionImg = loadImage("badguy-lion.png");
    badguyTigerImg = loadImage("badguy-tiger.png");
    badguyHunterImg = loadImage("badguy-hunter.png");

    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");

}

function setup(){
    background("white")
//Creating the overall screen.
    createCanvas(windowWidth,windowHeight);
//Creating the moving road.
    path=createSprite(windowWidth-200,windowHeight/2);
    path.addImage(pathImg);
    path.velocityX = 5;
    path.scale = 0.5;

//Creating the runaway gazelle.
    gazelle = createSprite(windowWidth/1.175,160,50,50);
    gazelle.addAnimation("gazel",gazelleRunning);
    gazelle.scale=0.375;

//Setting the collider for the gazelle.
    gazelle.setCollider("rectangle",0,0,330,265);
    //gazelle.debug = true;
//Creating the gameover image
    gameOver = createSprite(windowWidth/3,185,50,50);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.8;
    
//Creating the restart button
    restart = createSprite(windowWidth/3,285,50,50);
    restart.addImage(restartImg);
    restart.scale = 0.8;

//Creating the group for the obstacles.
    obstaclesGroup = createGroup();

//Setting the distance as 0.
    distance = 0;

}

function draw(){
//Displaying the distance.
    text("Distance: "+ distance, (windowWidth/1.5)-25, 50);

//Assigning the game properties of the particular gamestate when it is in that gamestate.
if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    //Setting difficulty.
    path.velocityX = -(4 + 0.75* distance/100);
    //Scoring.
    distance = distance + Math.round(getFrameRate()/60);
    //Making the road infinite.
    if(path.x > windowWidth){
        path.x = width /2;
    }
    //Setting the controls for the gazelle.
    gazelle.y = World.mouseY;
    //Creating the edges.
    edges= createEdgeSprites();
    gazelle.collide(edges);
    //Spawning the obstacles on the road.
    spawnObstacles();

    if(obstaclesGroup.isTouching(gazelle)){
        gameState = END;
    }
}
else if(gameState === END){

    gameOver.visible = true;
    restart.visible = true;

    //Killing the gazelle.
    gazelle.changeAnimation("Collided", gazelleCollided);

    //Stopping the movement.
    path.velocityX = 0;

    //Setting the lifetime of the game obstacles so that they are never destroyed.
    obstaclesGroup.setLifetimeEach(-1);
    //Stopping the movement of the obstacles.
    obstaclesGroup.setVelocityXEach(0);
}

if(mousePressedOver(restart)) {
    reset();
  }

    drawSprites();
}

function reset(){
  gameState=PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  gazelle.changeAnimation("gazel",gazelleRunning);
}

function spawnObstacles(){
    if (frameCount % 60 === 0){
        var obstacle = createSprite(windowWidth,165,10,40);
        obstacle.velocityX = -(6 + distance/100);
        
         //Generating the random obstacles.
         var rand = Math.round(random(1,3));
         switch(rand) {
           case 1: obstacle.addImage(obstacle1);
                   break;
           case 2: obstacle.addImage(obstacle2);
                   break;
           case 3: obstacle.addImage(obstacle3);
                   break;
           default: break;
        }
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 500;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
}