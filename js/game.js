(Phaser => {
 	const GAME_WIDTH = 460;
 	const GAME_HEIGHT = 600;
 	const GAME_CONTAINER_ID = 'game';
 	const GFX = 'gfx';
 	const INITIAL_MOVESPEED = 4;
 	const PLAYER_BULLET_SPEED = 6;
 	const ENEMY_SPAWN_FREQ = 100;
 	const ENEMY_SPEED = 4.5;

 	let player;
 	let enemies;
 	let cursors;

 	const preload = _ => {
 		game.load.spritesheet(GFX, 'assets/shmup-spritesheet-140x56-28x28-tile.png', 28, 28);
 	};

 	const handlePlayerFire = _ => {
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
 		enemies = game.add.group();
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

 	const handleBulletAnimations = _ => {
 		playerBullets.children.forEach( bullet => bullet.y -= PLAYER_BULLET_SPEED );
 	}

 	const randomlySpawnEnemy = _ => {
 		if( Math.floor(Math.random() * ENEMY_SPAWN_FREQ ) === 0 ) {
 			let randomX = Math.floor( Math.random() * GAME_WIDTH );
 			enemies.add( game.add.sprite(randomX, -24, GFX, 0) );
 		}
 	}

 	const handleEnemyActions = _ => {
		enemies.children.forEach( enemy => enemy.y += ENEMY_SPEED );
	};

	const removeBullet = bullet => bullet.destroy();

	const destroyEnemy = enemy => enemy.kill();

	const gameOver = _ => {
		game.state.destroy();
		game.add.text(90, 200, 'YOUR HEAD ASPLODE', { fill: '#FFFFFF' });
		let playAgain = game.add.text(120, 300, 'Play Again', { fill: '#FFFFFF' });
		playAgain.inputEnabled = true;
		playAgain.events.onInputUp.add(_ => {
			window.location.reload();
		});
	}

	const handlePlayerHit = _ => {
		gameOver();
	}

	const handleCollisions = _ => {
		// check if any bullets touch any enemies
		let enemiesHit = enemies.children
			.filter( enemy => enemy.alive )
			.filter( enemy => enemy.overlap(playerBullets) );
		if( enemiesHit.length > 0 ){
			// clean up bullets that land
			playerBullets.children
				.filter( bullet => bullet.overlap(enemies) )
        		.forEach( removeBullet );
			enemiesHit.forEach( destroyEnemy );
		}

		// check if enemies hit the player
		enemiesHit = enemies.children
			.filter( enemy => enemy.overlap(player) );
		if( enemiesHit.length > 0 ){
				handlePlayerHit();
			enemiesHit.forEach( destroyEnemy );
		}
	};

 	const cleanup = _ => {
 		playerBullets.children
 			.filter( bullet => bullet.y < 0 )
 			.forEach( bullet => bullet.destroy() );
 	}

 	const update = _ => { // runs 60 frames per second
 		handlePlayerMovement();
 		handleBulletAnimations();
 		randomlySpawnEnemy();
 		handleCollisions();
 		handleEnemyActions();

 		cleanup();
 	};

 	//															v---- WebGL (better) or Canvas (fallback)
 	const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);