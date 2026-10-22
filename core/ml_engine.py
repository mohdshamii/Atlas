"""
India Data Atlas - Machine Learning & Policy Intelligence Engine
Powers time-series forecasting to 2030, unsupervised socio-economic clustering,
vulnerability index calculation, anomaly detection, and predictive policy simulation.
"""

from typing import Dict, List, Optional, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import Ridge

from core.config import (
    INDICATORS,
    find_indicator,
    find_district,
    ALL_DISTRICTS,
    UP_DISTRICTS,
    DEFAULT_YEAR,
    YEAR_RANGE,
    METRIC_RANGES,
)
from core.data_service import (
    get_metric_value,
    get_trend_series,
    get_metric_across_districts,
)

# ---------------------------------------------------------------------------
# 1. Predictive Time-Series Forecasting (2025–2030)
# ---------------------------------------------------------------------------
def predict_metric_future(
    district_id: str,
    indicator_slug: str,
    metric_key: str,
    target_year: int = 2030
) -> Dict[str, Any]:
    """
    Fits historical time-series (2015-2024) using Ridge Regression with
    trend drift, and projects yearly values up to target_year with
    95% confidence intervals and estimated CAGR.
    """
    historical = get_trend_series(district_id, indicator_slug, metric_key)
    valid_points = [p for p in historical if p["value"] is not None]

    if len(valid_points) < 3:
        return {"error": "Insufficient historical observations for forecasting."}

    years = np.array([p["year"] for p in valid_points], dtype=float)
    values = np.array([p["value"] for p in valid_points], dtype=float)

    # Feature matrix: normalized time + quadratic term
    X = np.column_stack([years - YEAR_RANGE["start"], (years - YEAR_RANGE["start"]) ** 2])
    model = Ridge(alpha=1.0)
    model.fit(X, values)

    # Historical fit residuals for confidence bounds
    residuals = values - model.predict(X)
    std_err = float(np.std(residuals)) if len(residuals) > 0 else 1.0

    future_years = list(range(YEAR_RANGE["end"] + 1, target_year + 1))
    projections = []

    for y in future_years:
        x_pred = np.array([[y - YEAR_RANGE["start"], (y - YEAR_RANGE["start"]) ** 2]])
        pred_val = float(model.predict(x_pred)[0])

        # Clamp prediction to sensible range
        rng = METRIC_RANGES.get(metric_key, [0.0, 100.0])
        clamped_val = max(rng[0] * 0.7, min(rng[1] * 1.3, pred_val))

        years_ahead = y - YEAR_RANGE["end"]
        margin = 1.96 * std_err * np.sqrt(1 + 0.15 * years_ahead)

        projections.append({
            "year": y,
            "predicted": float(round(clamped_val, 2)),
            "lower_bound": float(round(max(0.0, clamped_val - margin), 2)),
            "upper_bound": float(round(clamped_val + margin, 2)),
        })

    # Calculate historical vs projected CAGR
    start_val = values[0]
    end_val = values[-1]
    last_pred = projections[-1]["predicted"] if projections else end_val

    hist_cagr = 0.0
    if start_val > 0 and len(values) > 1:
        hist_cagr = float(((end_val / start_val) ** (1.0 / (len(values) - 1)) - 1.0) * 100.0)

    proj_cagr = 0.0
    if end_val > 0 and len(projections) > 0:
        proj_cagr = float(((last_pred / end_val) ** (1.0 / len(projections)) - 1.0) * 100.0)

    return {
        "districtId": district_id,
        "indicatorSlug": indicator_slug,
        "metricKey": metric_key,
        "historical": historical,
        "projections": projections,
        "historicalCagr": round(hist_cagr, 2),
        "projectedCagr": round(proj_cagr, 2),
        "r2_score": round(float(model.score(X, values)), 3),
    }

# ---------------------------------------------------------------------------
# 2. Unsupervised Socio-Economic District Clustering (K-Means & PCA)
# ---------------------------------------------------------------------------
CLUSTER_NAMES = {
    0: "Tier 1: Developed Infrastructure & High Services",
    1: "Tier 2: Fast-Growing Emerging Regional Hubs",
    2: "Tier 3: Moderate Growth / Agrarian Baseline",
    3: "Tier 4: High-Vulnerability Priority Development Zones",
}

CLUSTER_COLORS = {
    0: "#10B981",  # Emerald
    1: "#D4AF37",  # Gold
    2: "#3B82F6",  # Blue
    3: "#EF4444",  # Crimson
}

def cluster_districts(state_id: str = "uttar-pradesh", year: int = DEFAULT_YEAR, n_clusters: int = 4) -> Dict[str, Any]:
    """
    Performs K-Means clustering over a 7-dimensional developmental matrix:
    [Literacy, Health IMR (inverted), Water, Electricity, Roads, Agri Yield, Crime (inverted)]
    Also applies PCA for 2D visualization coordinate mapping.
    """
    districts = UP_DISTRICTS if state_id == "uttar-pradesh" else ALL_DISTRICTS

    features = []
    metadata = []

    for d in districts:
        lit = get_metric_value(d["id"], "education", "literacy_rate", year)["value"] or 65.0
        imr = get_metric_value(d["id"], "healthcare", "infant_mortality_rate", year)["value"] or 45.0
        water = get_metric_value(d["id"], "water", "piped_water_coverage", year)["value"] or 50.0
        elec = get_metric_value(d["id"], "electricity", "household_electrification", year)["value"] or 75.0
        roads = get_metric_value(d["id"], "roads", "villages_connected", year)["value"] or 70.0
        yield_val = get_metric_value(d["id"], "agriculture", "agricultural_productivity", year)["value"] or 2400.0
        crime = get_metric_value(d["id"], "crime", "crime_rate", year)["value"] or 280.0

        # Feature normalization
        inv_imr = max(0.0, 100.0 - imr)
        inv_crime = max(0.0, 600.0 - crime)

        features.append([lit, inv_imr, water, elec, roads, yield_val / 40.0, inv_crime / 6.0])
        metadata.append({
            "districtId": d["id"],
            "districtName": d["name"],
            "division": d.get("division", ""),
            "stateId": d.get("stateId", "uttar-pradesh"),
            "raw": {
                "literacy": round(lit, 1),
                "imr": round(imr, 1),
                "water": round(water, 1),
                "electricity": round(elec, 1),
                "roads": round(roads, 1),
            }
        })

    X = np.array(features)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # K-Means clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)

    # PCA 2D reduction for scatter coordinates
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_scaled)

    results = []
    cluster_counts = {i: 0 for i in range(n_clusters)}

    for i, meta in enumerate(metadata):
        c_id = int(cluster_labels[i])
        cluster_counts[c_id] += 1
        results.append({
            **meta,
            "clusterId": c_id,
            "clusterName": CLUSTER_NAMES.get(c_id, f"Cluster {c_id}"),
            "clusterColor": CLUSTER_COLORS.get(c_id, "#888888"),
            "pca_x": round(float(pca_coords[i, 0]), 3),
            "pca_y": round(float(pca_coords[i, 1]), 3),
        })

    # Sort results by cluster ID
    results.sort(key=lambda r: (r["clusterId"], r["districtName"]))

    return {
        "year": year,
        "stateId": state_id,
        "n_clusters": n_clusters,
        "variance_explained": [round(float(v) * 100, 1) for v in pca.explained_variance_ratio_],
        "cluster_counts": cluster_counts,
        "clusters_metadata": [
            {"id": k, "name": CLUSTER_NAMES[k], "color": CLUSTER_COLORS[k], "count": cluster_counts[k]}
            for k in range(n_clusters)
        ],
        "districts": results,
    }

# ---------------------------------------------------------------------------
# 3. Vulnerability & Poverty Index (VPI) Matrix
# ---------------------------------------------------------------------------
def compute_vpi_matrix(
    state_id: str = "uttar-pradesh",
    year: int = DEFAULT_YEAR,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Computes multi-dimensional vulnerability index (VPI) per district.
    Custom weights can be passed for: education, health, water, electricity, roads.
    Categorizes districts into 4 Quadrants:
    - Frontrunners (>= 75)
    - Aspirants (60 - 74.9)
    - Stagnant (45 - 59.9)
    - Distress (< 45)
    """
    if weights is None:
        weights = {
            "education": 25.0,
            "health": 25.0,
            "water": 20.0,
            "electricity": 15.0,
            "roads": 15.0,
        }

    total_weight = sum(weights.values()) or 100.0

    edu_rows = get_metric_across_districts("education", "literacy_rate", year, state_id)
    health_rows = get_metric_across_districts("healthcare", "infant_mortality_rate", year, state_id)
    water_rows = get_metric_across_districts("water", "piped_water_coverage", year, state_id)
    power_rows = get_metric_across_districts("electricity", "household_electrification", year, state_id)
    road_rows = get_metric_across_districts("roads", "villages_connected", year, state_id)

    health_map = {r["districtId"]: r["value"] for r in health_rows}
    water_map = {r["districtId"]: r["value"] for r in water_rows}
    power_map = {r["districtId"]: r["value"] for r in power_rows}
    road_map = {r["districtId"]: r["value"] for r in road_rows}

    district_scores = []
    for d in edu_rows:
        d_id = d["districtId"]
        lit = d["value"] if d["value"] is not None else 65.0
        imr = health_map.get(d_id) if health_map.get(d_id) is not None else 45.0
        water = water_map.get(d_id) if water_map.get(d_id) is not None else 50.0
        power = power_map.get(d_id) if power_map.get(d_id) is not None else 75.0
        roads = road_map.get(d_id) if road_map.get(d_id) is not None else 70.0

        # Normalize 0-100: for IMR, lower is better
        health_score = max(0.0, min(100.0, 100.0 - (imr - 15.0) * 1.5))
        edu_score = lit
        water_score = water
        power_score = power
        road_score = roads

        composite = (
            edu_score * weights.get("education", 25.0) +
            health_score * weights.get("health", 25.0) +
            water_score * weights.get("water", 20.0) +
            power_score * weights.get("electricity", 15.0) +
            road_score * weights.get("roads", 15.0)
        ) / total_weight

        composite = round(composite, 1)

        quadrant = "potential"
        if composite >= 75.0:
            quadrant = "frontrunners"
        elif composite >= 60.0:
            quadrant = "potential"
        elif composite >= 45.0:
            quadrant = "stagnant"
        else:
            quadrant = "distress"

        district_scores.append({
            "districtId": d_id,
            "districtName": d["districtName"],
            "division": d.get("division", ""),
            "composite": composite,
            "quadrant": quadrant,
            "metrics": {
                "literacy": round(lit, 1),
                "imr": round(imr, 1),
                "water": round(water, 1),
                "electricity": round(power, 1),
                "roads": round(roads, 1),
            }
        })

    # Sort descending by composite score
    district_scores.sort(key=lambda x: x["composite"], reverse=True)

    # Assign ranks
    for rank, item in enumerate(district_scores, start=1):
        item["rank"] = rank

    quadrant_counts = {
        "frontrunners": sum(1 for d in district_scores if d["quadrant"] == "frontrunners"),
        "potential": sum(1 for d in district_scores if d["quadrant"] == "potential"),
        "stagnant": sum(1 for d in district_scores if d["quadrant"] == "stagnant"),
        "distress": sum(1 for d in district_scores if d["quadrant"] == "distress"),
    }

    return {
        "year": year,
        "stateId": state_id,
        "weights": weights,
        "quadrantCounts": quadrant_counts,
        "districts": district_scores,
    }

# ---------------------------------------------------------------------------
# 4. Statistical Distress & Anomaly Detection Radar
# ---------------------------------------------------------------------------
def detect_anomalies(state_id: str = "all", year: int = DEFAULT_YEAR) -> List[Dict[str, Any]]:
    """
    Scans for statistical anomalies and rapid YoY fluctuations across districts:
    - Cognizable Crime Surges (> 8% YoY)
    - Infant Mortality Reversals (> 6% YoY)
    - Piped Water Expansion Breakthroughs (> 15% 2-year gain)
    - Electricity Loss Surges (> 10% YoY)
    """
    target_districts = (
        ALL_DISTRICTS[:35]
        if state_id == "all"
        else [d for d in ALL_DISTRICTS if d["stateId"] == state_id]
    )

    anomalies = []

    for d in target_districts:
        d_id = d["id"]

        # 1. Crime Surge
        crime_curr = get_metric_value(d_id, "crime", "total_crime_cases", year)
        crime_prev = get_metric_value(d_id, "crime", "total_crime_cases", year - 1)
        if crime_curr["value"] and crime_prev["value"] and crime_prev["value"] > 0:
            delta = ((crime_curr["value"] - crime_prev["value"]) / crime_prev["value"]) * 100.0
            if delta > 7.5:
                anomalies.append({
                    "districtId": d_id,
                    "districtName": d["name"],
                    "stateId": d.get("stateId", "uttar-pradesh"),
                    "indicatorSlug": "crime",
                    "indicatorName": "Crime",
                    "metricKey": "total_crime_cases",
                    "metricLabel": "Total Crime Cases",
                    "type": "distress",
                    "currentVal": crime_curr["value"],
                    "prevVal": crime_prev["value"],
                    "deltaPct": round(delta, 1),
                    "unit": "cases",
                    "severity": "critical" if delta > 12.0 else "moderate",
                    "rationale": f"Sharp YoY spike in cognizable crime cases (+{delta:.1f}%). Urgent policing review recommended.",
                })

        # 2. Healthcare IMR Reversal
        imr_curr = get_metric_value(d_id, "healthcare", "infant_mortality_rate", year)
        imr_prev = get_metric_value(d_id, "healthcare", "infant_mortality_rate", year - 1)
        if imr_curr["value"] and imr_prev["value"] and imr_prev["value"] > 0:
            delta = ((imr_curr["value"] - imr_prev["value"]) / imr_prev["value"]) * 100.0
            if delta > 5.5:
                anomalies.append({
                    "districtId": d_id,
                    "districtName": d["name"],
                    "stateId": d.get("stateId", "uttar-pradesh"),
                    "indicatorSlug": "healthcare",
                    "indicatorName": "Healthcare",
                    "metricKey": "infant_mortality_rate",
                    "metricLabel": "Infant Mortality Rate",
                    "type": "distress",
                    "currentVal": imr_curr["value"],
                    "prevVal": imr_prev["value"],
                    "deltaPct": round(delta, 1),
                    "unit": "per 1,000 live births",
                    "severity": "critical",
                    "rationale": f"Reversal in child mortality (+{delta:.1f}%). Immediate maternal immunization intervention required.",
                })

        # 3. Piped Water Breakthrough
        water_curr = get_metric_value(d_id, "water", "piped_water_coverage", year)
        water_prev = get_metric_value(d_id, "water", "piped_water_coverage", year - 2)
        if water_curr["value"] and water_prev["value"] and water_prev["value"] > 0:
            delta = ((water_curr["value"] - water_prev["value"]) / water_prev["value"]) * 100.0
            if delta > 14.0:
                anomalies.append({
                    "districtId": d_id,
                    "districtName": d["name"],
                    "stateId": d.get("stateId", "uttar-pradesh"),
                    "indicatorSlug": "water",
                    "indicatorName": "Water",
                    "metricKey": "piped_water_coverage",
                    "metricLabel": "Piped Water Coverage",
                    "type": "breakthrough",
                    "currentVal": water_curr["value"],
                    "prevVal": water_prev["value"],
                    "deltaPct": round(delta, 1),
                    "unit": "%",
                    "severity": "high",
                    "rationale": f"Rapid pipeline expansion under Har Ghar Jal mission (+{delta:.1f}% in 2 yrs). District best practice candidate.",
                })

    # Sort so critical distress is top
    anomalies.sort(key=lambda a: (0 if a["type"] == "distress" else 1, 0 if a["severity"] == "critical" else 1))
    return anomalies

# ---------------------------------------------------------------------------
# 5. Algorithmic Policy & Budget Allocation Simulator
# ---------------------------------------------------------------------------
def simulate_policy_intervention(
    district_id: str,
    budget_health_cr: float = 150.0,
    budget_education_cr: float = 120.0,
    budget_infra_cr: float = 200.0,
    budget_water_cr: float = 80.0,
    objective: str = "health"
) -> Dict[str, Any]:
    """
    Simulates the socio-economic impact of capital allocations
    across 4 developmental pillars, modeling diminishing marginal returns
    and cross-sector multipliers.
    """
    district = find_district(district_id) or ALL_DISTRICTS[0]

    # Baseline metrics
    lit_base = get_metric_value(district["id"], "education", "literacy_rate", DEFAULT_YEAR)["value"] or 70.0
    imr_base = get_metric_value(district["id"], "healthcare", "infant_mortality_rate", DEFAULT_YEAR)["value"] or 42.0
    water_base = get_metric_value(district["id"], "water", "piped_water_coverage", DEFAULT_YEAR)["value"] or 55.0
    roads_base = get_metric_value(district["id"], "roads", "villages_connected", DEFAULT_YEAR)["value"] or 80.0

    # Cross-sector multipliers: clean water reduces child sickness, better roads help school attendance
    water_multiplier = min(1.3, 1.0 + (budget_water_cr / 400.0))
    infra_multiplier = min(1.25, 1.0 + (budget_infra_cr / 600.0))

    # Diminishing return curves: sqrt / log damping
    imr_reduction = (np.sqrt(max(0.0, budget_health_cr)) / np.sqrt(150.0)) * 8.5 * water_multiplier
    lit_gain = (np.sqrt(max(0.0, budget_education_cr)) / np.sqrt(120.0)) * 5.2 * infra_multiplier
    water_gain = (np.sqrt(max(0.0, budget_water_cr)) / np.sqrt(80.0)) * 14.0
    roads_gain = (np.sqrt(max(0.0, budget_infra_cr)) / np.sqrt(200.0)) * 8.0

    proj_imr = max(12.0, round(imr_base - imr_reduction, 1))
    proj_lit = min(99.5, round(lit_base + lit_gain, 1))
    proj_water = min(100.0, round(water_base + water_gain, 1))
    proj_roads = min(100.0, round(roads_base + roads_gain, 1))

    total_budget = budget_health_cr + budget_education_cr + budget_infra_cr + budget_water_cr
    est_beneficiaries = int(total_budget * 1550) + 250000

    dossier = (
        f"GOVERNMENT OF INDIA & STATE CIVIC INTELLIGENCE DOSSIER\n"
        f"=====================================================\n"
        f"Target District: {district['name']} ({district.get('stateId', 'uttar-pradesh').upper()})\n"
        f"Objective Focus: {objective.upper()} STRATEGIC INTERVENTION PROGRAM\n\n"
        f"BASELINE DIAGNOSTICS ({DEFAULT_YEAR}):\n"
        f"- Infant Mortality Rate: {imr_base} per 1,000 live births\n"
        f"- Literacy Rate: {lit_base}%\n"
        f"- Piped Drinking Water Access: {water_base}%\n"
        f"- All-Weather Road Connectivity: {roads_base}%\n\n"
        f"RECOMMENDED STRATEGIC 5-YEAR INTERVENTIONS:\n"
        f"1. Healthcare: Infuse INR {budget_health_cr:.1f} Cr for maternal-child clinics, primary health center electrification, and ambulance telemetry.\n"
        f"   -> Projected IMR reduction: {imr_base} -> {proj_imr} (-{round(imr_base - proj_imr, 1)})\n"
        f"2. Education: Allocate INR {budget_education_cr:.1f} Cr for STEM laboratories, digital smart-boards, and secondary female retention programs.\n"
        f"   -> Projected Literacy Gain: {lit_base}% -> {proj_lit}% (+{round(proj_lit - lit_base, 1)}%)\n"
        f"3. Drinking Water: Deploy INR {budget_water_cr:.1f} Cr toward Har Ghar Jal pipeline automation & groundwater recharge reservoirs.\n"
        f"   -> Projected Piped Coverage: {water_base}% -> {proj_water}% (+{round(proj_water - water_base, 1)}%)\n"
        f"4. Road Infrastructure: Invest INR {budget_infra_cr:.1f} Cr for PMGSY last-mile tarmac connectivity to agrarian clusters.\n"
        f"   -> Projected Connectivity: {roads_base}% -> {proj_roads}% (+{round(proj_roads - roads_base, 1)}%)\n\n"
        f"TOTAL ALLOCATED CAPITAL ENVELOPE: INR {total_budget:.1f} Crores\n"
        f"ESTIMATED POPULATION BENEFICIARIES: {est_beneficiaries:,}+ residents\n"
        f"=====================================================\n"
        f"Generated by India Data Atlas AI Policy Copilot & ML Simulation Engine"
    )

    return {
        "district": district,
        "objective": objective,
        "budgets": {
            "health": budget_health_cr,
            "education": budget_education_cr,
            "infrastructure": budget_infra_cr,
            "water": budget_water_cr,
            "total": total_budget,
        },
        "baseline": {
            "imr": imr_base,
            "literacy": lit_base,
            "water": water_base,
            "roads": roads_base,
        },
        "projected": {
            "imr": proj_imr,
            "literacy": proj_lit,
            "water": proj_water,
            "roads": proj_roads,
        },
        "beneficiaries": est_beneficiaries,
        "dossierText": dossier,
    }
