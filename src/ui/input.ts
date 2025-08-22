import { GameState, Lane } from '../sim/Types';
import { RenderContext } from '../render/render';
import { SystemsApi } from '../sim/loop';
import { cardsById } from '../data/cards';

export function createPlacementInput(state: GameState, render: RenderContext, systems: SystemsApi) {
	const handEl = document.getElementById('hand') as HTMLDivElement | null;
	let selectedCardId: string | null = null;

	function worldFromPointer(clientX: number, clientY: number) {
		const rect = render.app.canvas.getBoundingClientRect();
		const x = ((clientX - rect.left) / rect.width) * 100;
		const y = ((clientY - rect.top) / rect.height) * 100;
		return { x, y };
	}

	function onCanvasClick(ev: MouseEvent) {
		if (!selectedCardId) return;
		const card = cardsById[selectedCardId];
		if (!card) return;
		const { x, y } = worldFromPointer(ev.clientX, ev.clientY);
		const lane: Lane = y < 50 ? 'left' : 'right';
		// place only on own side for MVP
		if (x > 50) return;
		// enqueue placement via systems (placement system reads a queue in state)
		placementQueue.push({ owner: 0, cardId: selectedCardId, x, y, lane });
		selectedCardId = null;
		renderHand();
	}

	render.app.canvas.addEventListener('click', onCanvasClick);

	type Placement = { owner: 0 | 1; cardId: string; x: number; y: number; lane: Lane };
	const placementQueue: Placement[] = [];

	function renderHand() {
		if (!handEl) return;
		handEl.innerHTML = '';
		const player = state.players[0];
		for (const cid of player.hand) {
			const c = cardsById[cid];
			const btn = document.createElement('div');
			btn.className = 'card' + (player.elixir < c.cost ? ' disabled' : '');
			btn.textContent = `${c.name} (${c.cost})`;
			btn.onclick = () => {
				if (player.elixir < c.cost) return;
				selectedCardId = cid;
			};
			handEl.appendChild(btn);
		}
	}

	// Expose to placement system
	return {
		getAndClearPlacements(): Placement[] {
			const items = placementQueue.slice();
			placementQueue.length = 0;
			return items;
		},
		renderHand
	};
}