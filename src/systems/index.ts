import { GameState, Lane } from '../sim/Types';
import { SystemsApi } from '../sim/loop';
import { createElixirSystem } from './s_elixir';
import { createPlacementSystem } from './s_placement';
import { createSpawnSystem } from './s_spawn';
import { createMovementSystem } from './s_movement';
import { createTargetingSystem } from './s_targeting';
import { createCombatSystem } from './s_combat';
import { createCleanupSystem } from './s_cleanup';
import { createTowersSystem } from './s_towers';
import { createWinSystem } from './s_win';
import { RenderContext } from '../render/render';

export function initializeSystems(
	state: GameState,
	render: RenderContext,
	placementSource?: () => Array<{ owner: 0 | 1; cardId: string; x: number; y: number; lane: Lane }>
): SystemsApi {
	const elixir = createElixirSystem();
	const placement = createPlacementSystem(render);
	if (placementSource) placement.setPlacementSource(placementSource);
	const spawns = createSpawnSystem(render);
	const movement = createMovementSystem();
	const targeting = createTargetingSystem();
	const combat = createCombatSystem(render);
	const cleanup = createCleanupSystem(render);
	const towers = createTowersSystem(render);
	const win = createWinSystem();

	return {
		updateElixir: elixir.update,
		processPlacements: placement.process,
		updateSpawns: spawns.update,
		updateMovement: movement.update,
		updateTargeting: targeting.update,
		updateCombat: combat.update,
		cleanup: cleanup.process,
		updateTowers: towers.update,
		checkWin: win.check
	};
}