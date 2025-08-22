import { Application, Container, Graphics, Text } from 'pixi.js';
import { GameState, GameConfig, Tower, Unit, Card, Lane } from './Types';
import { runFixedUpdateLoop } from './loop';
import { renderInit } from '../render/render';
import { updateHUD } from '../ui/hud';
import { createPlacementInput } from '../ui/input';
import { cardsById, startingDeck } from '../data/cards';
import { initializeSystems } from '../systems/index';

export function bootstrapGame(app: Application) {
	const config: GameConfig = {
		matchSeconds: 180,
		laneLength: 100,
		elixirMax: 10,
		elixirPerSecond: 0.5,
		updateHz: 30
	};

	const state: GameState = {
		timeRemaining: config.matchSeconds,
		paused: false,
		nextEntityId: 1,
		units: [],
		towers: [],
		players: [
			{ elixir: 5, deck: startingDeck(), hand: [], drawIndex: 0, crowns: 0 },
			{ elixir: 5, deck: startingDeck(), hand: [], drawIndex: 0, crowns: 0 }
		],
		config
	};

	function addTower(owner: 0 | 1, lane: Lane | 'center', x: number, y: number, isKing: boolean) {
		const tower = {
			id: state.nextEntityId++,
			owner,
			lane,
			pos: { x, y },
			hp: isKing ? 3000 : 1500,
			damage: isKing ? 120 : 90,
			attackSpeed: 1,
			range: 20,
			isKing,
			attackCooldown: 0,
			alive: true
		};
		state.towers.push(tower as any);
	}

	const laneYLeft = 25;
	const laneYRight = 75;
	addTower(0, 'left', 10, laneYLeft, false);
	addTower(0, 'right', 10, laneYRight, false);
	addTower(0, 'center', 0, 50, true);
	addTower(1, 'left', 90, laneYLeft, false);
	addTower(1, 'right', 90, laneYRight, false);
	addTower(1, 'center', 100, 50, true);

	for (let p = 0 as 0 | 1; p <= 1; p++) {
		const player = state.players[p];
		player.hand = player.deck.slice(0, 4);
		player.drawIndex = 4;
	}

	const renderCtx = renderInit(app, state);
	const input = createPlacementInput(state, renderCtx, {} as any);
	const systems = initializeSystems(state, renderCtx, input.getAndClearPlacements);
	input.renderHand();

	runFixedUpdateLoop(state, systems, (gs) => {
		updateHUD(gs);
		renderCtx.render(gs);
	});
}