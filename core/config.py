"""
India Data Atlas - Configuration & Domain Reference
Contains the 11 locked civic indicators, multi-state definitions, district geometries,
metric constraints, and official dataset provenance mappings.
"""

from typing import Dict, List, Optional, Any

YEAR_RANGE = {"start": 2015, "end": 2024}
DEFAULT_YEAR = 2024
YEARS = list(range(YEAR_RANGE["start"], YEAR_RANGE["end"] + 1))

def is_valid_year(year: int) -> bool:
    return YEAR_RANGE["start"] <= year <= YEAR_RANGE["end"]

# ---------------------------------------------------------------------------
# 11 Locked Indicators & Detailed Metric Schemas
# ---------------------------------------------------------------------------
INDICATORS: List[Dict[str, Any]] = [
    {
        "slug": "demographics",
        "name": "Demographics",
        "shortDescription": "Population, growth, density, and urban/rural split.",
        "description": "Population size, growth rate, density, sex ratio, and the urban–rural balance for each district over time.",
        "icon": "users",
        "accent": "#5B6EE8",
        "metrics": [
            {"key": "population", "label": "Population", "unit": "people", "description": "Total resident population.", "polarity": "neutral", "precision": 0},
            {"key": "population_growth", "label": "Population Growth", "unit": "%/yr", "description": "Annualized population growth rate.", "polarity": "neutral", "precision": 2},
            {"key": "population_density", "label": "Population Density", "unit": "people/km²", "description": "Persons per square kilometre.", "polarity": "neutral", "precision": 0},
            {"key": "sex_ratio", "label": "Sex Ratio", "unit": "females/1000 males", "description": "Number of females per 1,000 males.", "polarity": "positive", "precision": 0},
            {"key": "urban_population", "label": "Urban Population", "unit": "%", "description": "Share of population living in urban areas.", "polarity": "neutral", "precision": 1},
            {"key": "rural_population", "label": "Rural Population", "unit": "%", "description": "Share of population living in rural areas.", "polarity": "neutral", "precision": 1},
        ],
        "suggestedOfficialSource": "Census of India / Registrar General & Census Commissioner",
    },
    {
        "slug": "education",
        "name": "Education",
        "shortDescription": "Literacy, enrollment, schools, and teacher ratios.",
        "description": "Literacy rate, school enrollment, number of schools, student-teacher ratios, and higher education access.",
        "icon": "graduation-cap",
        "accent": "#2E9E8F",
        "metrics": [
            {"key": "literacy_rate", "label": "Literacy Rate", "unit": "%", "description": "Share of population aged 7+ who can read and write.", "polarity": "positive", "precision": 1},
            {"key": "school_enrollment", "label": "School Enrollment", "unit": "%", "description": "Gross enrollment ratio for school-age children.", "polarity": "positive", "precision": 1},
            {"key": "schools", "label": "Schools", "unit": "count", "description": "Total number of recognized schools.", "polarity": "positive", "precision": 0},
            {"key": "student_teacher_ratio", "label": "Student-Teacher Ratio", "unit": "students/teacher", "description": "Average number of students per teacher.", "polarity": "negative", "precision": 1},
            {"key": "higher_ed_institutions", "label": "Higher Education Institutions", "unit": "count", "description": "Colleges and universities in the district.", "polarity": "positive", "precision": 0},
        ],
        "suggestedOfficialSource": "UDISE+ (Unified District Information System for Education)",
    },
    {
        "slug": "healthcare",
        "name": "Healthcare",
        "shortDescription": "Hospitals, PHCs, doctors, and maternal/child health.",
        "description": "Healthcare infrastructure and outcomes including hospitals, primary health centres, medical staffing, and maternal/child indicators.",
        "icon": "heart-pulse",
        "accent": "#C0526B",
        "metrics": [
            {"key": "hospitals", "label": "Hospitals", "unit": "count", "description": "Total hospitals (public and private).", "polarity": "positive", "precision": 0},
            {"key": "phcs", "label": "Primary Health Centres", "unit": "count", "description": "Primary Health Centres (PHCs) in operation.", "polarity": "positive", "precision": 0},
            {"key": "doctors", "label": "Doctors", "unit": "per 10,000 people", "description": "Registered doctors per 10,000 population.", "polarity": "positive", "precision": 2},
            {"key": "hospital_beds", "label": "Hospital Beds", "unit": "per 10,000 people", "description": "Hospital beds available per 10,000 population.", "polarity": "positive", "precision": 2},
            {"key": "infant_mortality_rate", "label": "Infant Mortality Rate", "unit": "per 1,000 live births", "description": "Deaths under age 1 per 1,000 live births.", "polarity": "negative", "precision": 1},
            {"key": "institutional_deliveries", "label": "Institutional Deliveries", "unit": "%", "description": "Share of births delivered in a health facility.", "polarity": "positive", "precision": 1},
        ],
        "suggestedOfficialSource": "Rural Health Statistics / Health Management Information System (HMIS)",
    },
    {
        "slug": "employment",
        "name": "Employment",
        "shortDescription": "Workforce participation, unemployment, and sectors.",
        "description": "Labour force participation, employment and unemployment rates, and the distribution of workers across sectors.",
        "icon": "briefcase",
        "accent": "#D98E30",
        "metrics": [
            {"key": "workforce_participation", "label": "Workforce Participation", "unit": "%", "description": "Share of working-age population in the labour force.", "polarity": "positive", "precision": 1},
            {"key": "employment_rate", "label": "Employment Rate", "unit": "%", "description": "Share of labour force that is employed.", "polarity": "positive", "precision": 1},
            {"key": "unemployment_rate", "label": "Unemployment Rate", "unit": "%", "description": "Share of labour force actively seeking work.", "polarity": "negative", "precision": 1},
            {"key": "agriculture_workers", "label": "Agriculture Sector Workers", "unit": "%", "description": "Share of workers employed in agriculture.", "polarity": "neutral", "precision": 1},
            {"key": "industry_workers", "label": "Industry Sector Workers", "unit": "%", "description": "Share of workers employed in industry.", "polarity": "neutral", "precision": 1},
            {"key": "services_workers", "label": "Services Sector Workers", "unit": "%", "description": "Share of workers employed in services.", "polarity": "neutral", "precision": 1},
        ],
        "suggestedOfficialSource": "Periodic Labour Force Survey (PLFS), NSSO",
    },
    {
        "slug": "crime",
        "name": "Crime",
        "shortDescription": "Reported cases, crime rate, and category breakdown.",
        "description": "Reported cognizable crime cases, crime rate per population, category-wise breakdown, and year-over-year change.",
        "icon": "shield-alert",
        "accent": "#C0526B",
        "metrics": [
            {"key": "total_crime_cases", "label": "Total Crime Cases", "unit": "cases", "description": "Total reported cognizable crime cases.", "polarity": "negative", "precision": 0},
            {"key": "crime_rate", "label": "Crime Rate", "unit": "per 100,000 people", "description": "Reported cases per 100,000 population.", "polarity": "negative", "precision": 1},
            {"key": "violent_crime_share", "label": "Violent Crime Share", "unit": "%", "description": "Share of cases classified as violent crime.", "polarity": "negative", "precision": 1},
            {"key": "property_crime_share", "label": "Property Crime Share", "unit": "%", "description": "Share of cases classified as property crime.", "polarity": "negative", "precision": 1},
            {"key": "crime_yoy_change", "label": "Year-over-Year Change", "unit": "%", "description": "Change in total cases versus the previous year.", "polarity": "negative", "precision": 1},
        ],
        "suggestedOfficialSource": "National Crime Records Bureau (NCRB)",
    },
    {
        "slug": "roads",
        "name": "Roads",
        "shortDescription": "Road length, density, and rural/urban connectivity.",
        "description": "Total road network length, density relative to area, and the rural/urban connectivity split.",
        "icon": "route",
        "accent": "#4A5878",
        "metrics": [
            {"key": "total_road_length", "label": "Total Road Length", "unit": "km", "description": "Total length of maintained roads.", "polarity": "positive", "precision": 0},
            {"key": "road_density", "label": "Road Density", "unit": "km/100 km²", "description": "Road length per 100 square kilometres of area.", "polarity": "positive", "precision": 1},
            {"key": "rural_roads", "label": "Rural Roads", "unit": "km", "description": "Length of rural road network (e.g. PMGSY roads).", "polarity": "positive", "precision": 0},
            {"key": "urban_roads", "label": "Urban Roads", "unit": "km", "description": "Length of urban road network.", "polarity": "positive", "precision": 0},
            {"key": "villages_connected", "label": "Villages with All-Weather Road Access", "unit": "%", "description": "Share of villages connected by an all-weather road.", "polarity": "positive", "precision": 1},
        ],
        "suggestedOfficialSource": "Ministry of Road Transport and Highways (MoRTH) / PMGSY",
    },
    {
        "slug": "agriculture",
        "name": "Agriculture",
        "shortDescription": "Cropped area, major crops, production, irrigation.",
        "description": "Net sown and cropped area, major crop mix, production volumes, irrigation coverage, and productivity.",
        "icon": "wheat",
        "accent": "#2E9E8F",
        "metrics": [
            {"key": "gross_cropped_area", "label": "Gross Cropped Area", "unit": "thousand hectares", "description": "Total area sown across all crop seasons.", "polarity": "neutral", "precision": 1},
            {"key": "crop_production", "label": "Crop Production", "unit": "thousand tonnes", "description": "Total food-grain production.", "polarity": "positive", "precision": 1},
            {"key": "irrigation_coverage", "label": "Irrigation Coverage", "unit": "%", "description": "Share of net sown area under irrigation.", "polarity": "positive", "precision": 1},
            {"key": "agricultural_productivity", "label": "Agricultural Productivity", "unit": "kg/hectare", "description": "Average yield per hectare (food-grains).", "polarity": "positive", "precision": 0},
            {"key": "farm_holdings", "label": "Operational Land Holdings", "unit": "thousand holdings", "description": "Number of operational agricultural holdings.", "polarity": "neutral", "precision": 1},
        ],
        "suggestedOfficialSource": "Directorate of Economics & Statistics, Dept. of Agriculture",
    },
    {
        "slug": "water",
        "name": "Water",
        "shortDescription": "Drinking water access, groundwater, and supply.",
        "description": "Access to safe drinking water, groundwater levels, irrigation water availability, and supply infrastructure.",
        "icon": "droplets",
        "accent": "#5B6EE8",
        "metrics": [
            {"key": "drinking_water_access", "label": "Drinking Water Access", "unit": "%", "description": "Households with access to safe drinking water.", "polarity": "positive", "precision": 1},
            {"key": "piped_water_coverage", "label": "Piped Water Coverage", "unit": "%", "description": "Households with a piped water connection.", "polarity": "positive", "precision": 1},
            {"key": "groundwater_level", "label": "Groundwater Level", "unit": "metres below ground", "description": "Average depth to groundwater (lower is better).", "polarity": "negative", "precision": 1},
            {"key": "groundwater_extraction", "label": "Groundwater Extraction Stage", "unit": "%", "description": "Groundwater extraction as a share of annual recharge.", "polarity": "negative", "precision": 1},
            {"key": "water_bodies_rejuvenated", "label": "Water Bodies Rejuvenated", "unit": "count", "description": "Water bodies restored or rejuvenated during the year.", "polarity": "positive", "precision": 0},
        ],
        "suggestedOfficialSource": "Jal Jeevan Mission / Central Ground Water Board (CGWB)",
    },
    {
        "slug": "electricity",
        "name": "Electricity",
        "shortDescription": "Electrification, connections, and availability.",
        "description": "Household electrification, new connections, average power availability, and consumption.",
        "icon": "zap",
        "accent": "#D98E30",
        "metrics": [
            {"key": "household_electrification", "label": "Household Electrification", "unit": "%", "description": "Share of households with an electricity connection.", "polarity": "positive", "precision": 1},
            {"key": "new_connections", "label": "New Connections", "unit": "thousand connections", "description": "New electricity connections issued during the year.", "polarity": "positive", "precision": 1},
            {"key": "power_availability", "label": "Power Availability", "unit": "hours/day", "description": "Average hours of power supply per day.", "polarity": "positive", "precision": 1},
            {"key": "per_capita_consumption", "label": "Per-Capita Consumption", "unit": "kWh/year", "description": "Average annual electricity consumption per person.", "polarity": "neutral", "precision": 0},
            {"key": "transmission_losses", "label": "Transmission & Distribution Losses", "unit": "%", "description": "Share of electricity lost in transmission and distribution.", "polarity": "negative", "precision": 1},
        ],
        "suggestedOfficialSource": "Central Electricity Authority (CEA) / State Discom reports",
    },
    {
        "slug": "government-schemes",
        "name": "Government Schemes",
        "shortDescription": "Beneficiaries, coverage, and implementation status.",
        "description": "Coverage and delivery of major public welfare and development schemes, including beneficiary counts and implementation status.",
        "icon": "landmark",
        "accent": "#5B6EE8",
        "metrics": [
            {"key": "scheme_beneficiaries", "label": "Total Beneficiaries", "unit": "people", "description": "Individuals enrolled across tracked schemes.", "polarity": "positive", "precision": 0},
            {"key": "scheme_coverage", "label": "Eligible Population Coverage", "unit": "%", "description": "Share of the eligible population reached by tracked schemes.", "polarity": "positive", "precision": 1},
            {"key": "scheme_expenditure", "label": "Scheme Expenditure", "unit": "₹ crore", "description": "Total expenditure disbursed under tracked schemes.", "polarity": "neutral", "precision": 1},
            {"key": "active_schemes", "label": "Active Schemes", "unit": "count", "description": "Number of schemes with active implementation in the district.", "polarity": "neutral", "precision": 0},
        ],
        "suggestedOfficialSource": "Respective scheme MIS dashboards (state & central government)",
    },
    {
        "slug": "environment",
        "name": "Environment",
        "shortDescription": "Forest cover, air/water quality, and waste management.",
        "description": "Forest and green cover, air and water quality indicators where available, and solid waste management performance.",
        "icon": "leaf",
        "accent": "#2E9E8F",
        "metrics": [
            {"key": "forest_cover", "label": "Forest Cover", "unit": "%", "description": "Share of geographical area under forest cover.", "polarity": "positive", "precision": 1},
            {"key": "air_quality_index", "label": "Average Air Quality Index", "unit": "AQI", "description": "Annual average AQI (lower is better).", "polarity": "negative", "precision": 0},
            {"key": "waste_processed", "label": "Solid Waste Processed", "unit": "%", "description": "Share of municipal solid waste scientifically processed.", "polarity": "positive", "precision": 1},
            {"key": "water_quality_index", "label": "Water Quality Index", "unit": "index", "description": "Composite surface water quality index (higher is better).", "polarity": "positive", "precision": 0},
            {"key": "tree_cover_change", "label": "Tree Cover Change", "unit": "%/yr", "description": "Annual change in tree cover outside recorded forest area.", "polarity": "positive", "precision": 2},
        ],
        "suggestedOfficialSource": "India State of Forest Report (FSI) / Central Pollution Control Board (CPCB)",
    },
]

INDICATOR_DICT = {ind["slug"]: ind for ind in INDICATORS}
INDICATOR_SLUGS = [ind["slug"] for ind in INDICATORS]

def find_indicator(slug: str) -> Optional[Dict[str, Any]]:
    return INDICATOR_DICT.get(slug)

# ---------------------------------------------------------------------------
# Metric Realistic Calibration Ranges
# ---------------------------------------------------------------------------
METRIC_RANGES: Dict[str, List[float]] = {
    "population": [800000, 5200000],
    "population_growth": [0.4, 2.6],
    "population_density": [400, 1900],
    "sex_ratio": [858, 985],
    "urban_population": [10, 55],
    "rural_population": [45, 90],

    "literacy_rate": [54, 86],
    "school_enrollment": [70, 99],
    "schools": [1200, 4600],
    "student_teacher_ratio": [20, 55],
    "higher_ed_institutions": [10, 120],

    "hospitals": [15, 120],
    "phcs": [20, 150],
    "doctors": [2, 12],
    "hospital_beds": [3, 20],
    "infant_mortality_rate": [24, 68],
    "institutional_deliveries": [55, 98],

    "workforce_participation": [35, 55],
    "employment_rate": [88, 97],
    "unemployment_rate": [3, 12],
    "agriculture_workers": [30, 65],
    "industry_workers": [10, 30],
    "services_workers": [15, 40],

    "total_crime_cases": [2000, 15000],
    "crime_rate": [100, 500],
    "violent_crime_share": [10, 30],
    "property_crime_share": [20, 45],
    "crime_yoy_change": [-15, 15],

    "total_road_length": [2000, 9000],
    "road_density": [80, 220],
    "rural_roads": [1500, 7000],
    "urban_roads": [300, 2000],
    "villages_connected": [70, 99],

    "gross_cropped_area": [150, 500],
    "crop_production": [400, 1800],
    "irrigation_coverage": [55, 95],
    "agricultural_productivity": [1800, 3200],
    "farm_holdings": [150, 600],

    "drinking_water_access": [70, 99],
    "piped_water_coverage": [30, 90],
    "groundwater_level": [5, 25],
    "groundwater_extraction": [50, 130],
    "water_bodies_rejuvenated": [5, 80],

    "household_electrification": [75, 100],
    "new_connections": [5, 60],
    "power_availability": [14, 23],
    "per_capita_consumption": [400, 1400],
    "transmission_losses": [10, 30],

    "scheme_beneficiaries": [50000, 800000],
    "scheme_coverage": [40, 95],
    "scheme_expenditure": [20, 500],
    "active_schemes": [8, 30],

    "forest_cover": [2, 20],
    "air_quality_index": [90, 250],
    "waste_processed": [30, 90],
    "water_quality_index": [40, 85],
    "tree_cover_change": [-1, 2],
}

FORCE_UPWARD_TREND = {
    "population",
    "population_density",
    "per_capita_consumption",
    "scheme_expenditure",
    "scheme_beneficiaries",
    "crop_production",
    "new_connections",
    "water_bodies_rejuvenated",
    "forest_cover",
    "urban_population",
}

# ---------------------------------------------------------------------------
# Districts Master Catalog (All 75 UP Districts + Key Multi-State Hubs)
# ---------------------------------------------------------------------------
UP_DISTRICTS: List[Dict[str, Any]] = [
    {"id": "agra", "name": "Agra", "stateId": "uttar-pradesh", "division": "Agra", "centroid": [27.18, 78.02]},
    {"id": "aligarh", "name": "Aligarh", "stateId": "uttar-pradesh", "division": "Aligarh", "centroid": [27.89, 78.08]},
    {"id": "ambedkar-nagar", "name": "Ambedkar Nagar", "stateId": "uttar-pradesh", "division": "Ayodhya", "centroid": [26.40, 82.20]},
    {"id": "amethi", "name": "Amethi", "stateId": "uttar-pradesh", "division": "Ayodhya", "centroid": [26.16, 81.81]},
    {"id": "amroha", "name": "Amroha", "stateId": "uttar-pradesh", "division": "Moradabad", "centroid": [28.90, 78.47]},
    {"id": "auraiya", "name": "Auraiya", "stateId": "uttar-pradesh", "division": "Kanpur", "centroid": [26.47, 79.51]},
    {"id": "ayodhya", "name": "Ayodhya", "stateId": "uttar-pradesh", "division": "Ayodhya", "centroid": [26.80, 82.20]},
    {"id": "azamgarh", "name": "Azamgarh", "stateId": "uttar-pradesh", "division": "Azamgarh", "centroid": [26.07, 83.19]},
    {"id": "baghpat", "name": "Baghpat", "stateId": "uttar-pradesh", "division": "Meerut", "centroid": [28.95, 77.22]},
    {"id": "bahraich", "name": "Bahraich", "stateId": "uttar-pradesh", "division": "Devipatan", "centroid": [27.57, 81.60]},
    {"id": "ballia", "name": "Ballia", "stateId": "uttar-pradesh", "division": "Azamgarh", "centroid": [25.76, 84.15]},
    {"id": "balrampur", "name": "Balrampur", "stateId": "uttar-pradesh", "division": "Devipatan", "centroid": [27.43, 82.18]},
    {"id": "banda", "name": "Banda", "stateId": "uttar-pradesh", "division": "Chitrakoot", "centroid": [25.48, 80.34]},
    {"id": "barabanki", "name": "Barabanki", "stateId": "uttar-pradesh", "division": "Ayodhya", "centroid": [26.93, 81.19]},
    {"id": "bareilly", "name": "Bareilly", "stateId": "uttar-pradesh", "division": "Bareilly", "centroid": [28.35, 79.42]},
    {"id": "basti", "name": "Basti", "stateId": "uttar-pradesh", "division": "Basti", "centroid": [26.79, 82.76]},
    {"id": "bhadohi", "name": "Bhadohi", "stateId": "uttar-pradesh", "division": "Varanasi", "centroid": [25.38, 82.57]},
    {"id": "bijnor", "name": "Bijnor", "stateId": "uttar-pradesh", "division": "Moradabad", "centroid": [29.37, 78.13]},
    {"id": "budaun", "name": "Budaun", "stateId": "uttar-pradesh", "division": "Bareilly", "centroid": [28.03, 79.12]},
    {"id": "bulandshahr", "name": "Bulandshahr", "stateId": "uttar-pradesh", "division": "Meerut", "centroid": [28.40, 77.85]},
    {"id": "chandauli", "name": "Chandauli", "stateId": "uttar-pradesh", "division": "Varanasi", "centroid": [25.26, 83.27]},
    {"id": "chitrakoot", "name": "Chitrakoot", "stateId": "uttar-pradesh", "division": "Chitrakoot", "centroid": [25.20, 80.87]},
    {"id": "deoria", "name": "Deoria", "stateId": "uttar-pradesh", "division": "Gorakhpur", "centroid": [26.50, 83.79]},
    {"id": "etah", "name": "Etah", "stateId": "uttar-pradesh", "division": "Aligarh", "centroid": [27.63, 78.66]},
    {"id": "etawah", "name": "Etawah", "stateId": "uttar-pradesh", "division": "Kanpur", "centroid": [26.78, 79.02]},
    {"id": "farrukhabad", "name": "Farrukhabad", "stateId": "uttar-pradesh", "division": "Kanpur", "centroid": [27.39, 79.58]},
    {"id": "fatehpur", "name": "Fatehpur", "stateId": "uttar-pradesh", "division": "Allahabad", "centroid": [25.93, 80.81]},
    {"id": "firozabad", "name": "Firozabad", "stateId": "uttar-pradesh", "division": "Agra", "centroid": [27.15, 78.40]},
    {"id": "gautam-buddha-nagar", "name": "Gautam Buddha Nagar", "stateId": "uttar-pradesh", "division": "Meerut", "centroid": [28.40, 77.50]},
    {"id": "ghaziabad", "name": "Ghaziabad", "stateId": "uttar-pradesh", "division": "Meerut", "centroid": [28.67, 77.43]},
    {"id": "ghazipur", "name": "Ghazipur", "stateId": "uttar-pradesh", "division": "Varanasi", "centroid": [25.58, 83.58]},
    {"id": "gonda", "name": "Gonda", "stateId": "uttar-pradesh", "division": "Devipatan", "centroid": [27.13, 81.96]},
    {"id": "gorakhpur", "name": "Gorakhpur", "stateId": "uttar-pradesh", "division": "Gorakhpur", "centroid": [26.76, 83.37]},
    {"id": "hamirpur", "name": "Hamirpur", "stateId": "uttar-pradesh", "division": "Chitrakoot", "centroid": [25.96, 80.15]},
    {"id": "hapur", "name": "Hapur", "stateId": "uttar-pradesh", "division": "Meerut", "centroid": [28.73, 77.78]},
    {"id": "hardoi", "name": "Hardoi", "stateId": "uttar-pradesh", "division": "Lucknow", "centroid": [27.42, 80.13]},
    {"id": "hathras", "name": "Hathras", "stateId": "uttar-pradesh", "division": "Aligarh", "centroid": [27.60, 78.05]},
    {"id": "jalaun", "name": "Jalaun", "stateId": "uttar-pradesh", "division": "Jhansi", "centroid": [26.15, 79.35]},
    {"id": "jaunpur", "name": "Jaunpur", "stateId": "uttar-pradesh", "division": "Varanasi", "centroid": [25.75, 82.68]},
    {"id": "jhansi", "name": "Jhansi", "stateId": "uttar-pradesh", "division": "Jhansi", "centroid": [25.45, 78.58]},
    {"id": "kannauj", "name": "Kannauj", "stateId": "uttar-pradesh", "division": "Kanpur", "centroid": [27.05, 79.92]},
    {"id": "kanpur-dehat", "name": "Kanpur Dehat", "stateId": "uttar-pradesh", "division": "Kanpur", "centroid": [26.46, 80.10]},
    {"id": "kanpur-nagar", "name": "Kanpur Nagar", "stateId": "uttar-pradesh", "division": "Kanpur", "centroid": [26.45, 80.33]},
    {"id": "kasganj", "name": "Kasganj", "stateId": "uttar-pradesh", "division": "Aligarh", "centroid": [27.81, 78.65]},
    {"id": "kaushambi", "name": "Kaushambi", "stateId": "uttar-pradesh", "division": "Allahabad", "centroid": [25.53, 81.38]},
    {"id": "kushinagar", "name": "Kushinagar", "stateId": "uttar-pradesh", "division": "Gorakhpur", "centroid": [26.74, 83.89]},
    {"id": "lakhimpur-kheri", "name": "Lakhimpur Kheri", "stateId": "uttar-pradesh", "division": "Lucknow", "centroid": [27.95, 80.78]},
    {"id": "lalitpur", "name": "Lalitpur", "stateId": "uttar-pradesh", "division": "Jhansi", "centroid": [24.69, 78.41]},
    {"id": "lucknow", "name": "Lucknow", "stateId": "uttar-pradesh", "division": "Lucknow", "centroid": [26.85, 80.95]},
    {"id": "maharajganj", "name": "Maharajganj", "stateId": "uttar-pradesh", "division": "Gorakhpur", "centroid": [27.15, 83.56]},
    {"id": "mahoba", "name": "Mahoba", "stateId": "uttar-pradesh", "division": "Chitrakoot", "centroid": [25.29, 79.87]},
    {"id": "mainpuri", "name": "Mainpuri", "stateId": "uttar-pradesh", "division": "Agra", "centroid": [27.23, 79.02]},
    {"id": "mathura", "name": "Mathura", "stateId": "uttar-pradesh", "division": "Agra", "centroid": [27.49, 77.67]},
    {"id": "mau", "name": "Mau", "stateId": "uttar-pradesh", "division": "Azamgarh", "centroid": [25.94, 83.56]},
    {"id": "meerut", "name": "Meerut", "stateId": "uttar-pradesh", "division": "Meerut", "centroid": [28.98, 77.71]},
    {"id": "mirzapur", "name": "Mirzapur", "stateId": "uttar-pradesh", "division": "Mirzapur", "centroid": [25.15, 82.57]},
    {"id": "moradabad", "name": "Moradabad", "stateId": "uttar-pradesh", "division": "Moradabad", "centroid": [28.84, 78.78]},
    {"id": "muzaffarnagar", "name": "Muzaffarnagar", "stateId": "uttar-pradesh", "division": "Saharanpur", "centroid": [29.47, 77.70]},
    {"id": "pilibhit", "name": "Pilibhit", "stateId": "uttar-pradesh", "division": "Bareilly", "centroid": [28.63, 79.80]},
    {"id": "pratapgarh", "name": "Pratapgarh", "stateId": "uttar-pradesh", "division": "Allahabad", "centroid": [25.90, 81.99]},
    {"id": "prayagraj", "name": "Prayagraj", "stateId": "uttar-pradesh", "division": "Allahabad", "centroid": [25.44, 81.85]},
    {"id": "raebareli", "name": "Raebareli", "stateId": "uttar-pradesh", "division": "Lucknow", "centroid": [26.23, 81.23]},
    {"id": "rampur", "name": "Rampur", "stateId": "uttar-pradesh", "division": "Moradabad", "centroid": [28.80, 79.03]},
    {"id": "saharanpur", "name": "Saharanpur", "stateId": "uttar-pradesh", "division": "Saharanpur", "centroid": [29.97, 77.55]},
    {"id": "sambhal", "name": "Sambhal", "stateId": "uttar-pradesh", "division": "Moradabad", "centroid": [28.58, 78.57]},
    {"id": "sant-kabir-nagar", "name": "Sant Kabir Nagar", "stateId": "uttar-pradesh", "division": "Basti", "centroid": [26.77, 83.03]},
    {"id": "shahjahanpur", "name": "Shahjahanpur", "stateId": "uttar-pradesh", "division": "Bareilly", "centroid": [27.88, 79.91]},
    {"id": "shamli", "name": "Shamli", "stateId": "uttar-pradesh", "division": "Saharanpur", "centroid": [29.45, 77.31]},
    {"id": "shravasti", "name": "Shravasti", "stateId": "uttar-pradesh", "division": "Devipatan", "centroid": [27.51, 81.94]},
    {"id": "siddharthnagar", "name": "Siddharthnagar", "stateId": "uttar-pradesh", "division": "Basti", "centroid": [27.25, 83.11]},
    {"id": "sitapur", "name": "Sitapur", "stateId": "uttar-pradesh", "division": "Lucknow", "centroid": [27.57, 80.68]},
    {"id": "sonbhadra", "name": "Sonbhadra", "stateId": "uttar-pradesh", "division": "Mirzapur", "centroid": [24.68, 83.06]},
    {"id": "sultanpur", "name": "Sultanpur", "stateId": "uttar-pradesh", "division": "Ayodhya", "centroid": [26.26, 82.07]},
    {"id": "unnao", "name": "Unnao", "stateId": "uttar-pradesh", "division": "Lucknow", "centroid": [26.54, 80.49]},
    {"id": "varanasi", "name": "Varanasi", "stateId": "uttar-pradesh", "division": "Varanasi", "centroid": [25.32, 82.97]},
]

MAHARASHTRA_DISTRICTS: List[Dict[str, Any]] = [
    {"id": "mumbai-city", "name": "Mumbai City", "stateId": "maharashtra", "division": "Konkan", "centroid": [18.93, 72.83]},
    {"id": "mumbai-suburban", "name": "Mumbai Suburban", "stateId": "maharashtra", "division": "Konkan", "centroid": [19.12, 72.88]},
    {"id": "pune", "name": "Pune", "stateId": "maharashtra", "division": "Pune", "centroid": [18.52, 73.85]},
    {"id": "nagpur", "name": "Nagpur", "stateId": "maharashtra", "division": "Nagpur", "centroid": [21.14, 79.08]},
    {"id": "thane", "name": "Thane", "stateId": "maharashtra", "division": "Konkan", "centroid": [19.21, 72.97]},
    {"id": "nashik", "name": "Nashik", "stateId": "maharashtra", "division": "Nashik", "centroid": [19.99, 73.78]},
    {"id": "aurangabad", "name": "Chhatrapati Sambhajinagar", "stateId": "maharashtra", "division": "Aurangabad", "centroid": [19.87, 75.34]},
    {"id": "solapur", "name": "Solapur", "stateId": "maharashtra", "division": "Pune", "centroid": [17.65, 75.90]},
    {"id": "amravati", "name": "Amravati", "stateId": "maharashtra", "division": "Amravati", "centroid": [20.93, 77.75]},
    {"id": "kolhapur", "name": "Kolhapur", "stateId": "maharashtra", "division": "Pune", "centroid": [16.70, 74.24]},
]

KARNATAKA_DISTRICTS: List[Dict[str, Any]] = [
    {"id": "bengaluru-urban", "name": "Bengaluru Urban", "stateId": "karnataka", "division": "Bengaluru", "centroid": [12.97, 77.59]},
    {"id": "mysuru", "name": "Mysuru", "stateId": "karnataka", "division": "Mysuru", "centroid": [12.29, 76.63]},
    {"id": "dharwad", "name": "Dharwad", "stateId": "karnataka", "division": "Belagavi", "centroid": [15.45, 75.00]},
    {"id": "dakshina-kannada", "name": "Dakshina Kannada", "stateId": "karnataka", "division": "Mysuru", "centroid": [12.86, 75.00]},
    {"id": "belagavi", "name": "Belagavi", "stateId": "karnataka", "division": "Belagavi", "centroid": [15.84, 74.49]},
    {"id": "kalaburagi", "name": "Kalaburagi", "stateId": "karnataka", "division": "Kalaburagi", "centroid": [17.32, 76.83]},
    {"id": "ballari", "name": "Ballari", "stateId": "karnataka", "division": "Kalaburagi", "centroid": [15.13, 76.92]},
    {"id": "shivamogga", "name": "Shivamogga", "stateId": "karnataka", "division": "Bengaluru", "centroid": [13.92, 75.56]},
]

GUJARAT_DISTRICTS: List[Dict[str, Any]] = [
    {"id": "ahmedabad", "name": "Ahmedabad", "stateId": "gujarat", "division": "Ahmedabad", "centroid": [23.02, 72.57]},
    {"id": "surat", "name": "Surat", "stateId": "gujarat", "division": "Surat", "centroid": [21.17, 72.83]},
    {"id": "vadodara", "name": "Vadodara", "stateId": "gujarat", "division": "Vadodara", "centroid": [22.30, 73.18]},
    {"id": "rajkot", "name": "Rajkot", "stateId": "gujarat", "division": "Rajkot", "centroid": [22.30, 70.80]},
    {"id": "gandhinagar", "name": "Gandhinagar", "stateId": "gujarat", "division": "Gandhinagar", "centroid": [23.21, 72.63]},
    {"id": "bhavnagar", "name": "Bhavnagar", "stateId": "gujarat", "division": "Bhavnagar", "centroid": [21.76, 72.15]},
    {"id": "kutch", "name": "Kutch", "stateId": "gujarat", "division": "Bhuj", "centroid": [23.73, 69.85]},
]

TAMIL_NADU_DISTRICTS: List[Dict[str, Any]] = [
    {"id": "chennai", "name": "Chennai", "stateId": "tamil-nadu", "division": "Chennai", "centroid": [13.08, 80.27]},
    {"id": "coimbatore", "name": "Coimbatore", "stateId": "tamil-nadu", "division": "Coimbatore", "centroid": [11.01, 76.95]},
    {"id": "madurai", "name": "Madurai", "stateId": "tamil-nadu", "division": "Madurai", "centroid": [9.92, 78.11]},
    {"id": "tiruchirappalli", "name": "Tiruchirappalli", "stateId": "tamil-nadu", "division": "Tiruchirappalli", "centroid": [10.79, 78.70]},
    {"id": "salem", "name": "Salem", "stateId": "tamil-nadu", "division": "Salem", "centroid": [11.66, 78.14]},
    {"id": "tirunelveli", "name": "Tirunelveli", "stateId": "tamil-nadu", "division": "Tirunelveli", "centroid": [8.71, 77.75]},
]

BIHAR_DISTRICTS: List[Dict[str, Any]] = [
    {"id": "patna", "name": "Patna", "stateId": "bihar", "division": "Patna", "centroid": [25.59, 85.13]},
    {"id": "gaya", "name": "Gaya", "stateId": "bihar", "division": "Magadh", "centroid": [24.79, 85.00]},
    {"id": "muzaffarpur", "name": "Muzaffarpur", "stateId": "bihar", "division": "Tirhut", "centroid": [26.12, 85.39]},
    {"id": "bhagalpur", "name": "Bhagalpur", "stateId": "bihar", "division": "Bhagalpur", "centroid": [25.24, 86.98]},
    {"id": "darbhanga", "name": "Darbhanga", "stateId": "bihar", "division": "Darbhanga", "centroid": [26.15, 85.89]},
    {"id": "purnia", "name": "Purnia", "stateId": "bihar", "division": "Purnia", "centroid": [25.77, 87.47]},
]

ALL_DISTRICTS: List[Dict[str, Any]] = (
    UP_DISTRICTS + MAHARASHTRA_DISTRICTS + KARNATAKA_DISTRICTS +
    GUJARAT_DISTRICTS + TAMIL_NADU_DISTRICTS + BIHAR_DISTRICTS
)

DISTRICT_DICT = {d["id"]: d for d in ALL_DISTRICTS}

def find_district(district_id: str) -> Optional[Dict[str, Any]]:
    return DISTRICT_DICT.get(district_id)

def get_districts_for_state(state_id: str) -> List[Dict[str, Any]]:
    return [d for d in ALL_DISTRICTS if d["stateId"] == state_id]

# ---------------------------------------------------------------------------
# States Master Catalog
# ---------------------------------------------------------------------------
STATES: List[Dict[str, Any]] = [
    {
        "id": "uttar-pradesh",
        "name": "Uttar Pradesh",
        "capital": "Lucknow",
        "centroid": [26.85, 80.9],
        "zoom": 7,
        "status": "available",
        "districts": UP_DISTRICTS,
    },
    {
        "id": "maharashtra",
        "name": "Maharashtra",
        "capital": "Mumbai",
        "centroid": [19.75, 75.71],
        "zoom": 7,
        "status": "available",
        "districts": MAHARASHTRA_DISTRICTS,
    },
    {
        "id": "karnataka",
        "name": "Karnataka",
        "capital": "Bengaluru",
        "centroid": [15.3, 75.7],
        "zoom": 7,
        "status": "available",
        "districts": KARNATAKA_DISTRICTS,
    },
    {
        "id": "gujarat",
        "name": "Gujarat",
        "capital": "Gandhinagar",
        "centroid": [22.6, 71.6],
        "zoom": 7,
        "status": "available",
        "districts": GUJARAT_DISTRICTS,
    },
    {
        "id": "tamil-nadu",
        "name": "Tamil Nadu",
        "capital": "Chennai",
        "centroid": [11.1, 78.7],
        "zoom": 7,
        "status": "available",
        "districts": TAMIL_NADU_DISTRICTS,
    },
    {
        "id": "bihar",
        "name": "Bihar",
        "capital": "Patna",
        "centroid": [25.6, 85.6],
        "zoom": 7,
        "status": "available",
        "districts": BIHAR_DISTRICTS,
    },
    {
        "id": "rajasthan",
        "name": "Rajasthan",
        "capital": "Jaipur",
        "centroid": [26.9, 73.8],
        "zoom": 7,
        "status": "coming-soon",
        "districts": [],
    },
    {
        "id": "west-bengal",
        "name": "West Bengal",
        "capital": "Kolkata",
        "centroid": [23.5, 87.5],
        "zoom": 7,
        "status": "coming-soon",
        "districts": [],
    },
]

STATE_DICT = {s["id"]: s for s in STATES}

def find_state(state_id: str) -> Optional[Dict[str, Any]]:
    return STATE_DICT.get(state_id)

INDIA_CENTROID = [22.9, 79.0]
INDIA_DEFAULT_ZOOM = 5

# ---------------------------------------------------------------------------
# Official Data Sources Reference Catalog
# ---------------------------------------------------------------------------
REFERENCE_SOURCES: List[Dict[str, str]] = [
    {
        "indicatorSlug": "demographics",
        "sourceName": "Census of India, Office of the Registrar General & Census Commissioner",
        "sourceUrl": "https://censusindia.gov.in",
        "notes": "Decennial census; population projections in intercensal years.",
    },
    {
        "indicatorSlug": "education",
        "sourceName": "UDISE+ (Unified District Information System for Education Plus)",
        "sourceUrl": "https://udiseplus.gov.in",
        "notes": "Annual school-level data collected by the Ministry of Education.",
    },
    {
        "indicatorSlug": "healthcare",
        "sourceName": "Rural Health Statistics, Ministry of Health & Family Welfare",
        "sourceUrl": "https://main.mohfw.gov.in",
        "notes": "Annual infrastructure and staffing statistics for rural health facilities.",
    },
    {
        "indicatorSlug": "employment",
        "sourceName": "Periodic Labour Force Survey (PLFS), National Statistical Office",
        "sourceUrl": "https://mospi.gov.in",
        "notes": "Household survey on employment and unemployment, published periodically.",
    },
    {
        "indicatorSlug": "crime",
        "sourceName": "National Crime Records Bureau (NCRB), Ministry of Home Affairs",
        "sourceUrl": "https://ncrb.gov.in",
        "notes": 'Annual "Crime in India" report with state and district data.',
    },
    {
        "indicatorSlug": "roads",
        "sourceName": "Ministry of Road Transport and Highways / PMGSY",
        "sourceUrl": "https://morth.nic.in",
        "notes": "Road length and rural connectivity statistics.",
    },
    {
        "indicatorSlug": "agriculture",
        "sourceName": "Directorate of Economics & Statistics, Dept. of Agriculture & Farmers Welfare",
        "sourceUrl": "https://eands.dacnet.nic.in",
        "notes": "District-level area, production, and yield statistics.",
    },
    {
        "indicatorSlug": "water",
        "sourceName": "Jal Jeevan Mission / Central Ground Water Board",
        "sourceUrl": "https://ejalshakti.gov.in",
        "notes": "Drinking water coverage and groundwater monitoring data.",
    },
    {
        "indicatorSlug": "electricity",
        "sourceName": "Central Electricity Authority",
        "sourceUrl": "https://cea.nic.in",
        "notes": "Electrification, supply, and consumption statistics.",
    },
    {
        "indicatorSlug": "government-schemes",
        "sourceName": "Respective scheme MIS dashboards (state & central government)",
        "sourceUrl": "",
        "notes": "Coverage varies by scheme; each has its own reporting dashboard.",
    },
    {
        "indicatorSlug": "environment",
        "sourceName": "India State of Forest Report (FSI) / CPCB",
        "sourceUrl": "https://fsi.nic.in",
        "notes": "Biennial forest cover assessment; CPCB publishes air/water quality data.",
    },
]

REF_SOURCES_DICT = {s["indicatorSlug"]: s for s in REFERENCE_SOURCES}

def get_reference_source(indicator_slug: str) -> Optional[Dict[str, str]]:
    return REF_SOURCES_DICT.get(indicator_slug)
