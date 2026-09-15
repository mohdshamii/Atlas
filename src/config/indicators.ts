import type { IndicatorDefinition } from '@/types';

/**
 * The 11 locked top-level indicators for Version 1. Do not add additional
 * top-level indicators — see project spec. Each indicator carries its own
 * metric list, so the rest of the app (KPI cards, charts, tables) is driven
 * entirely by this config and never hardcodes metric names per page.
 */
export const INDICATORS: IndicatorDefinition[] = [
  {
    slug: 'demographics',
    name: 'Demographics',
    shortDescription: 'Population, growth, density, and urban/rural split.',
    description:
      'Population size, growth rate, density, sex ratio, and the urban–rural balance for each district over time.',
    icon: 'Users',
    accent: '#5B6EE8',
    metrics: [
      { key: 'population', label: 'Population', unit: 'people', description: 'Total resident population.', polarity: 'neutral', precision: 0 },
      { key: 'population_growth', label: 'Population Growth', unit: '%/yr', description: 'Annualized population growth rate.', polarity: 'neutral', precision: 2 },
      { key: 'population_density', label: 'Population Density', unit: 'people/km²', description: 'Persons per square kilometre.', polarity: 'neutral', precision: 0 },
      { key: 'sex_ratio', label: 'Sex Ratio', unit: 'females/1000 males', description: 'Number of females per 1,000 males.', polarity: 'positive', precision: 0 },
      { key: 'urban_population', label: 'Urban Population', unit: '%', description: 'Share of population living in urban areas.', polarity: 'neutral', precision: 1 },
      { key: 'rural_population', label: 'Rural Population', unit: '%', description: 'Share of population living in rural areas.', polarity: 'neutral', precision: 1 },
    ],
    suggestedOfficialSource: 'Census of India / Registrar General & Census Commissioner',
  },
  {
    slug: 'education',
    name: 'Education',
    shortDescription: 'Literacy, enrollment, schools, and teacher ratios.',
    description:
      'Literacy rate, school enrollment, number of schools, student-teacher ratios, and higher education access.',
    icon: 'GraduationCap',
    accent: '#2E9E8F',
    metrics: [
      { key: 'literacy_rate', label: 'Literacy Rate', unit: '%', description: 'Share of population aged 7+ who can read and write.', polarity: 'positive', precision: 1 },
      { key: 'school_enrollment', label: 'School Enrollment', unit: '%', description: 'Gross enrollment ratio for school-age children.', polarity: 'positive', precision: 1 },
      { key: 'schools', label: 'Schools', unit: 'count', description: 'Total number of recognized schools.', polarity: 'positive', precision: 0 },
      { key: 'student_teacher_ratio', label: 'Student-Teacher Ratio', unit: 'students/teacher', description: 'Average number of students per teacher.', polarity: 'negative', precision: 1 },
      { key: 'higher_ed_institutions', label: 'Higher Education Institutions', unit: 'count', description: 'Colleges and universities in the district.', polarity: 'positive', precision: 0 },
    ],
    suggestedOfficialSource: 'UDISE+ (Unified District Information System for Education)',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    shortDescription: 'Hospitals, PHCs, doctors, and maternal/child health.',
    description:
      'Healthcare infrastructure and outcomes including hospitals, primary health centres, medical staffing, and maternal/child indicators.',
    icon: 'HeartPulse',
    accent: '#C0526B',
    metrics: [
      { key: 'hospitals', label: 'Hospitals', unit: 'count', description: 'Total hospitals (public and private).', polarity: 'positive', precision: 0 },
      { key: 'phcs', label: 'Primary Health Centres', unit: 'count', description: 'Primary Health Centres (PHCs) in operation.', polarity: 'positive', precision: 0 },
      { key: 'doctors', label: 'Doctors', unit: 'per 10,000 people', description: 'Registered doctors per 10,000 population.', polarity: 'positive', precision: 2 },
      { key: 'hospital_beds', label: 'Hospital Beds', unit: 'per 10,000 people', description: 'Hospital beds available per 10,000 population.', polarity: 'positive', precision: 2 },
      { key: 'infant_mortality_rate', label: 'Infant Mortality Rate', unit: 'per 1,000 live births', description: 'Deaths under age 1 per 1,000 live births.', polarity: 'negative', precision: 1 },
      { key: 'institutional_deliveries', label: 'Institutional Deliveries', unit: '%', description: 'Share of births delivered in a health facility.', polarity: 'positive', precision: 1 },
    ],
    suggestedOfficialSource: 'Rural Health Statistics / Health Management Information System (HMIS)',
  },
  {
    slug: 'employment',
    name: 'Employment',
    shortDescription: 'Workforce participation, unemployment, and sectors.',
    description:
      'Labour force participation, employment and unemployment rates, and the distribution of workers across sectors.',
    icon: 'Briefcase',
    accent: '#D98E30',
    metrics: [
      { key: 'workforce_participation', label: 'Workforce Participation', unit: '%', description: 'Share of working-age population in the labour force.', polarity: 'positive', precision: 1 },
      { key: 'employment_rate', label: 'Employment Rate', unit: '%', description: 'Share of labour force that is employed.', polarity: 'positive', precision: 1 },
      { key: 'unemployment_rate', label: 'Unemployment Rate', unit: '%', description: 'Share of labour force actively seeking work.', polarity: 'negative', precision: 1 },
      { key: 'agriculture_workers', label: 'Agriculture Sector Workers', unit: '%', description: 'Share of workers employed in agriculture.', polarity: 'neutral', precision: 1 },
      { key: 'industry_workers', label: 'Industry Sector Workers', unit: '%', description: 'Share of workers employed in industry.', polarity: 'neutral', precision: 1 },
      { key: 'services_workers', label: 'Services Sector Workers', unit: '%', description: 'Share of workers employed in services.', polarity: 'neutral', precision: 1 },
    ],
    suggestedOfficialSource: 'Periodic Labour Force Survey (PLFS), NSSO',
  },
  {
    slug: 'crime',
    name: 'Crime',
    shortDescription: 'Reported cases, crime rate, and category breakdown.',
    description:
      'Reported cognizable crime cases, crime rate per population, category-wise breakdown, and year-over-year change.',
    icon: 'ShieldAlert',
    accent: '#C0526B',
    metrics: [
      { key: 'total_crime_cases', label: 'Total Crime Cases', unit: 'cases', description: 'Total reported cognizable crime cases.', polarity: 'negative', precision: 0 },
      { key: 'crime_rate', label: 'Crime Rate', unit: 'per 100,000 people', description: 'Reported cases per 100,000 population.', polarity: 'negative', precision: 1 },
      { key: 'violent_crime_share', label: 'Violent Crime Share', unit: '%', description: 'Share of cases classified as violent crime.', polarity: 'negative', precision: 1 },
      { key: 'property_crime_share', label: 'Property Crime Share', unit: '%', description: 'Share of cases classified as property crime.', polarity: 'negative', precision: 1 },
      { key: 'crime_yoy_change', label: 'Year-over-Year Change', unit: '%', description: 'Change in total cases versus the previous year.', polarity: 'negative', precision: 1 },
    ],
    suggestedOfficialSource: 'National Crime Records Bureau (NCRB)',
  },
  {
    slug: 'roads',
    name: 'Roads',
    shortDescription: 'Road length, density, and rural/urban connectivity.',
    description:
      'Total road network length, density relative to area, and the rural/urban connectivity split.',
    icon: 'Route',
    accent: '#4A5878',
    metrics: [
      { key: 'total_road_length', label: 'Total Road Length', unit: 'km', description: 'Total length of maintained roads.', polarity: 'positive', precision: 0 },
      { key: 'road_density', label: 'Road Density', unit: 'km/100 km²', description: 'Road length per 100 square kilometres of area.', polarity: 'positive', precision: 1 },
      { key: 'rural_roads', label: 'Rural Roads', unit: 'km', description: 'Length of rural road network (e.g. PMGSY roads).', polarity: 'positive', precision: 0 },
      { key: 'urban_roads', label: 'Urban Roads', unit: 'km', description: 'Length of urban road network.', polarity: 'positive', precision: 0 },
      { key: 'villages_connected', label: 'Villages with All-Weather Road Access', unit: '%', description: 'Share of villages connected by an all-weather road.', polarity: 'positive', precision: 1 },
    ],
    suggestedOfficialSource: 'Ministry of Road Transport and Highways (MoRTH) / PMGSY',
  },
  {
    slug: 'agriculture',
    name: 'Agriculture',
    shortDescription: 'Cropped area, major crops, production, irrigation.',
    description:
      'Net sown and cropped area, major crop mix, production volumes, irrigation coverage, and productivity.',
    icon: 'Wheat',
    accent: '#2E9E8F',
    metrics: [
      { key: 'gross_cropped_area', label: 'Gross Cropped Area', unit: 'thousand hectares', description: 'Total area sown across all crop seasons.', polarity: 'neutral', precision: 1 },
      { key: 'crop_production', label: 'Crop Production', unit: 'thousand tonnes', description: 'Total food-grain production.', polarity: 'positive', precision: 1 },
      { key: 'irrigation_coverage', label: 'Irrigation Coverage', unit: '%', description: 'Share of net sown area under irrigation.', polarity: 'positive', precision: 1 },
      { key: 'agricultural_productivity', label: 'Agricultural Productivity', unit: 'kg/hectare', description: 'Average yield per hectare (food-grains).', polarity: 'positive', precision: 0 },
      { key: 'farm_holdings', label: 'Operational Land Holdings', unit: 'thousand holdings', description: 'Number of operational agricultural holdings.', polarity: 'neutral', precision: 1 },
    ],
    suggestedOfficialSource: 'Directorate of Economics & Statistics, Dept. of Agriculture',
  },
  {
    slug: 'water',
    name: 'Water',
    shortDescription: 'Drinking water access, groundwater, and supply.',
    description:
      'Access to safe drinking water, groundwater levels, irrigation water availability, and supply infrastructure.',
    icon: 'Droplets',
    accent: '#5B6EE8',
    metrics: [
      { key: 'drinking_water_access', label: 'Drinking Water Access', unit: '%', description: 'Households with access to safe drinking water.', polarity: 'positive', precision: 1 },
      { key: 'piped_water_coverage', label: 'Piped Water Coverage', unit: '%', description: 'Households with a piped water connection.', polarity: 'positive', precision: 1 },
      { key: 'groundwater_level', label: 'Groundwater Level', unit: 'metres below ground', description: 'Average depth to groundwater (lower is better).', polarity: 'negative', precision: 1 },
      { key: 'groundwater_extraction', label: 'Groundwater Extraction Stage', unit: '%', description: 'Groundwater extraction as a share of annual recharge.', polarity: 'negative', precision: 1 },
      { key: 'water_bodies_rejuvenated', label: 'Water Bodies Rejuvenated', unit: 'count', description: 'Water bodies restored or rejuvenated during the year.', polarity: 'positive', precision: 0 },
    ],
    suggestedOfficialSource: 'Jal Jeevan Mission / Central Ground Water Board (CGWB)',
  },
  {
    slug: 'electricity',
    name: 'Electricity',
    shortDescription: 'Electrification, connections, and availability.',
    description:
      'Household electrification, new connections, average power availability, and consumption.',
    icon: 'Zap',
    accent: '#D98E30',
    metrics: [
      { key: 'household_electrification', label: 'Household Electrification', unit: '%', description: 'Share of households with an electricity connection.', polarity: 'positive', precision: 1 },
      { key: 'new_connections', label: 'New Connections', unit: 'thousand connections', description: 'New electricity connections issued during the year.', polarity: 'positive', precision: 1 },
      { key: 'power_availability', label: 'Power Availability', unit: 'hours/day', description: 'Average hours of power supply per day.', polarity: 'positive', precision: 1 },
      { key: 'per_capita_consumption', label: 'Per-Capita Consumption', unit: 'kWh/year', description: 'Average annual electricity consumption per person.', polarity: 'neutral', precision: 0 },
      { key: 'transmission_losses', label: 'Transmission & Distribution Losses', unit: '%', description: 'Share of electricity lost in transmission and distribution.', polarity: 'negative', precision: 1 },
    ],
    suggestedOfficialSource: 'Central Electricity Authority (CEA) / State Discom reports',
  },
  {
    slug: 'government-schemes',
    name: 'Government Schemes',
    shortDescription: 'Beneficiaries, coverage, and implementation status.',
    description:
      'Coverage and delivery of major public welfare and development schemes, including beneficiary counts and implementation status.',
    icon: 'Landmark',
    accent: '#5B6EE8',
    metrics: [
      { key: 'scheme_beneficiaries', label: 'Total Beneficiaries', unit: 'people', description: 'Individuals enrolled across tracked schemes.', polarity: 'positive', precision: 0 },
      { key: 'scheme_coverage', label: 'Eligible Population Coverage', unit: '%', description: 'Share of the eligible population reached by tracked schemes.', polarity: 'positive', precision: 1 },
      { key: 'scheme_expenditure', label: 'Scheme Expenditure', unit: '₹ crore', description: 'Total expenditure disbursed under tracked schemes.', polarity: 'neutral', precision: 1 },
      { key: 'active_schemes', label: 'Active Schemes', unit: 'count', description: 'Number of schemes with active implementation in the district.', polarity: 'neutral', precision: 0 },
    ],
    suggestedOfficialSource: 'Respective scheme MIS dashboards (state & central government)',
  },
  {
    slug: 'environment',
    name: 'Environment',
    shortDescription: 'Forest cover, air/water quality, and waste management.',
    description:
      'Forest and green cover, air and water quality indicators where available, and solid waste management performance.',
    icon: 'Leaf',
    accent: '#2E9E8F',
    metrics: [
      { key: 'forest_cover', label: 'Forest Cover', unit: '%', description: 'Share of geographical area under forest cover.', polarity: 'positive', precision: 1 },
      { key: 'air_quality_index', label: 'Average Air Quality Index', unit: 'AQI', description: 'Annual average AQI (lower is better).', polarity: 'negative', precision: 0 },
      { key: 'waste_processed', label: 'Solid Waste Processed', unit: '%', description: 'Share of municipal solid waste scientifically processed.', polarity: 'positive', precision: 1 },
      { key: 'water_quality_index', label: 'Water Quality Index', unit: 'index', description: 'Composite surface water quality index (higher is better).', polarity: 'positive', precision: 0 },
      { key: 'tree_cover_change', label: 'Tree Cover Change', unit: '%/yr', description: 'Annual change in tree cover outside recorded forest area.', polarity: 'positive', precision: 2 },
    ],
    suggestedOfficialSource: 'India State of Forest Report (FSI) / Central Pollution Control Board (CPCB)',
  },
];

export const findIndicator = (slug: string) =>
  INDICATORS.find((i) => i.slug === slug);

export const INDICATOR_SLUGS = INDICATORS.map((i) => i.slug);
