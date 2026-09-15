import type { District } from '@/types';

/**
 * Uttar Pradesh district reference list.
 *
 * IMPORTANT — geographic accuracy notice:
 * Centroid coordinates here are APPROXIMATE, hand-estimated for the purpose of
 * placing map markers and labels in this demo build. They are NOT sourced from
 * an authoritative survey/GIS dataset and must not be used for any official,
 * legal, navigational, or cartographic purpose. See public/geojson/README.md
 * and the in-app Data Sources page for the same notice.
 *
 * District names reflect commonly used current names (e.g. Prayagraj, Ayodhya).
 */
export const UP_DISTRICTS: District[] = [
  { id: 'agra', name: 'Agra', stateId: 'uttar-pradesh', division: 'Agra', centroid: [27.18, 78.02] },
  { id: 'aligarh', name: 'Aligarh', stateId: 'uttar-pradesh', division: 'Aligarh', centroid: [27.89, 78.08] },
  { id: 'ambedkar-nagar', name: 'Ambedkar Nagar', stateId: 'uttar-pradesh', division: 'Ayodhya', centroid: [26.40, 82.20] },
  { id: 'amethi', name: 'Amethi', stateId: 'uttar-pradesh', division: 'Ayodhya', centroid: [26.16, 81.81] },
  { id: 'amroha', name: 'Amroha', stateId: 'uttar-pradesh', division: 'Moradabad', centroid: [28.90, 78.47] },
  { id: 'auraiya', name: 'Auraiya', stateId: 'uttar-pradesh', division: 'Kanpur', centroid: [26.47, 79.51] },
  { id: 'ayodhya', name: 'Ayodhya', stateId: 'uttar-pradesh', division: 'Ayodhya', centroid: [26.80, 82.20] },
  { id: 'azamgarh', name: 'Azamgarh', stateId: 'uttar-pradesh', division: 'Azamgarh', centroid: [26.07, 83.19] },
  { id: 'baghpat', name: 'Baghpat', stateId: 'uttar-pradesh', division: 'Meerut', centroid: [28.95, 77.22] },
  { id: 'bahraich', name: 'Bahraich', stateId: 'uttar-pradesh', division: 'Devipatan', centroid: [27.57, 81.60] },
  { id: 'ballia', name: 'Ballia', stateId: 'uttar-pradesh', division: 'Azamgarh', centroid: [25.76, 84.15] },
  { id: 'balrampur', name: 'Balrampur', stateId: 'uttar-pradesh', division: 'Devipatan', centroid: [27.43, 82.18] },
  { id: 'banda', name: 'Banda', stateId: 'uttar-pradesh', division: 'Chitrakoot', centroid: [25.48, 80.34] },
  { id: 'barabanki', name: 'Barabanki', stateId: 'uttar-pradesh', division: 'Ayodhya', centroid: [26.93, 81.19] },
  { id: 'bareilly', name: 'Bareilly', stateId: 'uttar-pradesh', division: 'Bareilly', centroid: [28.35, 79.42] },
  { id: 'basti', name: 'Basti', stateId: 'uttar-pradesh', division: 'Basti', centroid: [26.79, 82.76] },
  { id: 'bhadohi', name: 'Bhadohi', stateId: 'uttar-pradesh', division: 'Varanasi', centroid: [25.38, 82.57] },
  { id: 'bijnor', name: 'Bijnor', stateId: 'uttar-pradesh', division: 'Moradabad', centroid: [29.37, 78.13] },
  { id: 'budaun', name: 'Budaun', stateId: 'uttar-pradesh', division: 'Bareilly', centroid: [28.03, 79.12] },
  { id: 'bulandshahr', name: 'Bulandshahr', stateId: 'uttar-pradesh', division: 'Meerut', centroid: [28.40, 77.85] },
  { id: 'chandauli', name: 'Chandauli', stateId: 'uttar-pradesh', division: 'Varanasi', centroid: [25.26, 83.27] },
  { id: 'chitrakoot', name: 'Chitrakoot', stateId: 'uttar-pradesh', division: 'Chitrakoot', centroid: [25.20, 80.87] },
  { id: 'deoria', name: 'Deoria', stateId: 'uttar-pradesh', division: 'Gorakhpur', centroid: [26.50, 83.79] },
  { id: 'etah', name: 'Etah', stateId: 'uttar-pradesh', division: 'Aligarh', centroid: [27.63, 78.66] },
  { id: 'etawah', name: 'Etawah', stateId: 'uttar-pradesh', division: 'Kanpur', centroid: [26.78, 79.02] },
  { id: 'farrukhabad', name: 'Farrukhabad', stateId: 'uttar-pradesh', division: 'Kanpur', centroid: [27.39, 79.58] },
  { id: 'fatehpur', name: 'Fatehpur', stateId: 'uttar-pradesh', division: 'Allahabad', centroid: [25.93, 80.81] },
  { id: 'firozabad', name: 'Firozabad', stateId: 'uttar-pradesh', division: 'Agra', centroid: [27.15, 78.40] },
  { id: 'gautam-buddha-nagar', name: 'Gautam Buddha Nagar', stateId: 'uttar-pradesh', division: 'Meerut', centroid: [28.40, 77.50] },
  { id: 'ghaziabad', name: 'Ghaziabad', stateId: 'uttar-pradesh', division: 'Meerut', centroid: [28.67, 77.43] },
  { id: 'ghazipur', name: 'Ghazipur', stateId: 'uttar-pradesh', division: 'Varanasi', centroid: [25.58, 83.58] },
  { id: 'gonda', name: 'Gonda', stateId: 'uttar-pradesh', division: 'Devipatan', centroid: [27.13, 81.96] },
  { id: 'gorakhpur', name: 'Gorakhpur', stateId: 'uttar-pradesh', division: 'Gorakhpur', centroid: [26.76, 83.37] },
  { id: 'hamirpur', name: 'Hamirpur', stateId: 'uttar-pradesh', division: 'Chitrakoot', centroid: [25.96, 80.15] },
  { id: 'hapur', name: 'Hapur', stateId: 'uttar-pradesh', division: 'Meerut', centroid: [28.73, 77.78] },
  { id: 'hardoi', name: 'Hardoi', stateId: 'uttar-pradesh', division: 'Lucknow', centroid: [27.42, 80.13] },
  { id: 'hathras', name: 'Hathras', stateId: 'uttar-pradesh', division: 'Aligarh', centroid: [27.60, 78.05] },
  { id: 'jalaun', name: 'Jalaun', stateId: 'uttar-pradesh', division: 'Jhansi', centroid: [26.15, 79.35] },
  { id: 'jaunpur', name: 'Jaunpur', stateId: 'uttar-pradesh', division: 'Varanasi', centroid: [25.75, 82.68] },
  { id: 'jhansi', name: 'Jhansi', stateId: 'uttar-pradesh', division: 'Jhansi', centroid: [25.45, 78.58] },
  { id: 'kannauj', name: 'Kannauj', stateId: 'uttar-pradesh', division: 'Kanpur', centroid: [27.05, 79.92] },
  { id: 'kanpur-dehat', name: 'Kanpur Dehat', stateId: 'uttar-pradesh', division: 'Kanpur', centroid: [26.46, 80.10] },
  { id: 'kanpur-nagar', name: 'Kanpur Nagar', stateId: 'uttar-pradesh', division: 'Kanpur', centroid: [26.45, 80.33] },
  { id: 'kasganj', name: 'Kasganj', stateId: 'uttar-pradesh', division: 'Aligarh', centroid: [27.81, 78.65] },
  { id: 'kaushambi', name: 'Kaushambi', stateId: 'uttar-pradesh', division: 'Allahabad', centroid: [25.53, 81.38] },
  { id: 'lakhimpur-kheri', name: 'Lakhimpur Kheri', stateId: 'uttar-pradesh', division: 'Lucknow', centroid: [27.95, 80.78] },
  { id: 'kushinagar', name: 'Kushinagar', stateId: 'uttar-pradesh', division: 'Gorakhpur', centroid: [26.74, 83.89] },
  { id: 'lalitpur', name: 'Lalitpur', stateId: 'uttar-pradesh', division: 'Jhansi', centroid: [24.69, 78.41] },
  { id: 'lucknow', name: 'Lucknow', stateId: 'uttar-pradesh', division: 'Lucknow', centroid: [26.85, 80.95] },
  { id: 'maharajganj', name: 'Maharajganj', stateId: 'uttar-pradesh', division: 'Gorakhpur', centroid: [27.15, 83.56] },
  { id: 'mahoba', name: 'Mahoba', stateId: 'uttar-pradesh', division: 'Chitrakoot', centroid: [25.29, 79.87] },
  { id: 'mainpuri', name: 'Mainpuri', stateId: 'uttar-pradesh', division: 'Agra', centroid: [27.23, 79.02] },
  { id: 'mathura', name: 'Mathura', stateId: 'uttar-pradesh', division: 'Agra', centroid: [27.49, 77.67] },
  { id: 'mau', name: 'Mau', stateId: 'uttar-pradesh', division: 'Azamgarh', centroid: [25.94, 83.56] },
  { id: 'meerut', name: 'Meerut', stateId: 'uttar-pradesh', division: 'Meerut', centroid: [28.98, 77.71] },
  { id: 'mirzapur', name: 'Mirzapur', stateId: 'uttar-pradesh', division: 'Mirzapur', centroid: [25.15, 82.57] },
  { id: 'moradabad', name: 'Moradabad', stateId: 'uttar-pradesh', division: 'Moradabad', centroid: [28.84, 78.78] },
  { id: 'muzaffarnagar', name: 'Muzaffarnagar', stateId: 'uttar-pradesh', division: 'Saharanpur', centroid: [29.47, 77.70] },
  { id: 'pilibhit', name: 'Pilibhit', stateId: 'uttar-pradesh', division: 'Bareilly', centroid: [28.63, 79.80] },
  { id: 'pratapgarh', name: 'Pratapgarh', stateId: 'uttar-pradesh', division: 'Allahabad', centroid: [25.90, 81.99] },
  { id: 'prayagraj', name: 'Prayagraj', stateId: 'uttar-pradesh', division: 'Allahabad', centroid: [25.44, 81.85] },
  { id: 'raebareli', name: 'Raebareli', stateId: 'uttar-pradesh', division: 'Lucknow', centroid: [26.23, 81.23] },
  { id: 'rampur', name: 'Rampur', stateId: 'uttar-pradesh', division: 'Moradabad', centroid: [28.80, 79.03] },
  { id: 'saharanpur', name: 'Saharanpur', stateId: 'uttar-pradesh', division: 'Saharanpur', centroid: [29.97, 77.55] },
  { id: 'sambhal', name: 'Sambhal', stateId: 'uttar-pradesh', division: 'Moradabad', centroid: [28.58, 78.57] },
  { id: 'sant-kabir-nagar', name: 'Sant Kabir Nagar', stateId: 'uttar-pradesh', division: 'Basti', centroid: [26.77, 83.03] },
  { id: 'shahjahanpur', name: 'Shahjahanpur', stateId: 'uttar-pradesh', division: 'Bareilly', centroid: [27.88, 79.91] },
  { id: 'shamli', name: 'Shamli', stateId: 'uttar-pradesh', division: 'Saharanpur', centroid: [29.45, 77.31] },
  { id: 'shravasti', name: 'Shravasti', stateId: 'uttar-pradesh', division: 'Devipatan', centroid: [27.51, 81.94] },
  { id: 'siddharthnagar', name: 'Siddharthnagar', stateId: 'uttar-pradesh', division: 'Basti', centroid: [27.25, 83.11] },
  { id: 'sitapur', name: 'Sitapur', stateId: 'uttar-pradesh', division: 'Lucknow', centroid: [27.57, 80.68] },
  { id: 'sonbhadra', name: 'Sonbhadra', stateId: 'uttar-pradesh', division: 'Mirzapur', centroid: [24.68, 83.06] },
  { id: 'sultanpur', name: 'Sultanpur', stateId: 'uttar-pradesh', division: 'Ayodhya', centroid: [26.26, 82.07] },
  { id: 'unnao', name: 'Unnao', stateId: 'uttar-pradesh', division: 'Lucknow', centroid: [26.54, 80.49] },
  { id: 'varanasi', name: 'Varanasi', stateId: 'uttar-pradesh', division: 'Varanasi', centroid: [25.32, 82.97] },
];

export const MAHARASHTRA_DISTRICTS: District[] = [
  { id: 'mumbai-city', name: 'Mumbai City', stateId: 'maharashtra', division: 'Konkan', centroid: [18.93, 72.83] },
  { id: 'mumbai-suburban', name: 'Mumbai Suburban', stateId: 'maharashtra', division: 'Konkan', centroid: [19.12, 72.88] },
  { id: 'pune', name: 'Pune', stateId: 'maharashtra', division: 'Pune', centroid: [18.52, 73.85] },
  { id: 'nagpur', name: 'Nagpur', stateId: 'maharashtra', division: 'Nagpur', centroid: [21.14, 79.08] },
  { id: 'thane', name: 'Thane', stateId: 'maharashtra', division: 'Konkan', centroid: [19.21, 72.97] },
  { id: 'nashik', name: 'Nashik', stateId: 'maharashtra', division: 'Nashik', centroid: [19.99, 73.78] },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', stateId: 'maharashtra', division: 'Aurangabad', centroid: [19.87, 75.34] },
  { id: 'solapur', name: 'Solapur', stateId: 'maharashtra', division: 'Pune', centroid: [17.65, 75.90] },
  { id: 'amravati', name: 'Amravati', stateId: 'maharashtra', division: 'Amravati', centroid: [20.93, 77.75] },
  { id: 'kolhapur', name: 'Kolhapur', stateId: 'maharashtra', division: 'Pune', centroid: [16.70, 74.24] },
];

export const KARNATAKA_DISTRICTS: District[] = [
  { id: 'bengaluru-urban', name: 'Bengaluru Urban', stateId: 'karnataka', division: 'Bengaluru', centroid: [12.97, 77.59] },
  { id: 'mysuru', name: 'Mysuru', stateId: 'karnataka', division: 'Mysuru', centroid: [12.29, 76.63] },
  { id: 'dharwad', name: 'Dharwad', stateId: 'karnataka', division: 'Belagavi', centroid: [15.45, 75.00] },
  { id: 'dakshina-kannada', name: 'Dakshina Kannada', stateId: 'karnataka', division: 'Mysuru', centroid: [12.86, 75.00] },
  { id: 'belagavi', name: 'Belagavi', stateId: 'karnataka', division: 'Belagavi', centroid: [15.84, 74.49] },
  { id: 'kalaburagi', name: 'Kalaburagi', stateId: 'karnataka', division: 'Kalaburagi', centroid: [17.32, 76.83] },
  { id: 'ballari', name: 'Ballari', stateId: 'karnataka', division: 'Kalaburagi', centroid: [15.13, 76.92] },
  { id: 'shivamogga', name: 'Shivamogga', stateId: 'karnataka', division: 'Bengaluru', centroid: [13.92, 75.56] },
];

export const GUJARAT_DISTRICTS: District[] = [
  { id: 'ahmedabad', name: 'Ahmedabad', stateId: 'gujarat', division: 'Ahmedabad', centroid: [23.02, 72.57] },
  { id: 'surat', name: 'Surat', stateId: 'gujarat', division: 'Surat', centroid: [21.17, 72.83] },
  { id: 'vadodara', name: 'Vadodara', stateId: 'gujarat', division: 'Vadodara', centroid: [22.30, 73.18] },
  { id: 'rajkot', name: 'Rajkot', stateId: 'gujarat', division: 'Rajkot', centroid: [22.30, 70.80] },
  { id: 'gandhinagar', name: 'Gandhinagar', stateId: 'gujarat', division: 'Gandhinagar', centroid: [23.21, 72.63] },
  { id: 'bhavnagar', name: 'Bhavnagar', stateId: 'gujarat', division: 'Bhavnagar', centroid: [21.76, 72.15] },
  { id: 'kutch', name: 'Kutch', stateId: 'gujarat', division: 'Bhuj', centroid: [23.73, 69.85] },
];

export const TAMIL_NADU_DISTRICTS: District[] = [
  { id: 'chennai', name: 'Chennai', stateId: 'tamil-nadu', division: 'Chennai', centroid: [13.08, 80.27] },
  { id: 'coimbatore', name: 'Coimbatore', stateId: 'tamil-nadu', division: 'Coimbatore', centroid: [11.01, 76.95] },
  { id: 'madurai', name: 'Madurai', stateId: 'tamil-nadu', division: 'Madurai', centroid: [9.92, 78.11] },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', stateId: 'tamil-nadu', division: 'Tiruchirappalli', centroid: [10.79, 78.70] },
  { id: 'salem', name: 'Salem', stateId: 'tamil-nadu', division: 'Salem', centroid: [11.66, 78.14] },
  { id: 'tirunelveli', name: 'Tirunelveli', stateId: 'tamil-nadu', division: 'Tirunelveli', centroid: [8.71, 77.75] },
];

export const BIHAR_DISTRICTS: District[] = [
  { id: 'patna', name: 'Patna', stateId: 'bihar', division: 'Patna', centroid: [25.59, 85.13] },
  { id: 'gaya', name: 'Gaya', stateId: 'bihar', division: 'Magadh', centroid: [24.79, 85.00] },
  { id: 'muzaffarpur', name: 'Muzaffarpur', stateId: 'bihar', division: 'Tirhut', centroid: [26.12, 85.39] },
  { id: 'bhagalpur', name: 'Bhagalpur', stateId: 'bihar', division: 'Bhagalpur', centroid: [25.24, 86.98] },
  { id: 'darbhanga', name: 'Darbhanga', stateId: 'bihar', division: 'Darbhanga', centroid: [26.15, 85.89] },
  { id: 'purnia', name: 'Purnia', stateId: 'bihar', division: 'Purnia', centroid: [25.77, 87.47] },
];

export const ALL_DISTRICTS: District[] = [
  ...UP_DISTRICTS,
  ...MAHARASHTRA_DISTRICTS,
  ...KARNATAKA_DISTRICTS,
  ...GUJARAT_DISTRICTS,
  ...TAMIL_NADU_DISTRICTS,
  ...BIHAR_DISTRICTS,
];

export const findDistrict = (id: string): District | undefined =>
  ALL_DISTRICTS.find((d) => d.id === id);

export const getDistrictsForState = (stateId: string): District[] =>
  ALL_DISTRICTS.filter((d) => d.stateId === stateId);

