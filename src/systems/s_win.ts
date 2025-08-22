import { GameState } from '../sim/Types';

export function createWinSystem() {
	return {
		check(state: GameState) {
			// Instant win if king tower destroyed
			const king0 = state.towers.find(t => t.owner === 0 && t.isKing);
			const king1 = state.towers.find(t => t.owner === 1 && t.isKing);
			if (king0 && !king0.alive) state.paused = true;
			if (king1 && !king1.alive) state.paused = true;
			if (state.timeRemaining <= 0) state.paused = true;
		}
	};
}