import { GameState, Unit } from '../sim/Types';
import { takePendingSpawns } from './s_placement';
import { cardsById } from '../data/cards';
import { RenderContext } from '../render/render';

export function createSpawnSystem(render: RenderContext) {
	return {
		update(dt: number, state: GameState) {
			const spawns = takePendingSpawns();
			for (const s of spawns) {
				const card = cardsById[s.cardId];
				if (!card || !card.stats) continue;
				for (let i = 0; i < s.count; i++) {
					const u: Unit = {
						id: state.nextEntityId++,
						owner: s.owner,
						lane: s.lane,
						pos: { x: s.posX, y: s.lane === 'left' ? 25 : 75 },
						stats: { ...card.stats },
						targetFilter: card.targetFilter || 'any',
						attackCooldown: 0,
						alive: true
					};
					state.units.push(u);
				}
			}
		}
	};
}