import json
import subprocess

files = [
    "亚坛高原-Altus Plateau.png",
    "宁姆格福-Limgrave.png",
    "巨人山顶-Mountaintops of the Giants.png",
    "湖之利耶尼亚-Liurnia of the Lakes.png",
    "盖里德.png"
]

def get_dims(f):
    cmd = ["file", "/workspace/tuanyin/assets/" + f]
    out = subprocess.check_output(cmd).decode('utf-8')
    return out

print(get_dims('all.jpg'))
for f in files:
    print(get_dims(f))

