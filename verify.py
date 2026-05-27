import urllib.request
d = urllib.request.urlopen('http://127.0.0.1:8080/').read().decode()
checks = ['tabHeute', 'tabBilanz', 'tabIch', 'phone-wrapper', 'dynamic-island', 'prayerGroup']
for c in checks:
    print(f'{c}: {"✅" if c in d else "❌"}')
print(f'Size: {len(d)} bytes')
