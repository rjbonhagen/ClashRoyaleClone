import { Card } from '../sim/Types';

export const cards: Card[] = [
	{
		id: 'spear-goblins',
		name: 'Spear Goblins',
		cost: 2,
		type: 'unit',
		spawns: [{ count: 3 }],
		stats: { hp: 120, damage: 35, attackSpeed: 1.3, range: 12, speed: 12 },
		targetFilter: 'any'
	},
	{
		id: 'knight',
		name: 'Knight',
		cost: 3,
		type: 'unit',
		spawns: [{ count: 1 }],
		stats: { hp: 800, damage: 110, attackSpeed: 1.1, range: 2, speed: 8 },
		targetFilter: 'any'
	},
	{
		id: 'giant',
		name: 'Giant',
		cost: 5,
		type: 'unit',
		spawns: [{ count: 1 }],
		stats: { hp: 2000, damage: 140, attackSpeed: 1.5, range: 2, speed: 6 },
		targetFilter: 'buildings_only'
	}
];

export const cardsById: Record<string, Card> = Object.fromEntries(cards.map(c => [c.id, c]));

export function startingDeck(): string[] {
	return ['spear-goblins', 'knight', 'giant', 'knight', 'spear-goblins', 'giant', 'knight', 'spear-goblins'];
}