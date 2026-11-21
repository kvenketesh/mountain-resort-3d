#!/usr/bin/env python3
"""
ALPINESCAPE - Local Web Server
Runs a lightweight local web server to host the 3D application.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    port = PORT
    for p in range(PORT, PORT + 10):
        try:
            with socketserver.TCPServer(("", p), Handler) as httpd:
                print("=" * 60)
                print(f"🏔️  ALPINESCAPE 3D APPLICATION RUNNING")
                print(f"👉 Local URL: http://localhost:{p}")
                print("=" * 60)
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
