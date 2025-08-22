import { GameState } from './Types';

export interface SystemsApi {
	updateElixir(dt: number, state: GameState): void;
	processPlacements(state: GameState): void;
	updateSpawns(dt: number, state: GameState): void;
	updateMovement(dt: number, state: GameState): void;
	updateTargeting(dt: number, state: GameState): void;
	updateCombat(dt: number, state: GameState): void;
	cleanup(state: GameState): void;
	updateTowers(dt: number, state: GameState): void;
	checkWin(state: GameState): void;
}

export function runFixedUpdateLoop(state: GameState, systems: SystemsApi, onFrame: (state: GameState) => void) {
	const fixedDt = 1 / state.config.updateHz;
	let last = performance.now() / 1000;
	let accumulator = 0;

	function frame() {
		const now = performance.now() / 1000;
		let dt = now - last;
		if (dt > 0.25) dt = 0.25; // clamp long frames
		last = now;
		accumulator += dt;

		while (accumulator >= fixedDt) {
			if (!state.paused) {
				state.timeRemaining = Math.max(0, state.timeRemaining - fixedDt);
				systems.updateElixir(fixedDt, state);
				systems.processPlacements(state);
				systems.updateSpawns(fixedDt, state);
				systems.updateMovement(fixedDt, state);
				systems.updateTargeting(fixedDt, state);
				systems.updateCombat(fixedDt, state);
				systems.updateTowers(fixedDt, state);
				systems.cleanup(state);
				systems.checkWin(state);
			}
			accumulator -= fixedDt;
		}

		onFrame(state);
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}