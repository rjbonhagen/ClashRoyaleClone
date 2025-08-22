import { GameState } from '../sim/Types';
import { getCurrentTargets } from './s_targeting';
import { RenderContext } from '../render/render';

export function createCombatSystem(render: RenderContext) {
	return {
		update(dt: number, state: GameState) {
			const targets = getCurrentTargets();
			const idToUnit = new Map(state.units.map(u => [u.id, u] as const));
			const idToTower = new Map(state.towers.map(t => [t.id, t] as const));
			for (const tag of targets) {
				const attacker = idToUnit.get(tag.attackerId);
				if (!attacker || !attacker.alive) continue;
				attacker.attackCooldown -= dt;
				if (attacker.attackCooldown > 0) continue;
				attacker.attackCooldown = 1 / attacker.stats.attackSpeed;
				let targetUnit = idToUnit.get(tag.targetId);
				let targetTower = idToTower.get(tag.targetId);
				if (targetUnit && targetUnit.alive) {
					targetUnit.stats.hp -= attacker.stats.damage;
					if (targetUnit.stats.hp <= 0) targetUnit.alive = false;
					continue;
				}
				if (targetTower && targetTower.alive) {
					targetTower.hp -= attacker.stats.damage;
					if (targetTower.hp <= 0) targetTower.alive = false;
				}
			}
		}
	};
}