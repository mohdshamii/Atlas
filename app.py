"""
India Data Atlas - Sovereign Civic Data & Geospatial Intelligence Platform
Production-grade Flask Web Application & RESTful API Engine.
"""

import os
import json
import io
import csv
from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    send_from_directory,
    Response,
    abort,
)

from core.config import (
    INDICATORS,
    STATES,
    ALL_DISTRICTS,
    UP_DISTRICTS,
    YEAR_RANGE,
    DEFAULT_YEAR,
    YEARS,
    find_indicator,
    find_district,
    find_state,
    get_districts_for_state,
    get_reference_source,
    REFERENCE_SOURCES,
    is_valid_year,
)
from core.data_service import (
    get_metric_value,
    get_indicator_values_for_district,
    get_trend_series,
    get_metric_across_districts,
    get_district_indicator_headline,
    get_all_indicator_headlines_for_district,
    get_kpi_data,
    get_district_ranking,
    compare_districts,
    search as search_service,
    get_complete_dataset_dataframe,
)
import core.ml_engine as ml_engine

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates",
)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "india-data-atlas-secret-key-2026")
app.config["JSON_SORT_KEYS"] = False

# Context processor for templates
@app.context_processor
def inject_global_context():
    return {
        "all_indicators": INDICATORS,
        "all_states": STATES,
        "all_districts": ALL_DISTRICTS,
        "year_range": YEAR_RANGE,
        "default_year": DEFAULT_YEAR,
        "years": YEARS,
    }

# ---------------------------------------------------------------------------
# WEB ROUTES
# ---------------------------------------------------------------------------

@app.route("/")
def home():
    """Pan-India Sovereign District Data & Civic Intelligence Portal"""
    available_states = [s for s in STATES if s["status"] == "available"]
    top_anomalies = ml_engine.detect_anomalies("all", DEFAULT_YEAR)[:4]

    featured_district_ids = ["lucknow", "varanasi", "agra", "pune", "bengaluru-urban", "ahmedabad", "chennai", "patna"]
    featured_districts = [find_district(d_id) for d_id in featured_district_ids if find_district(d_id)]

    return render_template(
        "home.html",
        available_states=available_states,
        indicators=INDICATORS,
        featured_districts=featured_districts,
        top_anomalies=top_anomalies,
        districts_count=len(ALL_DISTRICTS),
    )

@app.route("/india/<state_id>")
def state_view(state_id: str):
    """State Observatory & Sub-District Telemetry"""
    state = find_state(state_id)
    if not state:
        return render_template("404.html", message="State not found in atlas registry."), 404

    year = request.args.get("year", DEFAULT_YEAR, type=int)
    if not is_valid_year(year):
        year = DEFAULT_YEAR

    indicator_slug = request.args.get("indicator", INDICATORS[0]["slug"])
    indicator = find_indicator(indicator_slug) or INDICATORS[0]
    metric = indicator["metrics"][0]

    values = get_metric_across_districts(indicator["slug"], metric["key"], year, state_id)
    numeric_values = [v["value"] for v in values if v["value"] is not None]
    min_val = min(numeric_values) if numeric_values else 0
    max_val = max(numeric_values) if numeric_values else 100

    return render_template(
        "state.html",
        state=state,
        year=year,
        indicator=indicator,
        metric=metric,
        values=values,
        min_val=min_val,
        max_val=max_val,
    )

@app.route("/india/<state_id>/<district_id>")
def district_view(state_id: str, district_id: str):
    """District Profile & 11 Sectoral KPI Cards"""
    district = find_district(district_id)
    if not district:
        return render_template("404.html", message="District not found in atlas registry."), 404

    year = request.args.get("year", DEFAULT_YEAR, type=int)
    if not is_valid_year(year):
        year = DEFAULT_YEAR

    state_name = district.get("stateId", "uttar-pradesh").replace("-", " ").title()
    headlines = get_all_indicator_headlines_for_district(district_id, year)

    return render_template(
        "district.html",
        state_id=state_id,
        state_name=state_name,
        district=district,
        year=year,
        headlines=headlines,
    )

@app.route("/india/<state_id>/<district_id>/<int:year>/<indicator_slug>")
def indicator_view(state_id: str, district_id: str, year: int, indicator_slug: str):
    """Deep Indicator Dashboard with KPIs, Trend Series, Neighbor Comparison, and Map"""
    district = find_district(district_id)
    indicator = find_indicator(indicator_slug)

    if not district or not indicator or not is_valid_year(year):
        return render_template("404.html", message="Dashboard view unavailable for specified parameters."), 404

    active_metric_key = request.args.get("metric", indicator["metrics"][0]["key"])
    active_metric = next((m for m in indicator["metrics"] if m["key"] == active_metric_key), indicator["metrics"][0])

    kpis = get_kpi_data(district_id, indicator_slug, year)
    table_rows = get_indicator_values_for_district(district_id, indicator_slug, year)
    trend = get_trend_series(district_id, indicator_slug, active_metric["key"])
    across_districts = get_metric_across_districts(indicator_slug, active_metric["key"], year, district.get("stateId", "uttar-pradesh"))

    # Regional neighbor comparison (within same administrative division)
    division_districts = [d for d in UP_DISTRICTS if d.get("division") == district.get("division")]
    if len(division_districts) < 4:
        division_districts = UP_DISTRICTS[:8]

    neighbor_comparison = []
    for d in division_districts:
        val_item = next((a for a in across_districts if a["districtId"] == d["id"]), None)
        neighbor_comparison.append({
            "id": d["id"],
            "name": d["name"],
            "value": val_item["value"] if val_item else None,
            "isTarget": d["id"] == district_id,
        })

    ref_source = get_reference_source(indicator_slug)

    return render_template(
        "indicator.html",
        state_id=state_id,
        district=district,
        year=year,
        indicator=indicator,
        active_metric=active_metric,
        kpis=kpis,
        table_rows=table_rows,
        trend=trend,
        across_districts=across_districts,
        neighbor_comparison=neighbor_comparison,
        ref_source=ref_source,
    )

@app.route("/compare")
def compare_view():
    """Comparative Benchmarking Studio with 7-Pillar Radar and Differences"""
    district_a_id = request.args.get("a", "lucknow")
    district_b_id = request.args.get("b", "kanpur-nagar")
    indicator_slug = request.args.get("indicator", INDICATORS[0]["slug"])
    year = request.args.get("year", DEFAULT_YEAR, type=int)
    if not is_valid_year(year):
        year = DEFAULT_YEAR

    district_a = find_district(district_a_id) or ALL_DISTRICTS[0]
    district_b = find_district(district_b_id) or ALL_DISTRICTS[1]
    indicator = find_indicator(indicator_slug) or INDICATORS[0]

    comparison_rows = compare_districts(district_a["id"], district_b["id"], indicator["slug"], year)

    # 7-Pillar radar metrics
    radar_dimensions = [
        {"name": "Literacy Rate", "indicator": "education", "key": "literacy_rate", "min": 40, "max": 100, "unit": "%"},
        {"name": "Institutional Deliveries", "indicator": "healthcare", "key": "institutional_deliveries", "min": 40, "max": 100, "unit": "%"},
        {"name": "Piped Water", "indicator": "water", "key": "piped_water_coverage", "min": 20, "max": 100, "unit": "%"},
        {"name": "Power Availability", "indicator": "electricity", "key": "power_availability", "min": 10, "max": 24, "unit": "hrs/day"},
        {"name": "Road Connectivity", "indicator": "roads", "key": "villages_connected", "min": 40, "max": 100, "unit": "%"},
        {"name": "Safety Score", "indicator": "crime", "key": "crime_rate", "min": 100, "max": 600, "unit": "index", "invert": True},
        {"name": "Forest Cover", "indicator": "environment", "key": "forest_cover", "min": 1, "max": 30, "unit": "%"},
    ]

    radar_data = []
    for dim in radar_dimensions:
        val_a = get_metric_value(district_a["id"], dim["indicator"], dim["key"], year)["value"] or dim["min"]
        val_b = get_metric_value(district_b["id"], dim["indicator"], dim["key"], year)["value"] or dim["min"]

        score_a = max(0.0, min(100.0, ((val_a - dim["min"]) / (dim["max"] - dim["min"])) * 100.0))
        score_b = max(0.0, min(100.0, ((val_b - dim["min"]) / (dim["max"] - dim["min"])) * 100.0))

        if dim.get("invert"):
            score_a = 100.0 - score_a
            score_b = 100.0 - score_b

        radar_data.append({
            "dimension": dim["name"],
            "scoreA": round(score_a, 1),
            "scoreB": round(score_b, 1),
            "rawA": val_a,
            "rawB": val_b,
            "unit": dim["unit"],
        })

    return render_template(
        "compare.html",
        district_a=district_a,
        district_b=district_b,
        indicator=indicator,
        year=year,
        comparison_rows=comparison_rows,
        radar_data=radar_data,
    )

@app.route("/intelligence")
def intelligence_view():
    """Civic Intelligence & Policy Studio (Copilot, VPI Matrix, Distress Radar, Diagnostic Benchmark)"""
    active_tab = request.args.get("tab", "copilot")
    district_id = request.args.get("district", "lucknow")
    district = find_district(district_id) or ALL_DISTRICTS[0]

    # Pre-calculated policy simulation
    policy_sim = ml_engine.simulate_policy_intervention(district["id"])

    # VPI Matrix
    vpi_data = ml_engine.compute_vpi_matrix("uttar-pradesh", DEFAULT_YEAR)

    # Distress Anomalies
    anomalies = ml_engine.detect_anomalies("all", DEFAULT_YEAR)

    return render_template(
        "intelligence.html",
        active_tab=active_tab,
        district=district,
        policy_sim=policy_sim,
        vpi_data=vpi_data,
        anomalies=anomalies,
    )

@app.route("/3d-visualizer")
def visualizer_3d_view():
    """WebGL 3D Accelerated Geospatial Studio (Holographic Globe + Relief Elevation)"""
    mode = request.args.get("mode", "globe")
    state_id = request.args.get("state", "uttar-pradesh")
    indicator_slug = request.args.get("indicator", "education")

    state = find_state(state_id) or STATES[0]
    indicator = find_indicator(indicator_slug) or INDICATORS[0]

    return render_template(
        "visualizer_3d.html",
        mode=mode,
        state=state,
        indicator=indicator,
    )

@app.route("/ml-studio")
def ml_studio_view():
    """Machine Learning & Predictive Modeling Studio"""
    district_id = request.args.get("district", "lucknow")
    district = find_district(district_id) or ALL_DISTRICTS[0]

    # Forecasting literacy rate and infant mortality to 2030
    forecast_edu = ml_engine.predict_metric_future(district["id"], "education", "literacy_rate", 2030)
    forecast_health = ml_engine.predict_metric_future(district["id"], "healthcare", "infant_mortality_rate", 2030)

    # Socio-economic clustering
    clusters = ml_engine.cluster_districts("uttar-pradesh", DEFAULT_YEAR)

    return render_template(
        "ml_explorer.html",
        district=district,
        forecast_edu=forecast_edu,
        forecast_health=forecast_health,
        clusters=clusters,
    )

@app.route("/data-sources")
def data_sources_view():
    """Data Provenance, Integrity Statuses, and Official Reference Sources"""
    return render_template(
        "data_sources.html",
        reference_sources=REFERENCE_SOURCES,
    )

@app.route("/search")
def search_view():
    """Global Search Results Across States, Districts, Indicators, and Metrics"""
    query = request.args.get("q", "")
    results = search_service(query) if query else []
    return render_template(
        "search.html",
        query=query,
        results=results,
    )

# ---------------------------------------------------------------------------
# REST API ENDPOINTS
# ---------------------------------------------------------------------------

@app.route("/api/search")
def api_search():
    query = request.args.get("q", "")
    return jsonify(search_service(query))

@app.route("/api/states")
def api_states():
    return jsonify(STATES)

@app.route("/api/states/<state_id>")
def api_state(state_id: str):
    state = find_state(state_id)
    if not state:
        abort(404)
    return jsonify(state)

@app.route("/api/districts")
def api_districts():
    state_id = request.args.get("state")
    if state_id:
        return jsonify(get_districts_for_state(state_id))
    return jsonify(ALL_DISTRICTS)

@app.route("/api/districts/<district_id>")
def api_district(district_id: str):
    district = find_district(district_id)
    if not district:
        abort(404)
    year = request.args.get("year", DEFAULT_YEAR, type=int)
    headlines = get_all_indicator_headlines_for_district(district_id, year)
    return jsonify({"district": district, "headlines": headlines})

@app.route("/api/indicators")
def api_indicators():
    return jsonify(INDICATORS)

@app.route("/api/indicators/<slug>")
def api_indicator(slug: str):
    ind = find_indicator(slug)
    if not ind:
        abort(404)
    return jsonify(ind)

@app.route("/api/metrics/<district_id>/<indicator_slug>/<int:year>")
def api_metrics(district_id: str, indicator_slug: str, year: int):
    values = get_indicator_values_for_district(district_id, indicator_slug, year)
    return jsonify(values)

@app.route("/api/trend/<district_id>/<indicator_slug>/<metric_key>")
def api_trend(district_id: str, indicator_slug: str, metric_key: str):
    series = get_trend_series(district_id, indicator_slug, metric_key)
    return jsonify(series)

@app.route("/api/ranking/<indicator_slug>/<metric_key>/<int:year>")
def api_ranking(indicator_slug: str, metric_key: str, year: int):
    state_id = request.args.get("state", "uttar-pradesh")
    ranking = get_district_ranking(indicator_slug, metric_key, year, state_id)
    return jsonify(ranking)

@app.route("/api/compare")
def api_compare():
    a = request.args.get("a", "lucknow")
    b = request.args.get("b", "kanpur-nagar")
    indicator = request.args.get("indicator", "demographics")
    year = request.args.get("year", DEFAULT_YEAR, type=int)
    results = compare_districts(a, b, indicator, year)
    return jsonify(results)

@app.route("/api/geojson/<path:filename>")
def api_geojson(filename: str):
    geojson_dir = os.path.join(app.static_folder, "geojson")
    return send_from_directory(geojson_dir, filename)

@app.route("/api/ml/forecast")
def api_ml_forecast():
    district_id = request.args.get("district", "lucknow")
    indicator_slug = request.args.get("indicator", "education")
    metric_key = request.args.get("metric", "literacy_rate")
    target_year = request.args.get("target_year", 2030, type=int)

    forecast = ml_engine.predict_metric_future(district_id, indicator_slug, metric_key, target_year)
    return jsonify(forecast)

@app.route("/api/ml/clusters")
def api_ml_clusters():
    state_id = request.args.get("state", "uttar-pradesh")
    year = request.args.get("year", DEFAULT_YEAR, type=int)
    n_clusters = request.args.get("n_clusters", 4, type=int)

    clusters = ml_engine.cluster_districts(state_id, year, n_clusters)
    return jsonify(clusters)

@app.route("/api/ml/vpi")
def api_ml_vpi():
    state_id = request.args.get("state", "uttar-pradesh")
    year = request.args.get("year", DEFAULT_YEAR, type=int)

    # Custom weights if provided
    weights = None
    if "education" in request.args:
        weights = {
            "education": request.args.get("education", 25.0, type=float),
            "health": request.args.get("health", 25.0, type=float),
            "water": request.args.get("water", 20.0, type=float),
            "electricity": request.args.get("electricity", 15.0, type=float),
            "roads": request.args.get("roads", 15.0, type=float),
        }

    vpi = ml_engine.compute_vpi_matrix(state_id, year, weights)
    return jsonify(vpi)

@app.route("/api/ml/anomalies")
def api_ml_anomalies():
    state_id = request.args.get("state", "all")
    year = request.args.get("year", DEFAULT_YEAR, type=int)
    anomalies = ml_engine.detect_anomalies(state_id, year)
    return jsonify(anomalies)

@app.route("/api/ml/simulate", methods=["GET", "POST"])
def api_ml_simulate():
    data = request.get_json(silent=True) or request.args
    district_id = data.get("district", "lucknow")
    budget_health = float(data.get("health", 150.0))
    budget_education = float(data.get("education", 120.0))
    budget_infra = float(data.get("infrastructure", 200.0))
    budget_water = float(data.get("water", 80.0))
    objective = data.get("objective", "health")

    res = ml_engine.simulate_policy_intervention(
        district_id=district_id,
        budget_health_cr=budget_health,
        budget_education_cr=budget_education,
        budget_infra_cr=budget_infra,
        budget_water_cr=budget_water,
        objective=objective,
    )
    return jsonify(res)

@app.route("/api/export/csv")
def api_export_csv():
    """Generates on-the-fly CSV dataset export"""
    state_id = request.args.get("state")
    df = get_complete_dataset_dataframe(state_id)

    # Filter optional params
    if "district" in request.args:
        df = df[df["district_id"] == request.args.get("district")]
    if "indicator" in request.args:
        df = df[df["indicator_slug"] == request.args.get("indicator")]
    if "year" in request.args:
        df = df[df["year"] == request.args.get("year", type=int)]

    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)

    filename = f"india_data_atlas_export_{request.args.get('district', state_id or 'all')}.csv"
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

# ---------------------------------------------------------------------------
# ERROR HANDLERS
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html", message="The requested page or resource could not be found."), 404

@app.errorhandler(500)
def server_error(e):
    return render_template("404.html", message="An unexpected error occurred on the atlas server."), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
