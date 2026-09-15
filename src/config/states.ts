import type { StateDefinition } from '@/types';
import {
  UP_DISTRICTS,
  MAHARASHTRA_DISTRICTS,
  KARNATAKA_DISTRICTS,
  GUJARAT_DISTRICTS,
  TAMIL_NADU_DISTRICTS,
  BIHAR_DISTRICTS,
} from '@/data/districts';

export const STATES: StateDefinition[] = [
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    centroid: [26.85, 80.9],
    zoom: 7,
    status: 'available',
    districts: UP_DISTRICTS,
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai',
    centroid: [19.75, 75.71],
    zoom: 7,
    status: 'available',
    districts: MAHARASHTRA_DISTRICTS,
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru',
    centroid: [15.3, 75.7],
    zoom: 7,
    status: 'available',
    districts: KARNATAKA_DISTRICTS,
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    centroid: [22.6, 71.6],
    zoom: 7,
    status: 'available',
    districts: GUJARAT_DISTRICTS,
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    centroid: [11.1, 78.7],
    zoom: 7,
    status: 'available',
    districts: TAMIL_NADU_DISTRICTS,
  },
  {
    id: 'bihar',
    name: 'Bihar',
    capital: 'Patna',
    centroid: [25.6, 85.6],
    zoom: 7,
    status: 'available',
    districts: BIHAR_DISTRICTS,
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    capital: 'Jaipur',
    centroid: [26.9, 73.8],
    zoom: 7,
    status: 'coming-soon',
    districts: [],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    capital: 'Kolkata',
    centroid: [23.5, 87.5],
    zoom: 7,
    status: 'coming-soon',
    districts: [],
  },
];

export const findState = (id: string): StateDefinition | undefined =>
  STATES.find((s) => s.id === id);

export const INDIA_CENTROID: [number, number] = [22.9, 79.0];
export const INDIA_DEFAULT_ZOOM = 5;
