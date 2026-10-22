# India Data Atlas & Civic Intelligence Engine
### High-Performance Python, Flask, Jupyter Notebook & Scikit-Learn Geospatial Analytics Platform

An enterprise-grade, academic-caliber civic and geographic data visualization platform for India — covering all **75 districts of Uttar Pradesh** and major national economic hubs from **2015 to 2024**, with **2025–2030 predictive forecasting**, **unsupervised machine learning clustering**, **3D WebGL visualizations**, and an **AI Policy Copilot**.

Built entirely in **Python (Flask, Pandas, NumPy, Scikit-Learn, Plotly, Seaborn)** with **Jupyter Notebook** research workflows and client-side interactive rendering via **Three.js** and **Leaflet.js**.

---

##  Key Platform Capabilities

### 1. Deterministic Multi-Dimensional Data Engine (`core/`)
- **11 Locked Civic Indicators**: Demographics, Education, Healthcare, Employment, Crime, Road Infrastructure, Agriculture, Water & Sanitation, Electricity, Government Welfare Schemes, and Environment.
- **50+ Granular Metrics**: Each metric features defined units, polarity (positive vs. inverted distress), decimal precision, and baseline bounds.
- **Strict Deterministic PRNG**: Built on 32-bit FNV-1a hashing and Mulberry32 pseudo-random algorithms (`core/prng.py`), ensuring that every value across 112 districts, 11 indicators, and 10 historical years (2015–2024) is 100% reproducible and identical across reloads without database overhead.
- **Configurable Data Provenance**: Explicit badges for `Verified`, `Demo Data`, and `Data Unavailable` (with a deliberate ~4% missingness rate for realistic null-handling).

### 2. Scikit-Learn Machine Learning & Econometric Core (`core/ml_engine.py`)
- **K-Means Socio-Economic Clustering ($k=4$)**:
  - Automatically classifies all 75 districts into developmental tiers:
    - *Tier 1: Developed Infrastructure & High Services*
    - *Tier 2: Fast-Growing Emerging Regional Hubs*
    - *Tier 3: Moderate Growth / Agrarian Baseline*
    - *Tier 4: High-Vulnerability Priority Development Zones*
- **Dimensionality Reduction via PCA**:
  - Computes 2-component Principal Component Analysis (explained variance ~40%) for interactive 2D cluster scatter maps with convex hull envelopes.
- **Time-Series Horizon Forecasting (2025–2030)**:
  - Employs **Ridge Regression with L2 Regularization** trained on historical indicators (2015–2024).
  - Calculates Historical Compound Annual Growth Rate (CAGR), Projected CAGR, $R^2$ goodness-of-fit, and parametric 95% Confidence Interval bounds for future indicators.
- **Vulnerability Priority Index (VPI) Matrix**:
  - Normalizes developmental and distress indicators onto a $[0, 100]$ composite index.
  - Partitions districts into four quadrants: *Frontrunners*, *Aspirational*, *Vulnerable*, and *High Priority*.
- **AI Policy & Budget Optimization Simulator**:
  - Simulates 5-year multi-sectoral capital interventions (Healthcare, Education, Drinking Water, Road Infrastructure) using empirical elasticity models to project indicator shifts, beneficiary counts, and required INR allocations.

### 3. Production Flask Web Application (`app.py`, `run.py`)
- **10 Server-Rendered Web Views**:
  - `/`: National Dashboard with interactive Leaflet map, macro stats, and live search.
  - `/india/<state>`: State Explorer with dynamic choropleths, division filters, and ranking tables.
  - `/india/<state>/<district>`: District Profile featuring KPI summary cards, radar distress profiles, and 10-year trend visualizers.
  - `/india/<state>/<district>/<year>/<indicator>`: Deep-dive Indicator Studio with interactive Plotly trendlines, distribution bars, and raw metric tables.
  - `/compare`: Cross-District Comparative Studio comparing any two districts side-by-side with metric deltas.
  - `/intelligence`: AI Civic Intelligence Hub & Vulnerability Matrix.
  - `/3d-visualizer`: 3D WebGL Geospatial Studio powered by Three.js (Rotatable India Globe with economic flight arcs & Extruded District 3D Elevation Map).
  - `/ml-studio`: Interactive Machine Learning Studio with live K-Means clustering, PCA scatter plots, and 2030 forecast models.
  - `/data-sources`: Data provenance, methodology notes, and official government data citations.
  - `/search`: Full-text search with instant JSON autocomplete.
- **12 REST API Endpoints**:
  - Full programmatic access (`/api/states`, `/api/districts`, `/api/indicators`, `/api/timeseries`, `/api/rankings`, `/api/vpi`, `/api/clusters`, `/api/forecast`, `/api/simulate-budget`, etc.).
  - `/api/export/csv`: Dynamic CSV dataset generation with customizable state, year, and indicator filters.

### 4. Academic Research Jupyter Notebook (`atlas_analytics_and_ml.ipynb`)
A publication-ready, self-contained notebook featuring:
1. Environment Setup & Core Engine Initialization
2. High-Dimensional Observational DataFrame Extraction (42,750+ data points)
3. Exploratory Data Analysis & Statistical Summary Profiling
4. Cross-Indicator Correlation Matrix & Seaborn Heatmap
5. Unsupervised K-Means Socio-Economic Clustering & 2D PCA Biplot
6. Predictive 2025–2030 Time-Series Forecasting with Confidence Bounds
7. Vulnerability Priority Index (VPI) Quadrant Segmentation
8. Algorithmic Public Policy & Capital Intervention Simulator
9. Automated CSV Research Dataset Exports to `exports/`

---

##  Project Architecture

```
atlas/
├── app.py                           # Production Flask Application & REST API router
├── run.py                           # Server launcher script (port 5000)
├── test_app.py                      # Automated test suite (15 unit tests)
├── requirements.txt                 # Python dependencies
├── atlas_analytics_and_ml.ipynb     # Academic research & ML Jupyter Notebook
├── core/                            # Core Computational & Data Modules
│   ├── __init__.py
│   ├── config.py                    # Locked indicators, metric schemas, state models, centroids
│   ├── prng.py                      # 32-bit FNV-1a & Mulberry32 deterministic PRNG
│   ├── data_service.py              # Data access, KPIs, trends, comparisons, search
│   └── ml_engine.py                 # Scikit-Learn K-Means, PCA, Ridge forecasting, Policy Copilot
├── templates/                       # Jinja2 HTML Templates (Luxury Dark Design System)
│   ├── base.html                    # Shared header, navigation, search, and footer layout
│   ├── home.html                    # National Overview & interactive Leaflet map
│   ├── state.html                   # State overview, district directory, and choropleth
│   ├── district.html                # District dashboard, KPI matrix, and distress radar
│   ├── indicator.html               # Indicator studio, Plotly charts, and metric breakdown
│   ├── compare.html                 # Cross-district comparison studio
│   ├── intelligence.html            # AI Civic Intelligence & VPI quadrant matrix
│   ├── visualizer_3d.html           # 3D Three.js WebGL globe & elevation extrusion
│   ├── ml_explorer.html             # Machine Learning Studio & interactive simulation
│   ├── data_sources.html            # Methodology, provenance, and data catalog
│   ├── search.html                  # Global search results view
│   └── 404.html                     # Robust error page
├── static/                          # Static Assets
│   ├── css/
│   │   └── atlas.css                # Bespoke CSS: dark theme, glassmorphism, gold/emerald accents
│   ├── js/
│   │   ├── atlas.js                 # Autocomplete search, toast notifications, UI controls
│   │   ├── globe3d.js               # Three.js 3D Interactive National Globe
│   │   └── elevation3d.js           # Three.js 3D District Topographic Elevation Map
│   ├── geojson/
│   │   ├── up_districts.geojson     # District boundaries for Leaflet choropleth
│   │   └── up_state.geojson         # State boundary outline
│   └── favicon.svg                  # SVG platform logo
├── exports/                         # Directory for research CSV exports
└── notebooks/                       # Notebook repository mirror
```

---

##  Quickstart Guide

### 1. Requirements
- **Python 3.10+** (Tested on Python 3.10, 3.11, 3.12)
- Pip package manager

### 2. Installation
Clone the repository and install the dependencies:
```bash
# Navigate to the project root
cd atlas

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Flask Web Application
```bash
python run.py
```
Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

### 4. Run the Jupyter Analytics Notebook
```bash
jupyter notebook atlas_analytics_and_ml.ipynb
```
Select **Cell → Run All** to execute the end-to-end econometric and machine learning pipeline, generate interactive plots, and export CSV datasets.

### 5. Execute the Automated Test Suite
```bash
python test_app.py
```
*Executes 15 comprehensive unit tests verifying page status codes, REST API endpoints, PRNG determinism, and ML projection calculations.*

---

##  Complete REST API Specification

All API endpoints return standard JSON responses and are fully CORS-enabled.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/states` | Returns list of all active states and their metadata. |
| `GET` | `/api/districts?state=<state_id>` | Returns districts for a given state (e.g. `uttar-pradesh`). |
| `GET` | `/api/indicators` | Returns all 11 locked indicators and their metric schemas. |
| `GET` | `/api/data?district=&year=&indicator=` | Returns all metrics for a district, year, and indicator. |
| `GET` | `/api/timeseries?district=&metric=` | Returns historical data array (2015–2024) for a metric. |
| `GET` | `/api/rankings?indicator=&metric=&year=` | Returns all districts ranked by a specific metric. |
| `GET` | `/api/compare?d1=&d2=&indicator=&year=` | Returns side-by-side comparison data between two districts. |
| `GET` | `/api/vpi?state=<state_id>&year=<year>` | Returns the Vulnerability Priority Index and quadrant rankings. |
| `GET` | `/api/clusters?state=<state_id>&k=4` | Returns K-Means cluster assignments and 2D PCA coordinates. |
| `GET` | `/api/forecast?district=&metric=&target_year=2030` | Returns Ridge regression forecast with 95% confidence intervals. |
| `POST` | `/api/simulate-budget` | Simulates policy impacts based on a custom capital budget allocation JSON payload. |
| `GET` | `/api/export/csv?state=&year=&indicator=` | Streams a downloadable CSV dataset based on filter parameters. |

---

##  Machine Learning Methodology

### 1. K-Means Socio-Economic Clustering
District profiles are standardized using `StandardScaler` across four foundational indices:
- Primary Healthcare Deficit (Infant Mortality Rate)
- Human Capital Attainment (Literacy Rate)
- Civic Utility Coverage (Piped Drinking Water Access)
- Physical Connectivity (All-Weather Road Access)

The $k$-means algorithm partitions the space into 4 clusters. Principal Component Analysis reduces the 4D space into 2 orthogonal eigenvectors for visualization, explaining ~40% of spatial variance across Uttar Pradesh.

### 2. Time-Series Forecasting with Ridge Regression
To project metrics from 2025 to 2030:
1. Historical time steps $t \in [2015, 2024]$ are fitted using L2-penalized linear regression (`Ridge(alpha=1.0)`).
2. The model extracts slope $\beta$ and intercept $\alpha$ to estimate future values.
3. Standard error of regression ($s_e$) is computed to construct 95% confidence intervals:
$$\hat{y} \pm 1.96 \cdot s_e \sqrt{1 + \frac{1}{n} + \frac{(t - \bar{t})^2}{\sum (t_i - \bar{t})^2}}$$
4. Projections are clamped to plausible natural domain bounds (e.g., $[0\%, 100\%]$ for literacy).

---

##  Data Provenance & Ethics
- **Data Status Labeling**: Every metric card and API record clearly marks the provenance status (`verified`, `demo`, or `unavailable`).
- **Research Integrity**: Synthetic baseline distributions reflect realistic Indian demographic and development intervals (informed by Census of India, NFHS-5, UDISE+, and NITI Aayog Aspirational Districts indicators) while ensuring full disclosure that current V1 values are generated for analytical modeling.

---

##  Academic Attribution & License
Developed as a Final Year Project on **Civic Analytics, Geospatial Intelligence, and Predictive Public Policy**. Released under the MIT License for educational and research applications.
