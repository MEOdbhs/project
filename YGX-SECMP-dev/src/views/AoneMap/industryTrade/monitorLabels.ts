import type { Enterprise } from './types';

export function monitorStatusLabel(status: Enterprise['realTimeData']['status']): string {
  if (status === 'alarm') return '报警';
  if (status === 'warning') return '预警';
  return '正常';
}
