import cv2
import numpy as np
import os
import json

def get_edges(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    edges = cv2.Canny(blur, 40, 130)
    return edges

def main():
    base_dir = '/workspace/tuanyin/assets'
    bg_path = os.path.join(base_dir, 'all.jpg')
    
    print('Loading all.jpg ...')
    bg_img = cv2.imread(bg_path)
    bg_h, bg_w = bg_img.shape[:2]
    print(f'all.jpg size: {bg_w}x{bg_h}')
    
    print('Extracting edges for all.jpg ...')
    bg_edges = get_edges(bg_img)
    
    files = [
        "亚坛高原-Altus Plateau.png",
        "宁姆格福-Limgrave.png",
        "巨人山顶-Mountaintops of the Giants.png",
        "湖之利耶尼亚-Liurnia of the Lakes.png",
        "盖里德.png"
    ]
    
    results = {}
    
    for f in files:
        print(f'Matching {f} ...')
        p = os.path.join(base_dir, f)
        img = cv2.imread(p)
        h, w = img.shape[:2]
        
        edges = get_edges(img)
        res = cv2.matchTemplate(bg_edges, edges, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
        
        x, y = max_loc
        
        results[f] = {
            "x": x,
            "y": y,
            "w": w,
            "h": h,
            "x_pct": round(x / bg_w * 100, 4),
            "y_pct": round(y / bg_h * 100, 4),
            "w_pct": round(w / bg_w * 100, 4),
            "h_pct": round(h / bg_h * 100, 4),
            "score": float(max_val)
        }
        print(f' -> Found at ({x}, {y}) with score {max_val}')

    with open('/workspace/tuanyin/positions.json', 'w') as out:
        json.dump(results, out, ensure_ascii=False, indent=2)
    print('Saved to positions.json')

if __name__ == '__main__':
    main()
