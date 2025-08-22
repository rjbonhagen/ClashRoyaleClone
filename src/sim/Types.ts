export type EntityId = number;

export type Lane = 'left' | 'right';

export interface Vector2 {
	x: number;
	y: number;
}

export interface UnitStats {
	hp: number;
	damage: number;
	attackSpeed: number; // attacks per second
	range: number; // in world units
	speed: number; // units per second
}

export type TargetFilter = 'any' | 'buildings_only';

export interface Unit {
	id: EntityId;
	owner: 0 | 1;
	lane: Lane;
	pos: Vector2;
	stats: UnitStats;
	targetFilter: TargetFilter;
	attackCooldown: number; // seconds until next attack
	alive: boolean;
}

export interface Tower {
	id: EntityId;
	owner: 0 | 1;
	lane: Lane | 'center';
	pos: Vector2;
	hp: number;
	damage: number;
	attackSpeed: number;
	range: number;
	isKing: boolean;
	attackCooldown: number;
	alive: boolean;
}

export type CardType = 'unit' | 'spell' | 'building';

export interface Card {
	id: string;
	name: string;
	cost: number;
	type: CardType;
	spawns?: Array<{ count: number; offsetY?: number; lane?: Lane }>;
	stats?: UnitStats;
	targetFilter?: TargetFilter;
}

export interface PlayerState {
	elixir: number;
	deck: string[]; // card ids
	hand: string[];
	drawIndex: number;
	crowns: number; // towers destroyed
}

export interface GameConfig {
	matchSeconds: number;
	laneLength: number; // world units per lane from own king to enemy king
	elixirMax: number;
	elixirPerSecond: number;
	updateHz: number;
}

export interface GameState {
	timeRemaining: number;
	paused: boolean;
	nextEntityId: number;
	units: Unit[];
	towers: Tower[];
	players: [PlayerState, PlayerState];
	config: GameConfig;
}