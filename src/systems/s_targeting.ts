import { GameState, Unit, Tower } from '../sim/Types';

interface CombatTag {
	attackerId: number;
	targetId: number;
}

let currentTargets: CombatTag[] = [];

export function createTargetingSystem() {
	return {
		update(dt: number, state: GameState) {
			currentTargets = [];
			for (const u of state.units) {
				if (!u.alive) continue;
				let bestTarget: { id: number; dist: number } | null = null;
				for (const v of state.units) {
					if (!v.alive) continue;
					if (v.owner === u.owner) continue;
					const dy = Math.abs(v.pos.y - u.pos.y);
					if (dy > 1) continue; // stay in-lane (coarse)
					const dx = Math.abs(v.pos.x - u.pos.x);
					if (dx <= u.stats.range) {
						if (!bestTarget || dx < bestTarget.dist) bestTarget = { id: v.id, dist: dx };
					}
				}
				// Consider towers
				for (const t of state.towers) {
					if (!t.alive) continue;
					if (t.owner === u.owner) continue;
					if (u.targetFilter === 'buildings_only' || true) {
						const dy = Math.abs(t.pos.y - u.pos.y);
						if (dy > 3) continue; // only similar lane
						const dx = Math.abs(t.pos.x - u.pos.x);
						if (dx <= u.stats.range) {
							if (!bestTarget || dx < bestTarget.dist) bestTarget = { id: t.id, dist: dx };
						}
					}
				}
				if (bestTarget) currentTargets.push({ attackerId: u.id, targetId: bestTarget.id });
			}
		}
	};
}

export function getCurrentTargets(): CombatTag[] {
	return currentTargets;
}