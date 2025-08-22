import { GameState } from '../sim/Types';

function formatTime(totalSeconds: number) {
	const m = Math.floor(totalSeconds / 60);
	const s = Math.floor(totalSeconds % 60);
	return `${m}:${s.toString().padStart(2, '0')}`;
}

export function updateHUD(state: GameState) {
	const timerEl = document.getElementById('timer');
	if (timerEl) timerEl.textContent = formatTime(state.timeRemaining);
	const elixirFill = document.querySelector('#elixir > div') as HTMLDivElement | null;
	const elixirText = document.getElementById('elixirText');
	const p0 = state.players[0].elixir;
	if (elixirFill) elixirFill.style.width = `${(p0 / state.config.elixirMax) * 100}%`;
	if (elixirText) elixirText.textContent = `${Math.floor(p0)}/${state.config.elixirMax}`;
	const crowns = document.getElementById('crowns');
	if (crowns) crowns.textContent = `${state.players[0].crowns} - ${state.players[1].crowns}`;
}