"""
Comprehensive Test Suite for India Data Atlas Flask Web Application and REST APIs.
"""

import unittest
from app import app

class AtlasAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_page(self):
        res = self.app.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Sovereign District Data", res.data)

    def test_state_view(self):
        res = self.app.get("/india/uttar-pradesh")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Uttar Pradesh", res.data)

    def test_district_view(self):
        res = self.app.get("/india/uttar-pradesh/lucknow")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Lucknow", res.data)

    def test_indicator_view(self):
        res = self.app.get("/india/uttar-pradesh/lucknow/2024/education")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Education", res.data)
        self.assertIn(b"Literacy Rate", res.data)

    def test_compare_view(self):
        res = self.app.get("/compare?a=lucknow&b=kanpur-nagar&indicator=education&year=2024")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"District Comparative Analysis", res.data)

    def test_intelligence_view(self):
        res = self.app.get("/intelligence?tab=copilot&district=lucknow")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Civic Intelligence & Policy Studio", res.data)

    def test_3d_visualizer_view(self):
        res = self.app.get("/3d-visualizer")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"3D Geospatial Studio", res.data)

    def test_ml_studio_view(self):
        res = self.app.get("/ml-studio?district=lucknow")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Predictive Analytics & Clustering Studio", res.data)

    def test_data_sources_view(self):
        res = self.app.get("/data-sources")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Data Sources & Provenance", res.data)

    def test_search_view(self):
        res = self.app.get("/search?q=lucknow")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Search Results", res.data)

    def test_api_districts(self):
        res = self.app.get("/api/districts")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 50)

    def test_api_search(self):
        res = self.app.get("/api/search?q=lucknow")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertTrue(any("Lucknow" in item["label"] for item in data))

    def test_api_ml_forecast(self):
        res = self.app.get("/api/ml/forecast?district=lucknow&indicator=education&metric=literacy_rate")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("projections", data)
        self.assertEqual(len(data["projections"]), 6)

    def test_api_ml_clusters(self):
        res = self.app.get("/api/ml/clusters?state=uttar-pradesh&year=2024")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("districts", data)
        self.assertEqual(len(data["districts"]), 75)

    def test_api_export_csv(self):
        res = self.app.get("/api/export/csv?district=lucknow")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"district_name", res.data)
        self.assertIn(b"Lucknow", res.data)

if __name__ == "__main__":
    unittest.main()
