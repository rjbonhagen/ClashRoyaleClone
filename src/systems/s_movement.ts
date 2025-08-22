import { GameState } from '../sim/Types';

export function createMovementSystem() {
	return {
		update(dt: number, state: GameState) {
			for (const u of state.units) {
				if (!u.alive) continue;
				const dir = u.owner === 0 ? 1 : -1;
				u.pos.x += (u.stats.speed * dt) * (dir * (100 / state.config.laneLength));
				// Clamp within world
				u.pos.x = Math.max(0, Math.min(100, u.pos.x));
			}
		}
	};
}