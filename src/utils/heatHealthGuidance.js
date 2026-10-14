/**
 * Static health guidance per PAGASA heat index level (1–5), shown in the zone card's
 * Risks and Remedies tabs. Pure data, no I/O.
 *
 * Risk summaries follow PAGASA's "possible effects" for each heat index category:
 * https://www.pagasa.dost.gov.ph/weather/heat-index
 * Remedies are simple self-care steps for hot weather — NOT medical advice.
 */

/** Heat-related conditions and the signs to watch for. */
export const HEAT_CONDITIONS = {
  dehydration: {
    name: 'Dehydration & fatigue',
    signs: 'Thirst, dry mouth, dark yellow urine, tiredness, headache.',
  },
  cramps: {
    name: 'Heat cramps',
    signs: 'Painful muscle cramps or spasms in the legs, arms or stomach, often with heavy sweating.',
  },
  exhaustion: {
    name: 'Heat exhaustion',
    signs: 'Heavy sweating, cool and clammy skin, dizziness, nausea, weakness, fast but weak pulse, fainting.',
  },
  stroke: {
    name: 'Heat stroke',
    signs: 'Very high body temperature, hot red skin (sweating may stop), confusion, slurred speech, seizures or passing out.',
    emergency: true,
  },
};

const AT_RISK_GROUPS =
  'Older adults, babies and young children, pregnant women, people with heart, lung or kidney conditions, and outdoor workers.';

/** Per-level risk summary (PAGASA possible effects) and which conditions to watch for. */
const RISKS_BY_LEVEL = {
  1: {
    summary: 'Low heat risk. Most people can go about their day as usual.',
    detail: 'Long hours of hard work under direct sun can still tire you out.',
    conditions: ['dehydration'],
  },
  2: {
    summary: 'Fatigue is possible with prolonged exposure and activity.',
    detail: 'Continuing activity in the heat could lead to heat cramps.',
    conditions: ['dehydration', 'cramps'],
  },
  3: {
    summary: 'Heat cramps and heat exhaustion are possible.',
    detail: 'Continuing activity in the heat could lead to heat stroke.',
    conditions: ['cramps', 'exhaustion', 'stroke'],
  },
  4: {
    summary: 'Heat cramps and heat exhaustion are likely.',
    detail: 'Heat stroke is probable with continued exposure.',
    conditions: ['exhaustion', 'stroke', 'cramps'],
  },
  5: {
    summary: 'Heat stroke is imminent with continued exposure.',
    detail: 'Being outdoors in this heat is dangerous for everyone.',
    conditions: ['stroke', 'exhaustion'],
  },
};

const DRINK_WATER = 'Drink water often, even if you are not thirsty. Avoid alcohol and very sugary drinks.';
const COOL_DOWN = 'Cool down with a fan, a wet towel on your neck, or a cool shower.';
const CHECK_ON_OTHERS = 'Check on older family members, young children and neighbors who live alone.';
const NO_PARKED_CARS = 'Never leave children or pets inside a parked vehicle.';

/** Per-level simple remedies (self-care tips). */
const REMEDIES_BY_LEVEL = {
  1: [
    'Drink water regularly through the day.',
    'Wear light, loose clothing and use a hat or umbrella in the sun.',
  ],
  2: [
    DRINK_WATER,
    'Stay in the shade and limit time in direct sun from 10 AM to 4 PM.',
    'Wear light-colored, loose clothing and a hat or umbrella.',
    'Take short rest breaks if you feel tired.',
  ],
  3: [
    DRINK_WATER,
    'Rest in a cool, shaded or air-conditioned place.',
    COOL_DOWN,
    'Cut down on outdoor work and exercise; take frequent breaks.',
    'If you sweat a lot, oral rehydration solution (ORS) helps replace lost salts.',
  ],
  4: [
    'Stay indoors during the hottest hours (10 AM to 4 PM).',
    DRINK_WATER,
    COOL_DOWN,
    CHECK_ON_OTHERS,
    NO_PARKED_CARS,
  ],
  5: [
    'Stay indoors in the coolest room you can; avoid going out.',
    'Postpone outdoor work and exercise.',
    DRINK_WATER,
    COOL_DOWN,
    CHECK_ON_OTHERS,
    NO_PARKED_CARS,
  ],
};

/** Simple first aid when someone feels unwell from the heat (all levels). */
export const HEAT_FIRST_AID = [
  'Move them to a shaded or cool place.',
  'Loosen tight clothing and fan them.',
  'Cool the skin with wet cloths, especially the neck, armpits and groin.',
  'Give sips of water if they are awake and not vomiting.',
  'If they are confused, faint, or not getting better, call 911 and go to the nearest clinic.',
];

export const REMEDY_DISCLAIMER =
  'Not medical advice. These are simple self-care tips for hot weather. If you or someone with you feels very unwell, go to the nearest clinic or call 911.';

function clampLevel(level) {
  const n = Math.round(Number(level));
  return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : 1;
}

/**
 * Health risks for a PAGASA heat level.
 * @param {number} level - 1–5
 * @returns {{ summary: string, detail: string, conditions: Array<{ key: string, name: string, signs: string, emergency?: boolean }>, atRiskGroups: string | null }}
 */
export function getHeatRisks(level) {
  const l = clampLevel(level);
  const risk = RISKS_BY_LEVEL[l];
  return {
    summary: risk.summary,
    detail: risk.detail,
    conditions: risk.conditions.map((key) => ({ key, ...HEAT_CONDITIONS[key] })),
    atRiskGroups: l >= 2 ? AT_RISK_GROUPS : null,
  };
}

/**
 * Simple remedies for a PAGASA heat level.
 * @param {number} level - 1–5
 * @returns {string[]}
 */
export function getHeatRemedies(level) {
  return [...REMEDIES_BY_LEVEL[clampLevel(level)]];
}
