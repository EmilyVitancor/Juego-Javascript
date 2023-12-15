const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        
    }

};

const game = new Phaser.Game(config);

let sky;
let player;
let cursors;
let platforms;
let pincho;
var gameOver=false;
var Banderas=0;
var BanderasText;






function preload() {
    this.load.image('sky', '../img/fondo.png');
    this.load.image('ground', '../img/tierra1.png');
    this.load.spritesheet('ricardo', '../img/ricardo.png', { frameWidth: 54.7, frameHeight: 57 });
    this.load.spritesheet('saltoI','../img/salto izquierda.png',{frameWidth:86,frameHeight:60 })
    this.load.spritesheet('saltoD','../img/salto derecha.png',{frameWidth:89 ,frameHeight:60 })
    this.load.image('tierraC', '../img/tierra chiquita.png');
    this.load.image('bolapincho', '../img/bolapincho.png');
    this.load.image('bandera','../img/bandera.png')
    this.load.audio('Audio Gloomy Manor', '../audio/Audio Gloomy Manor.mp3');
    this.load.image('ricardoDead','../img/ricardo dead.png')
    
}


function create() {
    
    sky = this.add.tileSprite(0, 0, config.width, config.height, 'sky');
    sky.setOrigin(0, 0);

    
    platforms = this.physics.add.staticGroup();
    platforms.create(150, 550, 'ground').setScale(1).refreshBody();
    platforms.create(550, 550, 'ground').setScale(1).refreshBody();
    platforms.create(950, 550, 'ground').setScale(1).refreshBody();
    platforms.create(50, 110, 'tierraC').setScale(1).refreshBody();
    platforms.create(1050, 110, 'tierraC').setScale(1).refreshBody();
    platforms.create(550, 380, 'tierraC').setScale(1).refreshBody();

     
    player = this.physics.add.sprite(100, 450, 'ricardo');
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);

    this.physics.add.collider(player, platforms);


    obstacleGroup = this.physics.add.group();

    
    

    this.anims.create({

        key:'left',
        frames:this.anims.generateFrameNumbers('ricardo',{start:0,end:3}),
        frameRate:10,
        repeat:-1
     });
     
      this.anims.create({
        key:'turn',
        frames:[{key:'ricardo', frame:5}],
        frameRate:20
    
    
        });
    
        this.anims.create({
    
            key:'right',
            frames:this.anims.generateFrameNumbers('ricardo',{start:5,end:8}),
            frameRate:10,
            repeat:-1
        });
    
        
        this.anims.create({
    
            key:'Jumpleft',
            frames:this.anims.generateFrameNumbers('saltoI',{start:1,end:2}),
            frameRate:4,
            repeat:-1
        });
    
        
        this.anims.create({
    
            key:'Jumpright',
            frames:this.anims.generateFrameNumbers('saltoD',{start:0,end:1}),
            frameRate:4,
            repeat:-1
        });
       
        
        this.anims.create({
            key:'ricardoDead',
            frames:[{key:'ricardo', frame:0}],
            frameRate:20
        
        
        });
        bandera= this.physics.add.group({

        key:'bandera',
        repeat:1,
        setXY:{x:120,y:0,stepX:800}

     });

        bandera.children.iterate(function(child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));

        })
     
        this.physics.add.collider(bandera,platforms);
        this.physics.add.overlap(player,bandera,collectBandera,null,true);
     
        BanderasText=this.add.text(16,16,'BANDERAS: 0',{fontSize:'32px',fill: '#000'});

        bombapincho = this.physics.add.group();
        this.physics.add.collider(bombapincho,platforms);

        this.physics.add.collider(player,bombapincho,hitBomba,null,true);
        

     cursors = this.input.keyboard.createCursorKeys();

     var audio = this.sound.add('Audio Gloomy Manor');
     audio.play();

    
      
}





function update() {


    if(gameOver){
        return

    }
    
    if (cursors.left.isDown) {
        
        player.setVelocityX(-160);

        if(player.body.touching.down){
        player.anims.play('left', true);
        

        }else{
            player.anims.play('Jumpleft',true);
      
        }
    
    } else if (cursors.right.isDown) {
        
        player.setVelocityX(160);
        if(player.body.touching.down){
            player.anims.play('right',true);
        
        }else{
            player.anims.play('Jumpright',true);
        }
        
        
    } else {
        player.setVelocityX(0);
        
        if(player.body.touching.down){
            player.anims.play('turn',true);
        }
        
    
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);

    }


   
    const scrollSpeed = 1;
    sky.tilePositionX += scrollSpeed;

}

function collectBandera(player,Bandera){

    Bandera.disableBody(true,true);
    Banderas+=1;
    BanderasText.setText('BANDERAS: '+Banderas);

    if(bandera.countActive(true)===0){

        bandera.children.iterate(function(child){
            child.enableBody(true,child.x,0,true,true)


        });
       
        var x = (player.x<400) ? Phaser.Math.Between(400,800): Phaser.Math.Between(0,400);
        var bombapinchos= bombapincho.create(x,16,'bolapincho');
     
        bombapinchos.setBounce(1);
        bombapinchos.setCollideWorldBounds(true);
        bombapinchos.setVelocity(Phaser.Math.Between(-200,200),20);
    }
   
}





function hitBomba(player,bombapinchos){

    this.physics.pause();
   
    player.setTint(0xf0000);

    player.anims.play('ricardoDead');

    gameOver=true;


}

 












