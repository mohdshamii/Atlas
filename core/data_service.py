"""
India Data Atlas - High Performance Data Service Layer
Provides deterministic metric calculations, KPI aggregations, multi-district rankings,
trend timelines, comparative analytics, and global fuzzy search.
"""

from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
from core.prng import seeded_random, seeded_range
from core.config import (
    INDICATORS,
    find_indicator,
    find_district,
    find_state,
    get_districts_for_state,
    ALL_DISTRICTS,
    UP_DISTRICTS,
    STATES,
    YEAR_RANGE,
    DEFAULT_YEAR,
    YEARS,
    METRIC_RANGES,
    FORCE_UPWARD_TREND,
    is_valid_year,
)

def demo_source(dataset_label: str, year: int) -> Dict[str, Any]:
    return {
        "sourceName": "India Data Atlas — Demo Dataset",
        "sourceUrl": "",
        "datasetName": f"{dataset_label} (sample/demo)",
        "year": year,
        "coverage": "Uttar Pradesh, district-level",
        "updateDate": "",
        "notes": (
            "This is clearly-labeled demo/sample data generated for illustration only. "
            "It is not sourced from an official survey and should not be used for research, reporting, or policy purposes."
        ),
    }

def unavailable_source(dataset_label: str, year: int) -> Dict[str, Any]:
    return {
        "sourceName": "Not available",
        "sourceUrl": "",
        "datasetName": dataset_label,
        "year": year,
        "coverage": "Uttar Pradesh, district-level",
        "updateDate": "",
        "notes": "No data (demo or verified) is currently available for this metric, district, and year.",
    }

def clamp(val: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, val))

def is_simulated_unavailable(district_id: str, indicator_slug: str, metric_key: str, year: int) -> bool:
    return seeded_random(district_id, indicator_slug, metric_key, year, "availability") < 0.04

def get_metric_def(indicator_slug: str, metric_key: str) -> Optional[Dict[str, Any]]:
    ind = find_indicator(indicator_slug)
    if not ind:
        return None
    for m in ind["metrics"]:
        if m["key"] == metric_key:
            return m
    return None

def get_metric_value(
    district_id: str,
    indicator_slug: str,
    metric_key: str,
    year: int
) -> Dict[str, Any]:
    district = find_district(district_id)
    metric = get_metric_def(indicator_slug, metric_key)
    range_vals = METRIC_RANGES.get(metric_key, [0.0, 100.0])
    min_val, max_val = float(range_vals[0]), float(range_vals[1])
    label = metric["label"] if metric else metric_key

    state_name = "India"
    if district and "stateId" in district:
        st = find_state(district["stateId"])
        state_name = st["name"] if st else district["stateId"].replace("-", " ").title()

    if not district or not metric:
        return {
            "state": state_name,
            "district": district_id,
            "year": year,
            "indicator": indicator_slug,
            "metric": metric_key,
            "value": None,
            "unit": "",
            "status": "unavailable",
            "source": unavailable_source(label, year),
        }

    if is_simulated_unavailable(district_id, indicator_slug, metric_key, year):
        return {
            "state": state_name,
            "district": district["name"],
            "year": year,
            "indicator": indicator_slug,
            "metric": metric_key,
            "value": None,
            "unit": metric["unit"],
            "status": "unavailable",
            "source": unavailable_source(label, year),
        }

    # District-level baseline (stable across years for this district+metric)
    base = seeded_range(min_val, max_val, district_id, metric_key, "base")

    # Trend direction: force-upward list wins; otherwise derive from polarity.
    direction = 0.0
    if metric_key in FORCE_UPWARD_TREND:
        direction = 1.0
    elif metric["polarity"] == "positive":
        direction = 1.0
    elif metric["polarity"] == "negative":
        direction = -1.0  # improving = decreasing

    year_index = year - YEAR_RANGE["start"]
    span = max_val - min_val
    drift = direction * span * 0.028 * year_index
    noise = seeded_range(-1.0, 1.0, district_id, metric_key, year, "noise") * span * 0.025

    raw = base + drift + noise
    value = clamp(raw, min_val - span * 0.15, max_val + span * 0.15)
    precision = metric["precision"]
    rounded_value = round(value, precision) if precision > 0 else int(round(value))

    return {
        "state": state_name,
        "district": district["name"],
        "year": year,
        "indicator": indicator_slug,
        "metric": metric_key,
        "value": rounded_value,
        "unit": metric["unit"],
        "status": "demo",
        "source": demo_source(label, year),
    }

def get_indicator_values_for_district(
    district_id: str,
    indicator_slug: str,
    year: int
) -> List[Dict[str, Any]]:
    indicator = find_indicator(indicator_slug)
    if not indicator:
        return []
    return [get_metric_value(district_id, indicator_slug, m["key"], year) for m in indicator["metrics"]]

def get_trend_series(
    district_id: str,
    indicator_slug: str,
    metric_key: str
) -> List[Dict[str, Any]]:
    years = []
    for y in range(YEAR_RANGE["start"], YEAR_RANGE["end"] + 1):
        mv = get_metric_value(district_id, indicator_slug, metric_key, y)
        years.append({"year": y, "value": mv["value"]})
    return years

def get_metric_across_districts(
    indicator_slug: str,
    metric_key: str,
    year: int,
    state_id: str = "uttar-pradesh"
) -> List[Dict[str, Any]]:
    if state_id == "all":
        target_districts = ALL_DISTRICTS
    else:
        target_districts = get_districts_for_state(state_id)
        if not target_districts:
            target_districts = UP_DISTRICTS

    rows = []
    for d in target_districts:
        mv = get_metric_value(d["id"], indicator_slug, metric_key, year)
        rows.append({
            "districtId": d["id"],
            "districtName": d["name"],
            "division": d.get("division", ""),
            "value": mv["value"],
            "status": mv["status"],
            "centroid": d.get("centroid", [0, 0]),
        })
    return rows

def get_district_indicator_headline(
    district_id: str,
    indicator_slug: str,
    year: int
) -> Optional[Dict[str, Any]]:
    indicator = find_indicator(indicator_slug)
    if not indicator or not indicator["metrics"]:
        return None
    return get_metric_value(district_id, indicator_slug, indicator["metrics"][0]["key"], year)

def get_all_indicator_headlines_for_district(district_id: str, year: int) -> List[Dict[str, Any]]:
    results = []
    for indicator in INDICATORS:
        headline = get_district_indicator_headline(district_id, indicator["slug"], year)
        results.append({
            "indicator": indicator,
            "headline": headline,
        })
    return results

def get_kpi_data(district_id: str, indicator_slug: str, year: int) -> List[Dict[str, Any]]:
    indicator = find_indicator(indicator_slug)
    if not indicator:
        return []

    kpis = []
    for metric in indicator["metrics"]:
        current_val = get_metric_value(district_id, indicator_slug, metric["key"], year)
        prev_val = (
            get_metric_value(district_id, indicator_slug, metric["key"], year - 1)
            if year > YEAR_RANGE["start"]
            else None
        )

        change_abs = None
        change_pct = None
        trend = "unknown"

        if current_val["value"] is not None and prev_val and prev_val["value"] is not None:
            change_abs = current_val["value"] - prev_val["value"]
            if prev_val["value"] != 0:
                change_pct = (change_abs / prev_val["value"]) * 100.0

            threshold = 10 ** -metric["precision"]
            if abs(change_abs) < threshold:
                trend = "flat"
            else:
                trend = "up" if change_abs > 0 else "down"

        kpis.append({
            "metric": metric,
            "currentValue": current_val,
            "previousValue": prev_val,
            "changeAbs": round(change_abs, metric["precision"]) if change_abs is not None else None,
            "changePct": round(change_pct, 1) if change_pct is not None else None,
            "trend": trend,
        })
    return kpis

def get_district_ranking(
    indicator_slug: str,
    metric_key: str,
    year: int,
    state_id: str = "uttar-pradesh"
) -> Dict[str, Any]:
    rows = get_metric_across_districts(indicator_slug, metric_key, year, state_id)
    with_values = [r for r in rows if r["value"] is not None]
    missing = [r for r in rows if r["value"] is None]

    metric = get_metric_def(indicator_slug, metric_key)
    reverse_sort = True
    if metric and metric["polarity"] == "negative":
        reverse_sort = False  # lower is better (rank 1 is lowest)

    ranked = sorted(with_values, key=lambda x: x["value"], reverse=reverse_sort)
    return {"ranked": ranked, "missing": missing}

def compare_districts(
    district_id_a: str,
    district_id_b: str,
    indicator_slug: str,
    year: int
) -> List[Dict[str, Any]]:
    indicator = find_indicator(indicator_slug)
    if not indicator:
        return []

    comparison_rows = []
    for metric in indicator["metrics"]:
        val_a = get_metric_value(district_id_a, indicator_slug, metric["key"], year)
        val_b = get_metric_value(district_id_b, indicator_slug, metric["key"], year)

        diff = None
        diff_pct = None
        if val_a["value"] is not None and val_b["value"] is not None:
            diff = val_a["value"] - val_b["value"]
            if val_b["value"] != 0:
                diff_pct = (diff / val_b["value"]) * 100.0

        comparison_rows.append({
            "metric": metric,
            "a": val_a,
            "b": val_b,
            "diff": round(diff, metric["precision"]) if diff is not None else None,
            "diffPct": round(diff_pct, 1) if diff_pct is not None else None,
        })
    return comparison_rows

def search(query: str) -> List[Dict[str, str]]:
    q = query.strip().lower()
    if not q:
        return []
    results = []

    for state in STATES:
        if q in state["name"].lower():
            results.append({
                "type": "state",
                "label": state["name"],
                "sublabel": "State" if state["status"] == "available" else "Coming soon",
                "path": f"/india/{state['id']}",
            })

    for d in ALL_DISTRICTS:
        if q in d["name"].lower():
            st_name = d["stateId"].replace("-", " ").title()
            results.append({
                "type": "district",
                "label": d["name"],
                "sublabel": f"{st_name} · District",
                "path": f"/india/{d['stateId']}/{d['id']}",
            })

    for indicator in INDICATORS:
        if q in indicator["name"].lower():
            results.append({
                "type": "indicator",
                "label": indicator["name"],
                "sublabel": "Indicator",
                "path": f"/india/uttar-pradesh/lucknow/2024/{indicator['slug']}",
            })
        for metric in indicator["metrics"]:
            if q in metric["label"].lower():
                results.append({
                    "type": "metric",
                    "label": metric["label"],
                    "sublabel": f"{indicator['name']} · Metric",
                    "path": f"/india/uttar-pradesh/lucknow/2024/{indicator['slug']}",
                })

    return results[:25]

def get_complete_dataset_dataframe(state_id: Optional[str] = None) -> pd.DataFrame:
    """
    Builds a complete pandas DataFrame of all observations across
    Districts x Indicators x Metrics x Years.
    Extremely high performance for Machine Learning, EDA, and export.
    """
    districts = get_districts_for_state(state_id) if state_id else ALL_DISTRICTS
    records = []
    for d in districts:
        for ind in INDICATORS:
            for m in ind["metrics"]:
                for yr in YEARS:
                    mv = get_metric_value(d["id"], ind["slug"], m["key"], yr)
                    records.append({
                        "state": mv["state"],
                        "district_id": d["id"],
                        "district_name": d["name"],
                        "division": d.get("division", ""),
                        "indicator_slug": ind["slug"],
                        "indicator_name": ind["name"],
                        "metric_key": m["key"],
                        "metric_label": m["label"],
                        "year": yr,
                        "value": mv["value"],
                        "unit": mv["unit"],
                        "status": mv["status"],
                    })
    return pd.DataFrame(records)
