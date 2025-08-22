import { GameState, Lane, Unit } from '../sim/Types';
import { cardsById } from '../data/cards';
import { RenderContext } from '../render/render';

export interface PendingSpawn {
	owner: 0 | 1;
	lane: Lane;
	posX: number;
	count: number;
	cardId: string;
}

const pendingSpawns: PendingSpawn[] = [];

export function createPlacementSystem(render: RenderContext) {
	// get input queue from input.ts by a global function assigned at bootstrap
	let getPlacements: (() => Array<{ owner: 0 | 1; cardId: string; x: number; y: number; lane: Lane }>) | null = null;
	// Wire dynamically by consumers
	// We'll attach a setter on the returned object

	return {
		setPlacementSource(fn: () => Array<{ owner: 0 | 1; cardId: string; x: number; y: number; lane: Lane }>) {
			getPlacements = fn;
		},
		process(state: GameState) {
			if (!getPlacements) return;
			const placements = getPlacements();
			for (const p of placements) {
				const player = state.players[p.owner];
				const card = cardsById[p.cardId];
				if (!card) continue;
				if (player.elixir < card.cost) continue;
				player.elixir -= card.cost;
				const posX = Math.max(0, Math.min(50, p.x));
				const count = card.spawns?.[0]?.count ?? 1;
				pendingSpawns.push({ owner: p.owner, lane: p.lane, posX, count, cardId: card.id });
			}
		}
	};
}

export function takePendingSpawns(): PendingSpawn[] {
	const items = pendingSpawns.slice();
	pendingSpawns.length = 0;
	return items;
}