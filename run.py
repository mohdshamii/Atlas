"""
India Data Atlas - Application Runner
Launches the Flask web server and API engine.
Usage:
    python run.py
"""

import sys
from app import app

def main():
    port = 5000
    host = "127.0.0.1"

    print("=" * 70)
    print(" INDIA DATA ATLAS — SOVEREIGN CIVIC INTELLIGENCE ENGINE")
    print(" Powered by Python 3, Flask, Three.js & Scikit-Learn")
    print("=" * 70)
    print(f" * Local Server running at: http://{host}:{port}")
    print(f" * Web Views: Home, States, Districts, Indicators, Compare, AI Copilot, 3D Studio, ML Studio")
    print(f" * REST API:  http://{host}:{port}/api/districts")
    print("=" * 70)

    try:
        app.run(host=host, port=port, debug=True)
    except KeyboardInterrupt:
        print("\n[+] India Data Atlas server stopped gracefully.")
        sys.exit(0)

if __name__ == "__main__":
    main()
