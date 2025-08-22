import { GameState } from '../sim/Types';

export function createElixirSystem() {
	return {
		update(dt: number, state: GameState) {
			for (const p of state.players) {
				p.elixir = Math.min(state.config.elixirMax, p.elixir + state.config.elixirPerSecond * dt);
			}
		}
	};
}