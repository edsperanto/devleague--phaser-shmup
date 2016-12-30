(Phaser => {
 	const GAME_WIDTH = 460;
 	const GAME_HEIGHT = 600;
 	const GAME_CONTAINER_ID = 'game';
 	const GFX = 'gfx';
 	const INITIAL_MOVESPEED = 4;

 	let player;
 	let cursors;

 	const preload = _ => {
 		game.load.spritesheet(GFX, 'assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
 	};

 	const handlePlayerFire = _ => {
 		console.log('fire');
 		playerBullets.add( game.add.sprite(player.x, player.y, GFX, 7));
 	}

 	const create = _ => {
 		cursors = game.input.keyboard.createCursorKeys();
 		cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
 		cursors.fire.onUp.add( handlePlayerFire );
 		//				      x---v    v---y    v------ 8th cell
 		player = game.add.sprite(100, 100, GFX, 8);
 		player.moveSpeed = INITIAL_MOVESPEED;
 		playerBullets = game.add.group();
 	};

 	const handlePlayerMovement = _ => {
 		let movingH = Math.sqrt(2);
	    let movingV = Math.sqrt(2);
	    if( cursors.up.isDown || cursors.down.isDown){
	      movingH = 1; // slow down diagonal movement
	    }
	    if( cursors.left.isDown || cursors.right.isDown){
	      movingV = 1; // slow down diagonal movement
	    }
 		switch( true ) {
 			case cursors.left.isDown:
 				player.x -= player.moveSpeed * movingH;
 				break;
 			case cursors.right.isDown:
 				player.x += player.moveSpeed * movingH;
 				break;
 		}
 		switch( true ) {
 			case cursors.down.isDown:
 				player.y += player.moveSpeed * movingV;
 				break;
 			case cursors.up.isDown:
 				player.y -= player.moveSpeed * movingV;
 				break;
 		}
 	}

 	const update = _ => { // runs 60 frames per second
 		handlePlayerMovement();
 	};

 	//															v---- WebGL (better) or Canvas (fallback)
 	const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);