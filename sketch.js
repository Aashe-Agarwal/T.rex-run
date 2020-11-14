var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bg,bgimg,trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,gameOver,restart,gameoverimg,restartImg,checkpoint,jump,collided;

localStorage["HighestScore"] =0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud-1.png");
  
  bgimg = loadImage("backgroundImg.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverimg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  checkpoint = loadSound("checkpoint.mpeg");
  jump = loadSound("jump.wav");
  collided = loadSound("collided.wav");
  
}

function setup() {
  createCanvas(600, 200);
  
  bg=createSprite(300,100,);
  bg.addImage("background",bgimg);
  bg.scale=5;
   
  ground=createSprite(200,265,400,20);
  ground.addImage("ground",groundImage)
  
  //creates our T rex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  //creates the ground
  ground.x = ground.width /2;
  ground.y=265
  
  //creates the floor on which the T rex is standing
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
   
  //game over text
  gameOver=createSprite(300,90,200,100);
  gameOver.addImage("game over",gameoverimg);
  gameOver.scale=0.7;
  
  //restart icon
  restart=createSprite(300,130,20,20);
  restart.addImage("restart",restartImg);
  restart.scale=0.5;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  //trex.debug=true;
  trex.setCollider("circle",0,0,40);
  
  score = 0;
}

function draw() {
  background(180);
  
  //displaying score
  
  
if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+score/100 );
  
  trex.changeAnimation("running", trex_running);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //infinite ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 161) {
        trex.velocityY = -13;
        jump.play(); 
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
  
    if(score%100===0&&score>0){
      checkpoint.play();   
    }
    
    //changing game state to end
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        collided.play();
    }
    //to make the instruction invisible
    gameOver.visible=false;
    restart.visible=false;
  }
else if (gameState === END) {
     // stops moving the ground 
     ground.velocityX = 0;
  
     
     //stops obstacles and clouds 
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     trex.changeAnimation("collided", trex_collided);
     
  
     //shows the instruction
     gameOver.visible=true;
     restart.visible=true;
     trex.velocityY=0;
     
     //turns restart into an icon
     if (mousePressedOver(restart)){
       reset();
  }
     
} 
  var high = localStorage["HighestScore"];
  stroke("black")
  strokeWeight(2);
  text("H I : " + high , 200,50);
   //stop trex from falling down
   trex.collide(invisibleGround);
  
   drawSprites();
   text("Score: "+ score, 500,50);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset(){
  
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  score =0;
  
}
