<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">

      <!-- ===== 地下矿山 ===== -->
      <template v-if="isDx">
        <a-divider orientation="left">基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="dxMaxWellPersonCount" :rules="req('请输入最大单班下井作业人数')">
              <template #label>
                最大单班下井作业人数（人）
                <a-tooltip title="是指最大班入井具体人数，不包括单位外如来检查的入井人员；如果处于停产停工期间，这个数据可以按经批准的安全设施填写。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.dxMaxWellPersonCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产状况" name="mineState" :rules="req('请选择生产状况')">
              <JDictSelectTag v-model:value="formModel.mineState" :disabled="disabled" dictCode="mine_product_status" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否建立监测监控系统" name="ifOnlineMonitoring" :rules="req('请选择')">
              <a-radio-group v-model:value="formModel.ifOnlineMonitoring" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否建立人员定位系统" name="dxIfSfyrydwxt" :rules="req('请选择')">
              <a-radio-group v-model:value="formModel.dxIfSfyrydwxt" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否建设音视频调度及应急广播" name="communicationSystem" :rules="req('请选择')">
              <a-radio-group v-model:value="formModel.communicationSystem" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="日常监管主体" name="rcjgzt" :rules="req('请选择日常监管主体')">
              <a-select v-model:value="formModel.rcjgzt" :disabled="disabled" :options="superviseOptions" :field-names="{ label: 'name', value: 'code' }" placeholder="请选择" allow-clear style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应急预案备案日期" name="emergencyPlanDate">
              <a-date-picker v-model:value="formModel.emergencyPlanDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">开采现状</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="井筒数量（个）" name="dxPitShaftCount">
              <a-input-number v-model:value="formModel.dxPitShaftCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低井口标高（m）" name="dxZdjkbg">
              <a-input-number v-model:value="formModel.dxZdjkbg" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全出口数量（个）" name="dxExitCount">
              <a-input-number v-model:value="formModel.dxExitCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="人行井名称" name="dxManholeName">
              <a-input v-model:value="formModel.dxManholeName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否有避难硐室" name="dxIfSfybnts">
              <a-radio-group v-model:value="formModel.dxIfSfybnts" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="dxMiningDepth" :rules="req('请输入开采深度')">
              <template #label>
                开采深度（m）
                <a-tooltip title="是指最低井口标高（m）与开采中段标高（m）的差。如某矿山最低井口标高为540.8m，最低开采中段标高为412m，那么它的开采深度应该为128.8m。平硐开拓矿山开采中段均在最低井口以上，填0即可。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.dxMiningDepth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开采中段名称" name="dxMidpieceName">
              <a-input v-model:value="formModel.dxMidpieceName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低开采中段标高（m）" name="dxZdkczdbg">
              <a-input-number v-model:value="formModel.dxZdkczdbg" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场名称" name="dxStopeName">
              <a-input v-model:value="formModel.dxStopeName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="掘进工作面名称" name="dxHeadingFaceName">
              <a-input v-model:value="formModel.dxHeadingFaceName" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">通风系统</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="主要通风机型号" name="dxMainVentilatorModel">
              <a-input v-model:value="formModel.dxMainVentilatorModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要通风机电机功率（kw）" name="dxMainVentilatorMotorPower">
              <a-input-number v-model:value="formModel.dxMainVentilatorMotorPower" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="局部通风机型号" name="dxLocalVentilatorModel">
              <a-input v-model:value="formModel.dxLocalVentilatorModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="局部通风风筒直径（mm）" name="dxLocalVentilationDuctDiam">
              <a-input-number v-model:value="formModel.dxLocalVentilationDuctDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="局部通风机使用数量（台）" name="dxLocalVentilatorCount">
              <a-input-number v-model:value="formModel.dxLocalVentilatorCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="风门数量（组）" name="dxAirDoorCount">
              <a-input-number v-model:value="formModel.dxAirDoorCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密闭数量（处）" name="dxAirtightCount">
              <a-input-number v-model:value="formModel.dxAirtightCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">运输系统</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="运矿车辆数量（台）" name="dxOreTransportVehicleCount">
              <a-input-number v-model:value="formModel.dxOreTransportVehicleCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运矿车辆型号" name="dxDxOreTransportVehicleModel">
              <a-input v-model:value="formModel.dxDxOreTransportVehicleModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="牵引机车型号" name="dxTractorModel">
              <a-input v-model:value="formModel.dxTractorModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="轨道型号" name="dxTrackModel">
              <a-input v-model:value="formModel.dxTrackModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="轨道间距（mm）" name="dxTrackSpacing">
              <a-input-number v-model:value="formModel.dxTrackSpacing" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">供配电与排水</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="一级负荷设备名称" name="oneLoadDeviceName">
              <a-input v-model:value="formModel.oneLoadDeviceName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="一级负荷设备数量（台、套）" name="oneLoadDeviceCount">
              <a-input-number v-model:value="formModel.oneLoadDeviceCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="入井电压等级（V）" name="dxWellVoltageLevel">
              <a-input-number v-model:value="formModel.dxWellVoltageLevel" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="井下变电站数量（个）" name="dxUndergroundSubstationCount">
              <a-input-number v-model:value="formModel.dxUndergroundSubstationCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="动力电缆型号" name="powerCableModel">
              <a-input v-model:value="formModel.powerCableModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="照明电缆型号" name="lightingCableModel">
              <a-input v-model:value="formModel.lightingCableModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="机械排水设备型号" name="mechanicsDrainageDeviceModel">
              <a-input v-model:value="formModel.mechanicsDrainageDeviceModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水泵数量（台）" name="waterPumpCount">
              <a-input-number v-model:value="formModel.waterPumpCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排水管路数量（趟）" name="drainagePipelineCount">
              <a-input-number v-model:value="formModel.drainagePipelineCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排水管直径（mm）" name="drainPipeDiam">
              <a-input-number v-model:value="formModel.drainPipeDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 露天矿山 ===== -->
      <template v-else-if="isLt">
        <a-divider orientation="left">基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="矿山状态" name="productionStatus" :rules="req('请选择矿山状态')">
              <JDictSelectTag v-model:value="formModel.productionStatus" :disabled="disabled" dictCode="production_status" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="ltSlopeAngle" :rules="req('请输入现状工作帮坡角')">
              <template #label>
                现状工作帮坡角（度）
                <a-tooltip title="是指若干个连续生产台阶，形成的整体帮坡角度。可以通过台阶高度、台阶坡面角、台阶宽度计算。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.ltSlopeAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否建立采场边坡稳定性监测系统" name="sfjlccbpwdxjcxt" :rules="req('请选择')">
              <a-radio-group v-model:value="formModel.sfjlccbpwdxjcxt" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="日常监管主体" name="rcjgzt" :rules="req('请选择日常监管主体')">
              <a-select v-model:value="formModel.rcjgzt" :disabled="disabled" :options="superviseOptions" :field-names="{ label: 'name', value: 'code' }" placeholder="请选择" allow-clear style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否存在露天地下开采相互关系" name="sfczltdxkcxhgx" :rules="req('请选择')">
              <JDictSelectTag v-model:value="formModel.sfczltdxkcxhgx" :disabled="disabled" dictCode="mine_sfczltdxkcxhgx" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="边坡稳定性分析" name="ltBpwdxfx" :rules="req('请选择边坡稳定性分析')">
              <JDictSelectTag v-model:value="formModel.ltBpwdxfx" :disabled="disabled" dictCode="lt_bpwdxfx" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="边坡在线监测系统" name="ltBpzxjcxt" :rules="req('请选择边坡在线监测系统')">
              <JDictSelectTag v-model:value="formModel.ltBpzxjcxt" :disabled="disabled" dictCode="mine_ltBpzxjcxt" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排土场情况" name="ltPtcCondition" :rules="req('请输入排土场情况')">
              <a-input v-model:value="formModel.ltPtcCondition" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="露天形状" name="ltOpenAirShapeType" :rules="req('请选择露天形状')">
              <JDictSelectTag v-model:value="formModel.ltOpenAirShapeType" :disabled="disabled" dictCode="mine_lt_openAir_shapeType" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最大班工作人数（人）" name="ltMaxTeamWorkerCount" :rules="req('请输入最大班工作人数')">
              <a-input-number v-model:value="formModel.ltMaxTeamWorkerCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应急预案备案日期" name="emergencyPlanDate">
              <a-date-picker v-model:value="formModel.emergencyPlanDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="警戒范围内有无生产生活设施" name="ltIfJjfwnywscshss">
              <a-radio-group v-model:value="formModel.ltIfJjfwnywscshss" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="警戒范围内民房数量（户）" name="ltJjfwnmfsl">
              <a-input-number v-model:value="formModel.ltJjfwnmfsl" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">采场边坡现状</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="ltSlopeHeight" :rules="req('请输入现状边坡高度')">
              <template #label>
                现状边坡高度（米）
                <a-tooltip title="指生产矿山在填报时，采场形成的最大边坡高度（m）。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.ltSlopeHeight" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="现状台阶数量（个）" name="ltStepCount" :rules="req('请输入现状台阶数量')">
              <a-input-number v-model:value="formModel.ltStepCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="现状最终边坡角（度）" name="ltProductStepSlopeAngle">
              <a-input-number v-model:value="formModel.ltProductStepSlopeAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计台阶数量（个）" name="ltProductStepCount">
              <a-input-number v-model:value="formModel.ltProductStepCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产台阶高度（m）" name="ltProductStepHeight">
              <a-input-number v-model:value="formModel.ltProductStepHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山道路最大纵坡（%）" name="ltRoadLongitudinalSlope">
              <a-input-number v-model:value="formModel.ltRoadLongitudinalSlope" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">供配电与排水</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="一级负荷设备名称" name="oneLoadDeviceName">
              <a-input v-model:value="formModel.oneLoadDeviceName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="一级负荷设备数量（台、套）" name="oneLoadDeviceCount">
              <a-input-number v-model:value="formModel.oneLoadDeviceCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="动力电缆型号" name="powerCableModel">
              <a-input v-model:value="formModel.powerCableModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="照明电缆型号" name="lightingCableModel">
              <a-input v-model:value="formModel.lightingCableModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="机械排水设备型号" name="mechanicsDrainageDeviceModel">
              <a-input v-model:value="formModel.mechanicsDrainageDeviceModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水泵数量（台）" name="waterPumpCount">
              <a-input-number v-model:value="formModel.waterPumpCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排水管路数量（趟）" name="drainagePipelineCount">
              <a-input-number v-model:value="formModel.drainagePipelineCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排水管直径（mm）" name="drainPipeDiam">
              <a-input-number v-model:value="formModel.drainPipeDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 尾矿库 ===== -->
      <template v-else-if="isWk">
        <a-divider orientation="left">基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="运行状况" name="mineState" :rules="req('请选择运行状况')">
              <JDictSelectTag v-model:value="formModel.mineState" :disabled="disabled" dictCode="mine_ mineState" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="日常监管主体" name="rcjgzt" :rules="req('请选择日常监管主体')">
              <a-select v-model:value="formModel.rcjgzt" :disabled="disabled" :options="superviseOptions" :field-names="{ label: 'name', value: 'code' }" placeholder="请选择" allow-clear style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="现状等别" name="wkGrade" :rules="req('请选择现状等别')">
              <JDictSelectTag v-model:value="formModel.wkGrade" :disabled="disabled" dictCode="wk_grade" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排洪构筑物质量检测" name="wkPhgzwZljc" :rules="req('请选择')">
              <JDictSelectTag v-model:value="formModel.wkPhgzwZljc" :disabled="disabled" dictCode="mine_wkPhgzwZljc" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排尾方式" name="wkTailMode" :rules="req('请选择排尾方式')">
              <JDictSelectTag v-model:value="formModel.wkTailMode" :disabled="disabled" dictCode="mine_wkTail_mode" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿库在线监测系统" name="onlineMonitorType" :rules="req('请选择')">
              <JDictSelectTag v-model:value="formModel.onlineMonitorType" :disabled="disabled" dictCode="online_monitor_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="放矿管路数量（趟）" name="wkOreDrawingPipelineCount">
              <a-input-number v-model:value="formModel.wkOreDrawingPipelineCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="放矿点数量（个）" name="wkOreDrawingPointCount">
              <a-input-number v-model:value="formModel.wkOreDrawingPointCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="放矿管路直径（mm）" name="wkOreDrawingPipelineDiam">
              <a-input-number v-model:value="formModel.wkOreDrawingPipelineDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排尾运输方式" name="wkTailTransportMode">
              <a-input v-model:value="formModel.wkTailTransportMode" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">坝体现状</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="wkVolume" :rules="req('请输入现状容积')">
              <template #label>
                现状容积（万立方米）
                <a-tooltip title="是指填报时尾矿库库内已经排放尾矿数量，单位是万立方米。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.wkVolume" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="现状坝高（m）" name="wkDamHeight">
              <a-input-number v-model:value="formModel.wkDamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾水容量（立方米）" name="wkTailwaterCapacity">
              <a-input-number v-model:value="formModel.wkTailwaterCapacity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="现状子坝数量（级）" name="wkSubdamCount">
              <a-input-number v-model:value="formModel.wkSubdamCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="下游1公里范围内生产生活设施" name="wkXyyglfwnscshss">
              <a-input v-model:value="formModel.wkXyyglfwnscshss" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="下游3公里范围内生活生活设施" name="wkXysglfwnscshss">
              <a-input v-model:value="formModel.wkXysglfwnscshss" :disabled="disabled" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">干滩与防洪</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="wkDryBeachLength" :rules="req('请输入干滩长度')">
              <template #label>
                干滩长度（m）
                <a-tooltip title="是指在填报时尾矿库滩面形成的干滩长度。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.wkDryBeachLength" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="浸润线（m）" name="wkPhreaticLineLength">
              <a-input-number v-model:value="formModel.wkPhreaticLineLength" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最小干滩长度（m）" name="wkMinDryBeachLength" :rules="req('请输入最小干滩长度')">
              <a-input-number v-model:value="formModel.wkMinDryBeachLength" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="控制浸润线埋深（m）" name="wkControlPhreaticLineDepth">
              <a-input-number v-model:value="formModel.wkControlPhreaticLineDepth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年度调洪演算报告" name="wkYearFloodCalculusReport">
              <PdfUploadSimple v-model:value="formModel.wkYearFloodCalculusReport" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="调洪库容（立方米）" name="wkFloodRegulationStorageCapacity">
              <a-input-number v-model:value="formModel.wkFloodRegulationStorageCapacity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="wkCalculusDryBeachLength">
              <template #label>
                调洪演算干滩长度（m）
                <a-tooltip title="是指尾矿库当年在汛期前经过洪水演算得出的在汛期生产期间的最小干滩长度（m）。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.wkCalculusDryBeachLength" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="防洪宽度（m）" name="wkFloodControlWidth">
              <a-input-number v-model:value="formModel.wkFloodControlWidth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="调洪高度（m）" name="wkFloodRegulationHeight">
              <a-input-number v-model:value="formModel.wkFloodRegulationHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="正常生产水位（m）" name="wkProductWaterLevel">
              <a-input-number v-model:value="formModel.wkProductWaterLevel" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="防洪高度（m）" name="wkFloodControlHeight">
              <a-input-number v-model:value="formModel.wkFloodControlHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全超高（m）" name="wkSafeSuperHigh">
              <a-input-number v-model:value="formModel.wkSafeSuperHigh" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">监测监控</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="是否有在线监测监控系统" name="ifOnlineMonitoring">
              <a-radio-group v-model:value="formModel.ifOnlineMonitoring" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="在线监测监控等级" name="wkOnlineMonitoringLevel">
              <a-input v-model:value="formModel.wkOnlineMonitoringLevel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="接入国、省相关信息化预警平台情况" name="wkJrgsxgxxhyjptqk">
              <a-input v-model:value="formModel.wkJrgsxgxxhyjptqk" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否头顶库" name="wkIfTopLibrary">
              <a-radio-group v-model:value="formModel.wkIfTopLibrary" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </template>

    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'
import PdfUploadSimple from '/@/components/FileUpload/PdfUploadSimple.vue'
import { getSuperviseList } from '../enterprise.api'

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})
const superviseOptions = ref<any[]>([])

watch(
  () => props.detail?.baseInfoDTO?.areaId,
  async (areaId) => {
    if (!areaId) return
    try {
      const res = await getSuperviseList(areaId)
      superviseOptions.value = Array.isArray(res) ? res : (res?.result ?? res?.records ?? [])
    } catch {}
  },
  { immediate: true }
)

const mineType = computed(() => {
  const raw = props.detail?.mineType ?? props.detail?.companyType
  return raw == null ? '' : String(raw)
})

// MineType: 00地下矿山 01露天矿山(含排土场) 03尾矿库
const isDx = computed(() => mineType.value === '00')
const isLt = computed(() => mineType.value === '01')
const isWk = computed(() => mineType.value === '03')

function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.productNowParamDTO ? { ...val.productNowParamDTO } : {}
  },
  { immediate: true, deep: true }
)

async function validate(): Promise<Record<string, any>> {
  await formRef.value?.validate()
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>
