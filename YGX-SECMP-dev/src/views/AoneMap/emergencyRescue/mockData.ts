export type MapLevel = 'county' | 'town' | 'resource';

export type ResourceTypeName = '救援队伍' | '物资仓库' | '医疗站点' | '应急通道';

/** center 为 [lng, lat] WGS-84，与 Leaflet 中 [lat,lng] 对应 */
export interface TownItem {
  name: string;
  center: [number, number];
  teams: number;
  materials: number;
  medicals: number;
  channels: number;
}

/** position 为 [lng, lat] WGS-84 */
export type ResourceRecord = {
  name: string;
  type: ResourceTypeName;
  subType: string;
  town: string;
  position: [number, number];
  status: string;
  personnel?: number;
  equipment?: string;
  level?: string;
  materials?: string;
  expireAlert?: number;
  beds?: number;
  icu?: number;
  ambulances?: number;
  endpoint?: string;
  distance?: number;
};

export const townData: TownItem[] = [
  { name: '刘家峡镇', center: [103.30337, 35.93894], teams: 3, materials: 2, medicals: 2, channels: 4 },
  { name: '盐锅峡镇', center: [103.28362, 36.07348], teams: 2, materials: 2, medicals: 1, channels: 3 },
  { name: '太极镇', center: [103.26999, 35.9604], teams: 2, materials: 1, medicals: 1, channels: 2 },
  { name: '岘塬镇', center: [103.26986, 35.91197], teams: 1, materials: 1, medicals: 1, channels: 2 },
  { name: '三塬镇', center: [103.20037, 35.89076], teams: 1, materials: 1, medicals: 0, channels: 1 },
  { name: '王台镇', center: [103.03425, 35.88155], teams: 1, materials: 0, medicals: 0, channels: 1 },
  { name: '红泉镇', center: [103.145, 35.904], teams: 1, materials: 0, medicals: 1, channels: 1 },
  { name: '川城镇', center: [103.216, 36.035], teams: 0, materials: 1, medicals: 0, channels: 1 },
  { name: '新寺乡', center: [103.02426, 36.04378], teams: 1, materials: 0, medicals: 0, channels: 0 },
  { name: '小岭乡', center: [103.05, 35.82], teams: 0, materials: 0, medicals: 0, channels: 0 },
];

export const resourceData: ResourceRecord[] = [
  { name: '永靖县消防救援大队', type: '救援队伍', subType: '专业队伍', town: '刘家峡镇', position: [103.30337, 35.93894], personnel: 45, equipment: '消防车6辆、云梯车2辆、救援艇3艘', status: '可用', level: '一级资质' },
  { name: '刘家峡镇专业救援队', type: '救援队伍', subType: '专业队伍', town: '刘家峡镇', position: [103.29837, 35.93394], personnel: 25, equipment: '救援车4辆、挖掘机2台', status: '可用', level: '二级资质' },
  { name: '刘家峡镇志愿救援队', type: '救援队伍', subType: '志愿队伍', town: '刘家峡镇', position: [103.30837, 35.94394], personnel: 18, equipment: '基础救援装备', status: '可用', level: '三级资质' },
  { name: '盐锅峡镇森林消防队', type: '救援队伍', subType: '专业队伍', town: '盐锅峡镇', position: [103.28362, 36.07348], personnel: 30, equipment: '消防车4辆、风力灭火机15台', status: '占用', level: '一级资质' },
  { name: '盐锅峡镇志愿救援队', type: '救援队伍', subType: '志愿队伍', town: '盐锅峡镇', position: [103.27862, 36.06848], personnel: 15, equipment: '基础救援装备', status: '可用', level: '三级资质' },
  { name: '太极镇专业救援队', type: '救援队伍', subType: '专业队伍', town: '太极镇', position: [103.26999, 35.9604], personnel: 20, equipment: '救援车3辆', status: '可用', level: '二级资质' },
  { name: '太极镇志愿救援队', type: '救援队伍', subType: '志愿队伍', town: '太极镇', position: [103.26499, 35.9554], personnel: 12, equipment: '基础救援装备', status: '可用', level: '三级资质' },
  { name: '岘塬镇救援队', type: '救援队伍', subType: '专业队伍', town: '岘塬镇', position: [103.26986, 35.91197], personnel: 18, equipment: '救援车2辆', status: '可用', level: '二级资质' },
  { name: '三塬镇志愿救援队', type: '救援队伍', subType: '志愿队伍', town: '三塬镇', position: [103.20037, 35.89076], personnel: 10, equipment: '基础救援装备', status: '可用', level: '三级资质' },
  { name: '王台镇救援队', type: '救援队伍', subType: '专业队伍', town: '王台镇', position: [103.03425, 35.88155], personnel: 15, equipment: '救援车2辆', status: '可用', level: '二级资质' },
  { name: '红泉镇志愿救援队', type: '救援队伍', subType: '志愿队伍', town: '红泉镇', position: [103.145, 35.904], personnel: 12, equipment: '基础救援装备', status: '可用', level: '三级资质' },
  { name: '新寺乡志愿救援队', type: '救援队伍', subType: '志愿队伍', town: '新寺乡', position: [103.02426, 36.04378], personnel: 8, equipment: '基础救援装备', status: '离线', level: '三级资质' },
  { name: '县级物资储备中心', type: '物资仓库', subType: '综合仓库', town: '刘家峡镇', position: [103.30537, 35.94094], materials: '抢险装备256件、防护用品1520套、生活物资3200件', status: '可用', expireAlert: 3 },
  { name: '刘家峡镇物资仓库', type: '物资仓库', subType: '镇级仓库', town: '刘家峡镇', position: [103.30137, 35.93694], materials: '抢险装备80件、防护用品300套', status: '可用', expireAlert: 1 },
  { name: '盐锅峡镇物资仓库', type: '物资仓库', subType: '镇级仓库', town: '盐锅峡镇', position: [103.28162, 36.07148], materials: '森林消防装备150件、防护用品200套', status: '可用', expireAlert: 0 },
  { name: '太极镇物资仓库', type: '物资仓库', subType: '镇级仓库', town: '太极镇', position: [103.26799, 35.9584], materials: '抢险装备60件、防护用品150套', status: '可用', expireAlert: 2 },
  { name: '岘塬镇物资仓库', type: '物资仓库', subType: '镇级仓库', town: '岘塬镇', position: [103.26786, 35.90997], materials: '抢险装备40件、防护用品100套', status: '可用', expireAlert: 0 },
  { name: '三塬镇物资仓库', type: '物资仓库', subType: '镇级仓库', town: '三塬镇', position: [103.19837, 35.88876], materials: '抢险装备30件、防护用品80套', status: '可用', expireAlert: 0 },
  { name: '川城镇物资仓库', type: '物资仓库', subType: '镇级仓库', town: '川城镇', position: [103.216, 36.035], materials: '抢险装备20件、防护用品50套', status: '可用', expireAlert: 0 },
  { name: '永靖县医疗物资仓库', type: '物资仓库', subType: '医疗仓库', town: '刘家峡镇', position: [103.31137, 35.94694], materials: '急救药品包、医疗设备', status: '可用', expireAlert: 5 },
  { name: '永靖县人民医院', type: '医疗站点', subType: '县级医院', town: '刘家峡镇', position: [103.29337, 35.92894], beds: 120, icu: 20, ambulances: 8, level: 'A级', status: '可用' },
  { name: '刘家峡镇卫生院', type: '医疗站点', subType: '镇级医院', town: '刘家峡镇', position: [103.29837, 35.93394], beds: 60, icu: 8, ambulances: 3, level: 'B级', status: '占用' },
  { name: '盐锅峡镇卫生院', type: '医疗站点', subType: '镇级医院', town: '盐锅峡镇', position: [103.28562, 36.07548], beds: 50, icu: 5, ambulances: 2, level: 'B级', status: '可用' },
  { name: '太极镇卫生院', type: '医疗站点', subType: '镇级医院', town: '太极镇', position: [103.27199, 35.9624], beds: 40, icu: 5, ambulances: 2, level: 'B级', status: '可用' },
  { name: '岘塬镇卫生院', type: '医疗站点', subType: '镇级医院', town: '岘塬镇', position: [103.27186, 35.91397], beds: 30, icu: 3, ambulances: 2, level: 'C级', status: '可用' },
  { name: '红泉镇卫生院', type: '医疗站点', subType: '镇级医院', town: '红泉镇', position: [103.15, 35.909], beds: 20, icu: 2, ambulances: 1, level: 'C级', status: '可用' },
  { name: '永靖县中医院', type: '医疗站点', subType: '县级医院', town: '刘家峡镇', position: [103.31337, 35.94894], beds: 80, icu: 10, ambulances: 3, level: 'A级', status: '可用' },
  { name: 'G213国道-永靖段', type: '应急通道', subType: '国道', town: '刘家峡镇', position: [103.30337, 35.94894], endpoint: '盐锅峡镇', distance: 15, status: '畅通' },
  { name: '永靖县主干道A线', type: '应急通道', subType: '县道', town: '刘家峡镇', position: [103.31337, 35.93894], endpoint: '太极镇', distance: 12, status: '畅通' },
  { name: '乡村公路B线', type: '应急通道', subType: '乡道', town: '岘塬镇', position: [103.26986, 35.90197], endpoint: '三塬镇', distance: 8, status: '施工' },
  { name: '刘家峡应急疏散道', type: '应急通道', subType: '疏散通道', town: '刘家峡镇', position: [103.29337, 35.94894], endpoint: '县城东部', distance: 5, status: '畅通' },
  { name: '盐锅峡林区通道', type: '应急通道', subType: '林区通道', town: '盐锅峡镇', position: [103.28362, 36.08348], endpoint: '北部林区', distance: 6, status: '畅通' },
  { name: '太极镇应急通道', type: '应急通道', subType: '镇级通道', town: '太极镇', position: [103.26999, 35.9704], endpoint: '南部区域', distance: 4, status: '畅通' },
  { name: '岘塬镇主干道', type: '应急通道', subType: '镇级通道', town: '岘塬镇', position: [103.26986, 35.92197], endpoint: '西部区域', distance: 3, status: '畅通' },
  { name: '三塬镇应急通道', type: '应急通道', subType: '镇级通道', town: '三塬镇', position: [103.20037, 35.90076], endpoint: '西南区域', distance: 2, status: '畅通' },
  { name: '王台镇通道', type: '应急通道', subType: '镇级通道', town: '王台镇', position: [103.03425, 35.89155], endpoint: '东北区域', distance: 3, status: '畅通' },
  { name: '红泉镇通道', type: '应急通道', subType: '镇级通道', town: '红泉镇', position: [103.145, 35.914], endpoint: '南部区域', distance: 2, status: '畅通' },
  { name: '川城镇通道', type: '应急通道', subType: '镇级通道', town: '川城镇', position: [103.216, 36.045], endpoint: '东部区域', distance: 2, status: '畅通' },
  { name: '新寺乡通道', type: '应急通道', subType: '乡级通道', town: '新寺乡', position: [103.02426, 36.05378], endpoint: '西部区域', distance: 1, status: '畅通' },
  { name: '森林消防专用道', type: '应急通道', subType: '专用通道', town: '刘家峡镇', position: [103.29337, 35.95894], endpoint: '北部林区', distance: 10, status: '畅通' },
  { name: '永靖县环城通道', type: '应急通道', subType: '县级通道', town: '刘家峡镇', position: [103.30837, 35.95394], endpoint: '环城路', distance: 8, status: '畅通' },
  { name: '跨区域应急通道', type: '应急通道', subType: '跨区域通道', town: '刘家峡镇', position: [103.32337, 35.93894], endpoint: '兰州方向', distance: 50, status: '畅通' },
];

export const teamDrillCounts: Record<string, number> = {
  永靖县消防救援大队: 3,
  刘家峡镇专业救援队: 2,
  盐锅峡镇森林消防队: 4,
  盐锅峡镇志愿救援队: 1,
  太极镇专业救援队: 2,
  太极镇志愿救援队: 1,
  岘塬镇救援队: 2,
  三塬镇志愿救援队: 1,
  王台镇救援队: 1,
  红泉镇志愿救援队: 1,
  新寺乡志愿救援队: 0,
  刘家峡镇志愿救援队: 1,
};

export function computeOverviewStats(level: MapLevel, townName: string | null, resourceName: string | null) {
  if (level === 'resource' && resourceName) {
    return { teams: 1, materials: 0, medicals: 0, channels: 0 };
  }
  if (level === 'town' && townName) {
    const tr = resourceData.filter((r) => r.town === townName);
    return {
      teams: tr.filter((r) => r.type === '救援队伍').length,
      materials: tr.filter((r) => r.type === '物资仓库').length,
      medicals: tr.filter((r) => r.type === '医疗站点').length,
      channels: tr.filter((r) => r.type === '应急通道').length,
    };
  }
  return {
    teams: resourceData.filter((r) => r.type === '救援队伍').length,
    materials: resourceData.filter((r) => r.type === '物资仓库').length,
    medicals: resourceData.filter((r) => r.type === '医疗站点').length,
    channels: resourceData.filter((r) => r.type === '应急通道').length,
  };
}
