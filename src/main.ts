import { Application } from 'pixi.js';
import { bootstrapGame } from './sim/bootstrap';

async function start() {
	const appContainer = document.getElementById('app');
	if (!appContainer) throw new Error('Missing #app');

	const app = new Application();
	await app.init({
		resizeTo: window,
		background: '#0b0d13'
	});
	appContainer.appendChild(app.canvas);

	bootstrapGame(app);
}

start();