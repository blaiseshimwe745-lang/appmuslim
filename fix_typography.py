import re

with open('C:/Users/Admin/Desktop/barakah-app/index.html', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Remove excessive letter-spacing micro-adjustments
css = re.sub(r'\s+letter-spacing:\s*[-]?\d+(\.\d+)?px;', '', css)

# 2. Remove font-variant-numeric: tabular-nums
css = re.sub(r'\s+font-variant-numeric:\s*tabular-nums;', '', css)

# 3. Tone down extreme font weights
css = css.replace('font-weight: 900;', 'font-weight: 700;')
css = css.replace('font-weight: 800;', 'font-weight: 700;')

# 4. Fix line-heights that are too tight
css = css.replace('line-height: 1;', 'line-height: 1.2;')
css = css.replace('line-height: 1.15;', 'line-height: 1.25;')

# 5. Remove decimal font-sizes
css = css.replace('font-size: 13.5px;', 'font-size: 14px;')
css = css.replace('font-size: 12.5px;', 'font-size: 13px;')

# 6. Remove aggressive text-rendering polish
css = css.replace('-webkit-font-smoothing: antialiased;', '')
css = css.replace('-moz-osx-font-smoothing: grayscale;', '')
css = css.replace('text-rendering: optimizeLegibility;', '')

# 7. Make massive streak numbers slightly less aggressive
css = css.replace('font-size: 64px;', 'font-size: 56px;')

with open('C:/Users/Admin/Desktop/barakah-app/index.html', 'w', encoding='utf-8') as f:
    f.write(css)

print('Done. Typography cleaned up.')
