import { Application, Container, Graphics, Text } from 'pixi.js';
import { GameState, Tower, Unit } from '../sim/Types';

export interface RenderContext {
	app: Application;
	root: Container;
	unitsLayer: Container;
	towersLayer: Container;
	uiLayer: Container;
	render: (state: GameState) => void;
	worldToScreen: (x: number, y: number) => { x: number; y: number };
}

export function renderInit(app: Application, state: GameState): RenderContext {
	const root = new Container();
	const board = new Graphics();
	const towersLayer = new Container();
	const unitsLayer = new Container();
	const uiLayer = new Container();

	root.addChild(board);
	root.addChild(towersLayer);
	root.addChild(unitsLayer);
	root.addChild(uiLayer);
	app.stage.addChild(root);

	function drawBoard() {
		board.clear();
		const w = app.renderer.width;
		const h = app.renderer.height;
		// Background
		board.rect(0, 0, w, h).fill(0x0e1320);
		// River
		board.rect(0, h / 2 - 4, w, 8).fill(0x1f2937);
		// Lanes (y=25 and y=75 in world space -> map)
		const p25 = worldToScreen(0, 25).y;
		const p75 = worldToScreen(0, 75).y;
		board.lineStyle({ color: 0x2b3242, width: 2, alpha: 0.6 });
		board.moveTo(0, p25).lineTo(w, p25).stroke();
		board.moveTo(0, p75).lineTo(w, p75).stroke();
	}

	function worldToScreen(x: number, y: number) {
		const w = app.renderer.width;
		const h = app.renderer.height;
		return {
			x: (x / 100) * w,
			y: (y / 100) * h
		};
	}

	const entityToGraphic = new Map<number, Graphics>();

	function ensureTower(t: Tower) {
		let g = entityToGraphic.get(t.id);
		if (!g) {
			g = new Graphics();
			entityToGraphic.set(t.id, g);
			towersLayer.addChild(g);
		}
		const c = t.isKing ? 0xf59e0b : 0x60a5fa;
		const pos = worldToScreen(t.pos.x, t.pos.y);
		g.clear();
		g.rect(pos.x - 12, pos.y - 16, 24, 32).fill(c);
	}

	function ensureUnit(u: Unit) {
		let g = entityToGraphic.get(u.id);
		if (!g) {
			g = new Graphics();
			entityToGraphic.set(u.id, g);
			unitsLayer.addChild(g);
		}
		const c = u.owner === 0 ? 0x22c55e : 0xef4444;
		const pos = worldToScreen(u.pos.x, u.pos.y);
		g.clear();
		g.circle(pos.x, pos.y, 8).fill(c);
	}

	function removeEntity(id: number) {
		const g = entityToGraphic.get(id);
		if (g && g.parent) g.parent.removeChild(g);
		entityToGraphic.delete(id);
	}

	function render(state: GameState) {
		drawBoard();
		// Update towers
		for (const t of state.towers) {
			if (t.alive) ensureTower(t); else removeEntity(t.id);
		}
		// Update units
		for (const u of state.units) {
			if (u.alive) ensureUnit(u); else removeEntity(u.id);
		}
	}

	return { app, root, unitsLayer, towersLayer, uiLayer, render, worldToScreen };
}