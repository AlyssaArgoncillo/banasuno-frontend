/**
 * IoT UI theme tokens and risk/status constants.
 */

export const T = {
  ink: '#1A1A1A',
  ink2: '#2D2D2D',
  ink3: '#4A4A4A',
  mute: '#8A8A8A',
  line: '#E8E8E8',
  wash: '#F5F5F5',
  white: '#FFFFFF',
  o7: '#C44F00',
  o5: '#FF6B1A',
  o3: '#FF9559',
  o1: '#FFD4B8',
  o0: '#FFF4ED',
  y5: '#FFB800',
  y1: '#FFEAB3',
  g7: '#2D5F2E',
  g5: '#4A9C4D',
  g1: '#C8E6C9',
  r7: '#B71C1C',
  r5: '#E53935',
  r1: '#FFCDD2',
};

export const RISK_LEVELS = [
  { range: '< 27°C', label: 'Not Hazardous', bg: '#4A9C4D', text: '#fff' },
  { range: '27–32°C', label: 'Caution', bg: '#FFB800', text: '#5A3E00' },
  { range: '33–41°C', label: 'Extreme Caution', bg: '#FF6B1A', text: '#fff' },
  { range: '42–51°C', label: 'Danger', bg: '#E53935', text: '#fff' },
  { range: '≥ 52°C', label: 'Extreme Danger', bg: '#B71C1C', text: '#fff' },
];

export const RISK_STYLE = {
  CAUTION: { bg: T.y1, text: '#7A5800' },
  'EXTREME CAUTION': { bg: T.o1, text: T.o7 },
  DANGER: { bg: T.r1, text: '#C62828' },
};

export const STATUS_DOT = {
  active: '#4CAF50',
  recent: '#FF9800',
  inactive: '#9E9E9E',
  alerting: '#E53935',
};
