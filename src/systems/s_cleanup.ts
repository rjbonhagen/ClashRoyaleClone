import { GameState } from '../sim/Types';
import { RenderContext } from '../render/render';

export function createCleanupSystem(render: RenderContext) {
	return {
		process(state: GameState) {
			// Award crowns for destroyed towers
			for (const t of state.towers) {
				if (!t.alive && t.hp <= 0 && t.owner !== undefined) {
					// Count once by marking hp negative large value after scoring
					if (t.hp > -9999) {
						const other = t.owner === 0 ? 1 : 0;
						state.players[other].crowns += 1;
						t.hp = -10000;
					}
				}
			}
			// Remove dead units from array
			state.units = state.units.filter(u => u.alive);
		}
	};
}