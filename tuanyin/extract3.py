import cv2
import numpy as np

# We process images with lower resolution for speed.
scale = 0.1

def get_edges(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    edges = cv2.Canny(blur, 40, 130)
    return edges

bg = cv2.imread('/workspace/tuanyin/assets/all.jpg')
bg_small = cv2.resize(bg, (0, 0), fx=scale, fy=scale)
bg_edges = get_edges(bg_small)

bg_h, bg_w = bg.shape[:2]
results = {}

files = [
    "亚坛高原-Altus Plateau.png",
    "宁姆格福-Limgrave.png",
    "巨人山顶-Mountaintops of the Giants.png",
    "湖之利耶尼亚-Liurnia of the Lakes.png",
    "盖里德.png"
]

for f in files:
    img = cv2.imread('/workspace/tuanyin/assets/' + f)
    h, w = img.shape[:2]
    img_small = cv2.resize(img, (0, 0), fx=scale, fy=scale)
    edges = get_edges(img_small)
    
    res = cv2.matchTemplate(bg_edges, edges, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(res)
    
    # Scale back coordinates
    x = max_loc[0] / scale
    y = max_loc[1] / scale
    
    results[f] = {
        "x": round(x),
        "y": round(y),
        "w": w,
        "h": h,
        "x_pct": round(x / bg_w * 100, 4),
        "y_pct": round(y / bg_h * 100, 4),
        "w_pct": round(w / bg_w * 100, 4),
        "h_pct": round(h / bg_h * 100, 4),
    }

import json
with open('/workspace/tuanyin/positions.json', 'w') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print("done")
