(Phaser => {
 	const GAME_WIDTH = 460;
 	const GAME_HEIGHT = 600;
 	const GAME_CONTAINER_ID = 'game';

 	const preload = _ => {

 	};

 	const create = _ => {

 	};

 	const update = _ => { // runs 60 frames per second

 	};

 	const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });


})(window.Phaser);