#!/usr/bin/env python3
"""Verification runner for GeoExplorer. See SKILL.md."""
import json, os, re, subprocess, sys, time
from pathlib import Path
REPO = Path(__file__).resolve().parents[3]
APP = REPO / 'geoexplorer'
CHROME = os.environ.get('CHROME_PATH', '/usr/bin/google-chrome')
failures = []
def check(name, ok, detail=''):
    print(('PASS' if ok else 'FAIL'), name, (':: ' + str(detail))[:400] if detail else '')
    if not ok: failures.append(name)
def run(cmd, **kw):
    return subprocess.run(cmd, cwd=APP, capture_output=True, text=True, timeout=900, **kw)
def main():
    if not (APP / 'node_modules').is_dir():
        # google-maps-react@2.0.6 predates react 19; legacy peer resolution is required.
        check('npm install (--legacy-peer-deps)', run(['npm', 'install', '--legacy-peer-deps', '--no-audit', '--no-fund']).returncode == 0)

    env = dict(os.environ, CI='true')
    proc = run(['npm', 'test', '--', '--watchAll=false'], env=env)
    tail = proc.stdout + proc.stderr
    check('react-scripts test (2 tests)', proc.returncode == 0 and 'Tests:' in tail and 'failed' not in tail, tail[-300:])
    # No CI=true here: it turns this old CRA app's caniuse-lite staleness warning fatal.
    proc = run(['npm', 'run', 'build'])
    check('react-scripts build', proc.returncode == 0 and (APP / 'build' / 'index.html').exists(), (proc.stdout + proc.stderr)[-300:])
    server = subprocess.Popen([sys.executable, '-m', 'http.server', '4194', '--bind', '127.0.0.1'], cwd=APP / 'build', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.5)
        proc = subprocess.run([CHROME, '--headless=new', '--no-sandbox', '--disable-gpu',
                               '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1',
                               '--virtual-time-budget=8000', '--window-size=1280,900',
                               '--dump-dom', 'http://127.0.0.1:4194/'],
                              capture_output=True, text=True, timeout=120)
        dom = proc.stdout
        check('render: built app boots', len(dom) > 500 and 'root' in dom, dom[:200])
    finally:
        server.terminate()
    print('FAILURES=%d' % len(failures))
    with open(REPO / '.cursor/skills/verify-geo-explorer/evidence.json', 'w') as f:
        json.dump({'repo': 'GeoExplorer', 'ts': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'failures': failures}, f, indent=2)
    return 1 if failures else 0
if __name__ == '__main__':
    sys.exit(main())
