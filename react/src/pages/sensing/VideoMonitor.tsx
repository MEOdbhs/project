import { useState } from "react";
import { Video, Maximize2, Play, Pause, Volume2, Settings, Grid, LayoutGrid, RefreshCw } from "lucide-react";

const cameras = [
  { id: "cam001", name: "永靖县城区主干道01", location: "城关镇", status: "online", type: "道路监控" },
  { id: "cam002", name: "刘家峡水库大坝北侧", location: "刘家峡镇", status: "online", type: "水库监控" },
  { id: "cam003", name: "太极山地质监测点A", location: "太极乡", status: "online", type: "地质监控" },
  { id: "cam004", name: "西河林区瞭望塔01", location: "西河镇", status: "offline", type: "林区监控" },
  { id: "cam005", name: "某化工厂门口摄像", location: "盐锅峡镇", status: "online", type: "企业监控" },
  { id: "cam006", name: "露天煤矿采掘区", location: "三塬镇", status: "online", type: "矿山监控" },
  { id: "cam007", name: "黄河大桥水文站", location: "古城乡", status: "online", type: "水文监控" },
  { id: "cam008", name: "南山滑坡体监测点", location: "徐顶乡", status: "warn", type: "地质监控" },
  { id: "cam009", name: "新寺沟泥石流通道", location: "新寺乡", status: "online", type: "地质监控" },
  { id: "cam010", name: "平新工业区巡检点", location: "平新乡", status: "online", type: "工业监控" },
  { id: "cam011", name: "东湾镇山洪沟口", location: "东湾镇", status: "online", type: "水文监控" },
  { id: "cam012", name: "坪沟尾矿库坝体", location: "川城镇", status: "warn", type: "矿山监控" },
];

const gridOptions = [1, 4, 9];

export default function VideoMonitor() {
  const [selectedCam, setSelectedCam] = useState("cam001");
  const [gridSize, setGridSize] = useState(4);
  const [playing, setPlaying] = useState(true);
  const [filterType, setFilterType] = useState("全部");
  const [searchText, setSearchText] = useState("");

  const types = ["全部", ...Array.from(new Set(cameras.map((c) => c.type)))];
  const filtered = cameras.filter(
    (c) =>
      (filterType === "全部" || c.type === filterType) &&
      (searchText === "" || c.name.includes(searchText) || c.location.includes(searchText))
  );
  const displayCams = filtered.slice(0, gridSize);

  return (
    <div data-cmp="VideoMonitor" className="flex gap-3 p-4 h-full" style={{ minHeight: "calc(100vh - 112px)" }}>
      {/* Left Camera List */}
      <div
        className="flex flex-col flex-shrink-0 rounded overflow-hidden"
        style={{
          width: 220,
          background: `var(--tech-card)`,
          border: `1px solid var(--tech-border)`,
        }}
      >
        <div
          className="px-3 py-2 flex items-center gap-2 border-b flex-shrink-0"
          style={{ borderColor: `var(--tech-border)` }}
        >
          <Video size={14} style={{ color: `var(--tech-cyan)` }} />
          <span className="text-xs font-medium" style={{ color: `var(--tech-text)` }}>
            摄像头列表
          </span>
          <span
            className="ml-auto text-xs px-1.5 py-0.5 rounded"
            style={{ background: `var(--tech-cyan-dim)`, color: `var(--tech-cyan)` }}
          >
            {cameras.filter((c) => c.status === "online").length}/{cameras.length}
          </span>
        </div>
        <div className="px-2 py-2 flex-shrink-0">
          <input
            placeholder="搜索摄像头..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full text-xs px-2 py-1.5 rounded outline-none"
            style={{
              background: `var(--tech-input-bg)`,
              border: `1px solid var(--tech-border)`,
              color: `var(--tech-text)`,
            }}
          />
        </div>
        <div className="flex flex-wrap gap-1 px-2 pb-2 flex-shrink-0">
          {types.slice(0, 4).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                background: filterType === t ? `var(--tech-active)` : `var(--tech-input-bg)`,
                color: filterType === t ? `var(--tech-text)` : `var(--tech-text-dim)`,
                border: `1px solid var(--tech-border)`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto tech-scrollbar">
          {cameras.map((cam) => (
            <button
              key={cam.id}
              onClick={() => setSelectedCam(cam.id)}
              className="w-full flex flex-col px-3 py-2 text-left transition-all"
              style={{
                background: selectedCam === cam.id ? `var(--tech-cyan-dim)` : "transparent",
                borderLeft:
                  selectedCam === cam.id
                    ? `2px solid var(--tech-cyan)`
                    : "2px solid transparent",
                borderBottom: `1px solid var(--tech-border)`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      cam.status === "online"
                        ? `var(--tech-success)`
                        : cam.status === "warn"
                        ? `var(--tech-warning)`
                        : `var(--tech-text-dim)`,
                  }}
                />
                <span
                  className="text-xs truncate"
                  style={{
                    color:
                      selectedCam === cam.id ? `var(--tech-cyan)` : `var(--tech-text)`,
                  }}
                >
                  {cam.name}
                </span>
              </div>
              <span className="text-xs mt-0.5 pl-3.5" style={{ color: `var(--tech-text-dim)` }}>
                {cam.location} · {cam.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Video Grid */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Toolbar */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded"
          style={{ background: `var(--tech-card)`, border: `1px solid var(--tech-border)` }}
        >
          <span className="text-xs" style={{ color: `var(--tech-text)` }}>
            视频墙布局：
          </span>
          {gridOptions.map((g) => (
            <button
              key={g}
              onClick={() => setGridSize(g)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs"
              style={{
                background: gridSize === g ? `var(--tech-active)` : `var(--tech-input-bg)`,
                color: gridSize === g ? `var(--tech-text)` : `var(--tech-text-dim)`,
                border: `1px solid var(--tech-border)`,
              }}
            >
              {g === 1 ? <Maximize2 size={12} /> : g === 4 ? <Grid size={12} /> : <LayoutGrid size={12} />}
              {g === 1 ? "单画面" : g === 4 ? "四分屏" : "九分屏"}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{
              background: `var(--tech-input-bg)`,
              color: `var(--tech-text-dim)`,
              border: `1px solid var(--tech-border)`,
            }}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? "暂停" : "播放"}
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{
              background: `var(--tech-input-bg)`,
              color: `var(--tech-text-dim)`,
              border: `1px solid var(--tech-border)`,
            }}
          >
            <Volume2 size={12} />
            音量
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{
              background: `var(--tech-input-bg)`,
              color: `var(--tech-text-dim)`,
              border: `1px solid var(--tech-border)`,
            }}
          >
            <Settings size={12} />
            设置
          </button>
        </div>

        {/* Video Grid */}
        <div
          className="flex-1 flex flex-wrap gap-2"
          style={{ alignContent: "flex-start" }}
        >
          {displayCams.map((cam, idx) => (
            <div
              key={cam.id}
              onClick={() => setSelectedCam(cam.id)}
              className="relative rounded overflow-hidden cursor-pointer"
              style={{
                width: gridSize === 1 ? "100%" : gridSize === 4 ? "calc(50% - 4px)" : "calc(33.33% - 6px)",
                height: gridSize === 1 ? 420 : gridSize === 4 ? 220 : 160,
                background: `rgba(0, 15, 40, 0.9)`,
                border: selectedCam === cam.id ? `1px solid var(--tech-cyan)` : `1px solid var(--tech-border)`,
              }}
            >
              {/* Simulated video background */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, rgba(0,20,60,0.9) 0%, rgba(0,40,80,0.7) 100%)`,
                }}
              >
                <div className="text-center">
                  <Video
                    size={gridSize === 1 ? 48 : 28}
                    style={{ color: `var(--tech-border)`, margin: "0 auto" }}
                  />
                  <p
                    className="text-xs mt-2"
                    style={{ color: `var(--tech-text-dim)` }}
                  >
                    {cam.status === "offline" ? "摄像头离线" : "视频加载中..."}
                  </p>
                </div>
              </div>

              {/* Scanline effect */}
              {cam.status !== "offline" && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)`,
                  }}
                />
              )}

              {/* Overlay info */}
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between"
                style={{ background: `rgba(0,0,0,0.5)` }}
              >
                <span className="text-xs truncate" style={{ color: `var(--tech-text)`, maxWidth: "70%" }}>
                  {cam.name}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        cam.status === "online"
                          ? `var(--tech-success)`
                          : cam.status === "warn"
                          ? `var(--tech-warning)`
                          : `var(--tech-text-dim)`,
                    }}
                  />
                  <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>
                    {cam.status === "online" ? "在线" : cam.status === "warn" ? "预警" : "离线"}
                  </span>
                </div>
              </div>

              {/* Top left label */}
              <div
                className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{ background: `rgba(0,0,0,0.5)` }}
              >
                <span className="text-xs" style={{ color: `var(--tech-text-dim)` }}>
                  CH{String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* AI badge */}
              {idx % 3 === 0 && (
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs"
                  style={{
                    background: `var(--tech-cyan-dim)`,
                    border: `1px solid var(--tech-cyan)`,
                    color: `var(--tech-cyan)`,
                  }}
                >
                  AI
                </div>
              )}

              {/* Warn overlay */}
              {cam.status === "warn" && (
                <div
                  className="absolute inset-0 pointer-events-none rounded"
                  style={{
                    border: `2px solid var(--tech-warning)`,
                    boxShadow: `inset 0 0 20px rgba(250,173,20,0.15)`,
                  }}
                />
              )}

              {/* Refresh button on hover area */}
              <button
                className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center opacity-70 hover:opacity-100"
                style={{
                  background: `rgba(0,0,0,0.5)`,
                  display: idx % 3 === 0 ? "none" : "flex",
                }}
                onClick={(e) => { e.stopPropagation(); console.log("refresh cam", cam.id); }}
              >
                <RefreshCw size={11} style={{ color: `var(--tech-text-dim)` }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
