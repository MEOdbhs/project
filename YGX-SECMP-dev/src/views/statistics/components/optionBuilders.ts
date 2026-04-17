import type { EChartsOption } from 'echarts'
import dayjs from 'dayjs'

/**
 * 构建表面位移-速度/加速度图表配置
 */
export function buildSpeedChartOptions(cacheData: Array<any>): {
    speedOption: EChartsOption
    accelOption: EChartsOption
} {
    const xData: Array<string> = []

    const speedOption: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: 'mm/h' },
    }

    const accelOption: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: 'mm/h²' },
    }

    const serieX = {
        name: 'X方向速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + 'mm/h'
            },
        },
    }
    const serieY = {
        name: 'Y方向速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + 'mm/h'
            },
        },
    }
    const serieZ = {
        name: 'Z方向速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + 'mm/h'
            },
        },
    }

    const serieX1 = {
        name: 'X方向加速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + 'mm/h²'
            },
        },
    }
    const serieY1 = {
        name: 'Y方向加速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + 'mm/h²'
            },
        },
    }
    const serieZ1 = {
        name: 'Z方向加速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + 'mm/h²'
            },
        },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.collectDate)
        serieX.data.push(item.xSpeed)
        serieY.data.push(item.ySpeed)
        serieZ.data.push(item.zSpeed)
        serieX1.data.push(item.xAccSpeed)
        serieY1.data.push(item.yAccSpeed)
        serieZ1.data.push(item.zAccSpeed)
    });

    (speedOption as any).legend.data = ['X方向速度', 'Y方向速度', 'Z方向速度'];
    (accelOption as any).legend.data = ['X方向加速度', 'Y方向加速度', 'Z方向加速度'];
    (speedOption as any).series = [serieX, serieY, serieZ] as any;
    (accelOption as any).series = [serieX1, serieY1, serieZ1] as any
    speedOption.xAxis = { data: xData } as any
    accelOption.xAxis = { data: xData } as any

    return { speedOption, accelOption }
}

/**
 * 构建倾角/加速度图表配置
 */
export function buildAngleChartOptions(cacheData: Array<any>, isBmwy = false): {
    angleOption: EChartsOption
    accelOption: EChartsOption
} {
    const xData: Array<string> = []

    const angleOption: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: '°' },
    }
    let unit = 'mg'
    if (isBmwy) {
        unit = 'g'
    }
    const accelOption: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit },
    }

    const serieX = {
        name: 'X轴倾角',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + '°'
            },
        },
    }
    const serieY = {
        name: 'Y轴倾角',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + '°'
            },
        },
    }
    const serieZ = {
        name: 'Z轴倾角',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + '°'
            },
        },
    }
    const serieV = {
        name: '合倾角',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + '°'
            },
        },
    }

    const serieDX = {
        name: 'X加速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + unit
            },
        },
    }
    const serieDY = {
        name: 'Y加速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + unit
            },
        },
    }
    const serieDZ = {
        name: 'Z加速度',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: {
            valueFormatter: function (value: number | string) {
                return value + unit
            },
        },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.collectDate)
        // 倾角，兼容老字段(ax/ay/az)与新字段(x/y/z)
        const angleX = item.x ?? item.ax
        const angleY = item.y ?? item.ay
        const angleZ = item.z ?? item.az
        serieX.data.push(angleX)
        serieY.data.push(angleY)
        serieZ.data.push(angleZ)
        // 合倾角
        // serieV.data.push(item.value);
        // 加速度，兼容老字段(gx/gy/gz)与新字段(dx/dy/dz)
        const accelX = (item.dx ?? item.gx)
        const accelY = (item.dy ?? item.gy)
        const accelZ = (item.dz ?? item.gz)
        serieDX.data.push(accelX)
        serieDY.data.push(accelY)
        serieDZ.data.push(accelZ)
    });

    //   (angleOption as any).legend.data = ['X轴倾角', 'Y轴倾角', 'Z轴倾角', '合倾角'];
    (angleOption as any).legend.data = ['X轴倾角', 'Y轴倾角', 'Z轴倾角'];
    (accelOption as any).legend.data = ['X加速度', 'Y加速度', 'Z加速度'];
    (angleOption as any).series = [serieX, serieY, serieZ, serieV] as any;
    (accelOption as any).series = [serieDX, serieDY, serieDZ] as any
    angleOption.xAxis = { data: xData } as any
    accelOption.xAxis = { data: xData } as any

    return { angleOption, accelOption }
}

function findMaxAndMin(arr: Array<string | number>, defaultValue = 50) {
    if (arr.length === 0) {
        return { max: defaultValue, min: -defaultValue }
    }
    const numArr = arr.map((v) => Number(v))
    const max = numArr.reduce((acc, cur) => Math.max(acc, cur), Number.MIN_SAFE_INTEGER)
    const min = numArr.reduce((acc, cur) => Math.min(acc, cur), Number.MAX_SAFE_INTEGER)
    return { max: Number(max), min: Number(min) }
}

/**
 * 内部位移曲线构建
 */
export function buildNbwyLineOptions(
    dataObj: Record<string, Array<any>>,
    currentDevice: any,
    showDirection: 'x' | 'y' = 'y',
    isSecond = false,
): EChartsOption {
    const seriesData: any[] = []
    const cacheHoleDepth: Array<any> = []
    const maxHoleDepth = Number(currentDevice.holeDepth)
    let maxAll = 0
    let minAll = 0

    let opt: EChartsOption

    if (showDirection === 'y') {
        opt = {
            title: {
                text: isSecond ? '内部位移Y向' : '内部位移X向',
                left: 'center',
                top: 'top',
                textStyle: { fontSize: 16, fontWeight: 'normal' },
                subtext: '累计偏移(mm)',
                subtextStyle: { align: 'right' },
            },
            tooltip: {
                confine: true,
                enterable: true,
                triggerOn: 'click',
                hideDelay: 2000,
                extraCssText: 'max-height:400px;overflow-y:auto',
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 50,
                bottom: '10%',
                data: [] as Array<string>,
            },
            grid: { left: '5%', right: '180', bottom: '10%', containLabel: true },
            xAxis: { type: 'value', show: true, position: 'top', max: 0 as any, min: 0 as any, axisTick: { show: false } },
            yAxis: {
                type: 'value',
                name: '孔深(米)',
                inverse: true,
                min: 0,
                max: maxHoleDepth,
                splitNumber: maxHoleDepth,
                splitLine: { show: false },
                axisTick: { show: false, interval: 0 },
                axisLabel: { interval: 0, showMinLabel: true, showMaxLabel: true } as any,
                data: [] as any[],
                axisPointer: { show: true, snap: true, label: { show: false, precision: 0 } },
            },
            series: [] as any,
            dataZoom: [],
        } as EChartsOption;
        // 动态 formatter
        (opt as any).tooltip.formatter = function (params: any) {
            let value = params[0].value[1]
            if (value === Number(currentDevice.holeDepth)) return ''
            if (cacheHoleDepth.includes(value) || cacheHoleDepth.includes(value.toString())) {
                let tooltip = `${params[0].value[1]}<br>`
                params.forEach((param: any) => {
                    tooltip += `${param.marker} ${param.seriesName} <span style="margin-left:20px;color:#000">${param.value[0]}mm</span><br>`
                })
                return tooltip
            }
            return ''
        }
    } else {
        opt = {
            title: {
                text: '内部位移Y向',
                left: 'center',
                top: 'top',
                textStyle: { fontSize: 16, fontWeight: 'normal' },
                subtext: '累计偏移(mm)',
                subtextStyle: { align: 'right' },
            },
            tooltip: {
                confine: true,
                enterable: true,
                triggerOn: 'click',
                hideDelay: 2000,
                extraCssText: 'max-height:400px;overflow-y:auto',
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 50,
                bottom: '10%',
                data: [] as Array<string>,
            },
            grid: { left: '5%', right: '180', bottom: '10%', containLabel: true },
            yAxis: { type: 'value', show: true, max: 0 as any, min: 0 as any, axisTick: { show: true } },
            xAxis: {
                type: 'value',
                name: '孔深(米)',
                min: 0,
                max: maxHoleDepth,
                splitNumber: maxHoleDepth,
                splitLine: { show: false },
                axisTick: { show: false, interval: 0 },
                axisLabel: { interval: 0 } as any,
                data: [] as any[],
                axisPointer: { show: true, snap: true, label: { precision: 0 } },
            },
            series: [] as any,
            dataZoom: [],
        } as EChartsOption
    }

    for (const key in dataObj) {
        const wyData: Array<any> = []
        const value = dataObj[key];
        (opt.legend as any).data.push(key)
        value.unshift({
            ...value[0],
            holeDepth: maxHoleDepth,
            relativeX: '',
            relativeY: '',
            x: '',
            y: '',
        })
        const serieY = { name: key, type: 'line', symbol: 'none', data: [] as Array<any> }
        value.forEach((item: any) => {
            //通过isShowSource 判断 为true取x、y 原始值 为false取relativeX、relativeY相对值
            if (showDirection === 'y' && !isSecond) {
                if (currentDevice.isShowSource) {
                    (serieY.data as any).push([item.x, item.holeDepth])
                    wyData.push(item.x)
                } else {
                    (serieY.data as any).push([item.relativeX, item.holeDepth])
                    wyData.push(item.relativeX)
                }
            } else if (showDirection === 'y' && isSecond) {
                if (currentDevice.isShowSource) {
                    (serieY.data as any).push([item.y, item.holeDepth])
                    wyData.push(item.y)
                } else {
                    (serieY.data as any).push([item.relativeY, item.holeDepth])
                    wyData.push(item.relativeY)
                }
            } else {
                if (currentDevice.isShowSource) {
                    (serieY.data as any).push([item.holeDepth, item.y])
                    wyData.push(item.y)
                } else {
                    (serieY.data as any).push([item.holeDepth, item.relativeY])
                    wyData.push(item.relativeY)
                }
            }
            if (!cacheHoleDepth.includes(item.holeDepth)) {
                cacheHoleDepth.push(item.holeDepth)
            }
        })
        const { max, min } = findMaxAndMin(wyData, 20)
        if (max > maxAll) maxAll = max
        if (minAll > min) minAll = min;
        (serieY.data as any).reverse()
        seriesData.push(serieY)
    }

    seriesData.sort((a, b) => {
        return dayjs(a.name).valueOf() - dayjs(b.name).valueOf()
    })

    // 确保端点值参与标签判断（0 与最大孔深）
    if (!cacheHoleDepth.includes(0)) cacheHoleDepth.push(0)
    if (!cacheHoleDepth.includes(maxHoleDepth)) cacheHoleDepth.push(maxHoleDepth)

    if (showDirection === 'y') {
        const holeDepthNum = Number(maxHoleDepth);
        (opt as any).yAxis.axisLabel.formatter = ((value: string | number, index: number) => {
            const numericValue = Number(value)
            // 强制显示两端标签
            if (numericValue === 0 || numericValue === holeDepthNum) {
                return numericValue as any
            }
            let show = cacheHoleDepth.includes(numericValue) || cacheHoleDepth.includes(String(numericValue))
            if (cacheHoleDepth.length > 60) {
                // 稀疏显示，保留端点，其他每4个显示一次
                if (index % 4 !== 0) show = false
            }
            return show ? (numericValue as any) : ''
        }) as any
    } else {
        // x 方向同样显示端点
        (opt as any).xAxis.axisLabel = (opt as any).xAxis.axisLabel || {};
        (opt as any).xAxis.axisLabel.showMinLabel = true;
        (opt as any).xAxis.axisLabel.showMaxLabel = true
        const holeDepthNum = Number(maxHoleDepth);
        (opt as any).xAxis.axisLabel.formatter = ((value: string | number, index: number) => {
            const numericValue = Number(value)
            if (numericValue === 0 || numericValue === holeDepthNum) {
                return numericValue as any
            }
            let show = cacheHoleDepth.includes(numericValue) || cacheHoleDepth.includes(String(numericValue))
            if (cacheHoleDepth.length > 60) {
                if (index % 4 !== 0) show = false
            }
            return show ? (numericValue as any) : ''
        }) as any
    }

    (opt.legend as any).data.sort((a: string, b: string) => {
        return dayjs(a).valueOf() - dayjs(b).valueOf()
    })

    const yMax = maxAll > 20 ? null : 20
    const yMin = minAll < -20 ? null : -20;
    (opt as any).series = seriesData
    if (showDirection === 'y') {
        (opt as any).xAxis.max = yMax as any;
        (opt as any).xAxis.min = yMin as any
    } else {
        (opt as any).yAxis.max = yMax as any;
        (opt as any).yAxis.min = yMin as any
    }

    return opt
}


// ===== Other option builders =====

export function buildSurfaceMultiLineOptions(cacheData: Array<any>, unit: string): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }

    const serieX = {
        name: 'x方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieY = {
        name: 'y方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieZ = {
        name: 'z方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    //   const serieV = {
    //     // name: '水平位移值',
    //     name: '安装累计相对位移',
    //     type: 'line',
    //     symbol: 'none',
    //     data: [] as Array<string>,
    //     tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    //   };
    //   const serieH = {
    //     // name: '合位移值',
    //     name: '当前周期相对位移',
    //     type: 'line',
    //     symbol: 'none',
    //     data: [] as Array<string>,
    //     tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    //   };

    cacheData.forEach((item: any) => {
        xData.push(item.collectdate)
        serieX.data.push(item.xvalue)
        serieY.data.push(item.yvalue)
        serieZ.data.push(item.zvalue)
        // serieV.data.push(item.horizontalDisplacement);
        // serieV.data.push(item.cumulativeDistance);
        // serieH.data.push(item.displacement);
        // serieH.data.push(item.currentPeriodDistance);
    })

    const { max: maxX, min: minX } = findMaxAndMin(serieX.data)
    const { max: maxY, min: minY } = findMaxAndMin(serieY.data)
    const { max: maxZ, min: minZ } = findMaxAndMin(serieZ.data)
    //   const { max: maxV, min: minV } = findMaxAndMin(serieV.data);
    //   const { max: maxH, min: minH } = findMaxAndMin(serieH.data);
    const yAxisMin = Math.min(minX, minY, minZ)
    const yAxisMax = Math.max(maxX, maxY, maxZ)
    const yMax = yAxisMax > 50 ? undefined : 50
    const yMin = yAxisMin < -50 ? undefined : -50;
    (opt as any).yAxis.max = yMax as any;
    (opt as any).yAxis.min = yMin as any;

    (opt as any).legend.data = ['x方向位移值', 'y方向位移值', 'z方向位移值'];
    (opt as any).series = [serieX, serieY, serieZ] as any;
    (opt as any).xAxis.data = xData
    return opt
}
export function buildNbwyLineOptionsNew(cacheData: Array<any>, unit: string): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }

    const serieX = {
        name: 'x方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieY = {
        name: 'y方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.collectdate)
        serieX.data.push(item.xvalue)
        serieY.data.push(item.yvalue)
    })

    const { max: maxX, min: minX } = findMaxAndMin(serieX.data)
    const { max: maxY, min: minY } = findMaxAndMin(serieY.data)
    const yAxisMin = Math.min(minX, minY)
    const yAxisMax = Math.max(maxX, maxY)
    const yMax = yAxisMax > 50 ? undefined : 50
    const yMin = yAxisMin < -50 ? undefined : -50;
    (opt as any).yAxis.max = yMax as any;
    (opt as any).yAxis.min = yMin as any;

    (opt as any).legend.data = ['x方向位移值', 'y方向位移值'];
    (opt as any).series = [serieX, serieY] as any;
    (opt as any).xAxis.data = xData
    return opt
}
export function buildLtksNbwyBmwyLineOptions(cacheData: Array<any>, unit: string): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }

    const serieX = {
        name: '东⽅向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieY = {
        name: '北方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieZ = {
        name: '高程方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.gnssMonitorTime)
        serieX.data.push(item.xdisp)
        serieY.data.push(item.ydisp)
        serieZ.data.push(item.zdisp)
    });

    (opt as any).legend.data = ['东⽅向位移值', '北方向位移值', '高程方向位移值'];
    (opt as any).series = [serieX, serieY, serieZ] as any;
    (opt as any).xAxis.data = xData
    return opt
}
// 露天矿山 内部位移 表面位移 速度曲线配置
export function buildLtksNbwyBmwySpeedLineOptions(cacheData: Array<any>, unit: string,isJsd = true): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }

    const serieX = {
        name: isJsd ? '东⽅向加速度' : '东⽅向速度值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieY = {
        name: isJsd ? '北⽅向加速度' : '北方向速度值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieZ = {
        name: isJsd ? '高程方向加速度' : '高程方向速度值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.gnssMonitorTime)
        if(isJsd) {
            serieX.data.push(item.xaccSpeed)
            serieY.data.push(item.yaccSpeed)
            serieZ.data.push(item.zaccSpeed || 0)
        } else {
            serieX.data.push(item.xspeed)
            serieY.data.push(item.yspeed)
            serieZ.data.push(item.zspeed)
        }
    });

    (opt as any).legend.data = isJsd ? ['东⽅向加速度', '北⽅向加速度', '高程方向加速度'] : ['东⽅向速度值', '北方向速度值', '高程方向速度值'];
    (opt as any).series = [serieX, serieY, serieZ] as any;
    (opt as any).xAxis.data = xData
    return opt
}
// 采动应动力
export function buildCdydlBpzdLineOptionsNew(cacheData: Array<any>, unit: string, isBpzd = true): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }

    const serieX = {
        name: isBpzd ? 'X轴最⼤震动速度' : 'x方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieY = {
        name: isBpzd ? 'Y轴最⼤震动速度' : 'y方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieZ = {
        name: isBpzd ? 'Z轴最⼤震动速度' : 'z方向位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieV = {
        name: isBpzd ? '峰值粒⼦速度' : '应力监测值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.monitorTime)
        serieX.data.push(item.monitorXvalue)
        serieY.data.push(item.monitorYvalue)
        serieY.data.push(item.monitorZvalue)
        serieV.data.push(item.monitorValue)
    })

    const { max: maxX, min: minX } = findMaxAndMin(serieX.data)
    const { max: maxY, min: minY } = findMaxAndMin(serieY.data)
    const { max: maxZ, min: minZ } = findMaxAndMin(serieZ.data)
    const { max: maxV, min: minV } = findMaxAndMin(serieV.data)
    const yAxisMin = Math.min(minX, minY, minZ, minV)
    const yAxisMax = Math.max(maxX, maxY, maxZ, maxV)
    const yMax = yAxisMax > 50 ? undefined : 50
    const yMin = yAxisMin < -50 ? undefined : -50;
    (opt as any).yAxis.max = yMax as any;
    (opt as any).yAxis.min = yMin as any;

    (opt as any).legend.data = isBpzd ? ['X轴最⼤震动速度', 'Y轴最⼤震动速度', 'Z轴最⼤震动速度', '峰值粒⼦速度'] : ['x方向位移值', 'y方向位移值', 'z方向位移值', '应力监测值'];
    (opt as any).series = [serieX, serieY, serieZ, serieV] as any;
    (opt as any).xAxis.data = xData
    return opt
}
// 裂缝计
export function buildLfjLineOptions(cacheData: Array<any>, unit: string): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }

    const serieX = {
        name: '水平位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }
    const serieY = {
        name: '垂直位移值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    }

    cacheData.forEach((item: any) => {
        xData.push(item.monitorTime)
        serieX.data.push(item.monitorXvalue)
        serieY.data.push(item.monitorYvalue)

    });

    (opt as any).legend.data = ['水平位移值', '垂直位移值'];
    (opt as any).series = [serieX, serieY] as any;
    (opt as any).xAxis.data = xData
    return opt
}
export function buildSurface3DOptions(cacheData: Array<any>): EChartsOption {
    const categories = ['x', 'y', 'z']
    const opt: EChartsOption = {
        xAxis: { show: false } as any,
        yAxis: { show: false } as any,
        grid3D: {
            axisLine: { lineStyle: {} },
            axisPointer: { lineStyle: { color: '#6385c9' }, show: true },
            viewControl: { beta: 5, alpha: 5 },
            boxWidth: 200,
            boxHeight: 100,
            boxDepth: 100,
        } as any,
        xAxis3D: { name: 'x', type: 'value', axisLine: { lineStyle: {} }, axisLabel: { show: true }, splitLine: { show: true } } as any,
        yAxis3D: { name: 'y', type: 'value', axisLine: { lineStyle: {} }, axisLabel: { show: true }, splitLine: { show: true } } as any,
        zAxis3D: { name: 'z', type: 'value', axisLine: { lineStyle: {} }, axisLabel: { show: true }, splitLine: { show: true } } as any,
        series: [] as any,
    }

    const threeData = cacheData.map((item: any) => {
        return {
            name: '位移点',
            data: [categories, [item.x, item.y, item.z]],
            color: 'blue',
            time: item.collectDateStr,
            dimensions: categories,
            symbolSize: 10,
            type: 'scatter3D',
        }
    })
    if (threeData.length > 0) {
        (threeData[0] as any).name = '起始点';
        (threeData[0] as any).color = 'black';
        (threeData[0] as any).symbolSize = 15
        const last = threeData[threeData.length - 1] as any
        last.name = '结束点'
        last.color = 'red'
        last.symbolSize = 15
    }
    (opt as any).series = threeData
    return opt
}

export function buildWaterlineOptions(cacheData: Array<any>, unit: string, burialDepth?: number | string): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { inverse: true, type: 'value', name: unit } as any,
    }
    const seriesV = {
        name: '当前值',
        type: 'line',
        symbol: 'none',
        data: [] as Array<string>,
        markLine: {
            lineStyle: { color: 'black', type: 'solid', width: 2 },
            symbol: 'none',
            data: [
                { yAxis: 0, name: '地表', label: { formatter: '{b}', position: 'end' } },
                { yAxis: burialDepth || '', name: '埋深', label: { formatter: '{b}:{c}', position: 'end' } },
            ],
        },
        tooltip: { valueFormatter: (value: number | string) => `${value}${unit}` },
    } as any
    cacheData.forEach((item: any) => {
        xData.push(item.collectDate)
        seriesV.data.push(item.value)
    })
    const { max: maxX } = findMaxAndMin(seriesV.data)
    if (burialDepth && maxX < Number(burialDepth)) {
        (opt as any).yAxis.max = Number(burialDepth) + 10
    }
    (opt as any).xAxis.data = xData;
    (opt as any).series = [seriesV]
    return opt
}

export function buildRainfallOptions(
    cacheData: Array<any>,
    unit: string,
    timeTypeValue: number,
    timeStr: string,
): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        title: { text: '降雨量', right: 30, top: 5, textStyle: { fontSize: 14 } } as any,
        xAxis: [{ data: [] as Array<string> }, { type: 'category', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitArea: { show: false }, splitLine: { show: false }, data: [] as Array<string> }] as any,
        series: [] as any,
        yAxis: { name: unit } as any,
    }
    const seriesV = { name: '当前值', type: 'bar', symbol: 'none', barMaxWidth: 30, data: [] as Array<string>, tooltip: { valueFormatter: (v: number | string) => `${v}${unit}` } } as any
    const seriesAll = { name: '累计值', type: 'line', symbol: 'none', data: [] as Array<number>, tooltip: { valueFormatter: (v: number | string) => `${v}${unit}` } } as any
    const seriesOne = { name: '红色预警', type: 'bar', symbol: 'none', barMaxWidth: 30, xAxisIndex: 1, stack: 'Ad', data: [] as Array<string>, itemStyle: { color: 'red' }, tooltip: { valueFormatter: (v: number | string) => `${v}次` } } as any
    const seriesTwo = { name: '橙色预警', type: 'bar', symbol: 'none', barMaxWidth: 30, xAxisIndex: 1, stack: 'Ad', data: [] as Array<string>, itemStyle: { color: 'orange' }, tooltip: { valueFormatter: (v: number | string) => `${v}次` } } as any
    const seriesThree = { name: '黄色预警', type: 'bar', symbol: 'none', barMaxWidth: 30, stack: 'Ad', xAxisIndex: 1, data: [] as Array<string>, itemStyle: { color: 'yellow' }, tooltip: { valueFormatter: (v: number | string) => `${v}次` } } as any
    const seriesFour = { name: '蓝色预警', type: 'bar', symbol: 'none', barMaxWidth: 30, stack: 'Ad', xAxisIndex: 1, data: [] as Array<string>, itemStyle: { color: 'blue' }, tooltip: { valueFormatter: (v: number | string) => `${v}次` } } as any
    let sum = 0
    cacheData.forEach((item: any) => {
        xData.push(item.collectDate)
        seriesV.data.push(item.value)
        sum += Number(item.value) * Math.pow(10, 5)
        seriesAll.data.push(sum / Math.pow(10, 5))
        seriesOne.data.push(item.oneNum ?? 0)
        seriesTwo.data.push(item.twoNum ?? 0)
        seriesThree.data.push(item.threeNum ?? 0)
        seriesFour.data.push(item.fourNum ?? 0)
    })
    if (timeTypeValue === 2 || timeTypeValue === 3) {
        (opt as any).xAxis[1].data = xData;
        (opt as any).series = [seriesV, seriesAll, seriesFour, seriesThree, seriesTwo, seriesOne]
    } else {
        (opt as any).series = [seriesV, seriesAll]
    }
    (opt as any).xAxis[0].data = xData
    if ((seriesAll.data as Array<number>).length) {
        (opt as any).title.text = `${timeStr}${(seriesAll.data as Array<number>).slice(-1)[0] || 0}mm`
    } else {
        (opt as any).title.text = `${timeStr}0mm`
    }
    return opt
}

export function buildMiningStressOptions(cacheData: Array<any>, unit: string, initValue?: number | string): EChartsOption {
    const xData: Array<string> = []
    const opt: EChartsOption = {
        legend: { data: [] as Array<string> },
        xAxis: { data: [] as Array<string> },
        series: [] as any,
        yAxis: { name: unit } as any,
    }
    const serieChange = { name: '变化值', type: 'line', symbol: 'none', data: [] as Array<string>, tooltip: { valueFormatter: (v: number | string) => `${v}${unit}` } } as any
    const serieInit = { name: '初始值', type: 'line', symbol: 'none', data: [] as Array<string>, tooltip: { valueFormatter: (v: number | string) => `${v}${unit}` } } as any
    const serieCurrent = { name: '当前值', type: 'line', symbol: 'none', data: [] as Array<string>, tooltip: { valueFormatter: (v: number | string) => `${v}${unit}` } } as any
    const serieAccum = { name: '累计变化值', type: 'line', symbol: 'none', data: [] as Array<string>, tooltip: { valueFormatter: (v: number | string) => `${v}${unit}` } } as any
    cacheData.forEach((item: any) => {
        xData.push(item.collectDate)
        serieChange.data.push(item.x)
        serieInit.data.push(initValue ?? 0)
        serieCurrent.data.push(item.value)
        const v = Number(item.value) - Number(initValue ?? 0)
        const formatted = parseFloat(v.toFixed(3)).toString();
        (serieAccum.data as any).push(formatted)
    });
    (opt as any).legend.data = ['初始值', '当前值', '变化值', '累计变化值'];
    (opt as any).series = [serieInit, serieCurrent, serieChange, serieAccum] as any;
    (opt as any).xAxis.data = xData
    return opt
}

export function buildInclinationDeviceOptions(cacheData: Array<any>): { angleOption: EChartsOption; accelOption: EChartsOption } {
    return buildAngleChartOptions(cacheData)
}


