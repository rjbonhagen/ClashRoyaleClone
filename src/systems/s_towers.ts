import { GameState, Tower, Unit } from '../sim/Types';
import { RenderContext } from '../render/render';

export function createTowersSystem(render: RenderContext) {
	return {
		update(dt: number, state: GameState) {
			for (const t of state.towers) {
				if (!t.alive) continue;
				t.attackCooldown -= dt;
				if (t.attackCooldown > 0) continue;
				const enemies = state.units.filter(u => u.alive && u.owner !== t.owner);
				let best: { u: Unit; dist: number } | null = null;
				for (const u of enemies) {
					const dy = Math.abs(u.pos.y - t.pos.y);
					if (dy > 5 && t.lane !== 'center') continue;
					const dx = Math.abs(u.pos.x - t.pos.x);
					if (dx <= t.range) {
						if (!best || dx < best.dist) best = { u, dist: dx };
					}
				}
				if (best) {
					t.attackCooldown = 1 / t.attackSpeed;
					best.u.stats.hp -= t.damage;
					if (best.u.stats.hp <= 0) best.u.alive = false;
				}
			}
		}
	};
}