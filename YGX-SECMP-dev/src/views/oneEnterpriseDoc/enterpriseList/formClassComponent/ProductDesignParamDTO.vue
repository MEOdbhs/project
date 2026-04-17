<template>
  <div class="tab-form-wrap">
    <a-form ref="formRef" :model="formModel" layout="vertical">

      <!-- ===== 地下矿山 ===== -->
      <template v-if="isDx">
        <a-divider orientation="left">基本设计参数</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="安全设施设计批准机关" name="aqsssjpzjg">
              <a-input v-model:value="formModel.aqsssjpzjg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="批准时间" name="approvalDate">
              <a-date-picker v-model:value="formModel.approvalDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="勘探储量（万吨）" name="prospectReserves">
              <a-input-number v-model:value="formModel.prospectReserves" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="剩余开采储量（万吨）" name="recoverableReserves">
              <a-input-number v-model:value="formModel.recoverableReserves" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="productionScale" :rules="req('请输入设计生产能力')">
              <template #label>
                设计生产能力（万吨/年）
                <a-tooltip title="是指矿山企业经批准的安全设施设计中确定的能力，如果是万立方米/年，用矿石比重折算成万吨/年。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.productionScale" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山规模" name="scaleType">
              <JDictSelectTag v-model:value="formModel.scaleType" :disabled="disabled" dictCode="mine_scale_type" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水文地质类型" name="hydrogeologyType" :rules="req('请选择水文地质类型')">
              <JDictSelectTag v-model:value="formModel.hydrogeologyType" :disabled="disabled" dictCode="mine_hydrogeology_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工程地质类型" name="engineeringGeologyType">
              <JDictSelectTag v-model:value="formModel.engineeringGeologyType" :disabled="disabled" dictCode="mine_engineering_geology_type" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿体形状" name="oreBodyShape">
              <JDictSelectTag v-model:value="formModel.oreBodyShape" :disabled="disabled" dictCode="mine_ore_body_shape" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿体厚度（米）" name="oreBodyThickness">
              <a-input-number v-model:value="formModel.oreBodyThickness" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="oreBodyHardness">
              <template #label>
                矿体抗压强度（MPa）
                <a-tooltip title="是指安全设施设计中地质部分可查到的矿体抗压强度，可填平均值或最大值。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.oreBodyHardness" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿体倾角（度）" name="oreBodyDipAngle">
              <a-input-number v-model:value="formModel.oreBodyDipAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="品位" name="grade">
              <a-input-number v-model:value="formModel.grade" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="顶板岩层类型" name="dxTopType">
              <a-input v-model:value="formModel.dxTopType" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="dxTopHardness">
              <template #label>
                顶板岩层抗压强度（MPa）
                <a-tooltip title="是指安全设施设计中地质部分可查到的顶板岩层抗压强度，可填平均值或最大值。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.dxTopHardness" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="底板岩层类型" name="dxBottomType">
              <a-input v-model:value="formModel.dxBottomType" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="dxBottomHardness">
              <template #label>
                底板岩层抗压强度（MPa）
                <a-tooltip title="是指安全设施设计中地质部分可查到的底板岩层抗压强度，可填平均值或最大值。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.dxBottomHardness" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">开采工艺</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="开拓方式" name="openUpMethod" :rules="req('请选择开拓方式')">
              <JDictSelectTag v-model:value="formModel.openUpMethod" :disabled="disabled" dictCode="mine_open_up_method" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采矿方法" name="miningMethod">
              <a-input v-model:value="formModel.miningMethod" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采矿工艺" name="dxMiningEchnology">
              <a-input v-model:value="formModel.dxMiningEchnology" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="中段数量（个）" name="dxMidpieceCount">
              <a-input-number v-model:value="formModel.dxMidpieceCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场数量（个）" name="dxStopeCount">
              <a-input-number v-model:value="formModel.dxStopeCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="掘进工作面数量（个）" name="dxHeadingFaceCount">
              <a-input-number v-model:value="formModel.dxHeadingFaceCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场支护方式" name="dxStopeSupportMode">
              <a-input v-model:value="formModel.dxStopeSupportMode" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="掘进巷道支方式" name="dxTunnelingRoadwayMode">
              <a-input v-model:value="formModel.dxTunnelingRoadwayMode" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采矿方法详述" name="miningMethodDescribe">
              <a-textarea v-model:value="formModel.miningMethodDescribe" :disabled="disabled" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">爆破 / 提运 / 通风</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="爆破作业方案编写人员" name="blastPersionName">
              <a-input v-model:value="formModel.blastPersionName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="爆破作业方案审批机关" name="bpzyfaspjg">
              <a-input v-model:value="formModel.bpzyfaspjg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="提升方式" name="dxsLiftingMode">
              <JDictSelectTag v-model:value="formModel.dxsLiftingMode" :disabled="disabled" dictCode="mine_dxsLiftingMode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运输方式" name="dxTransportMode">
              <JDictSelectTag v-model:value="formModel.dxTransportMode" :disabled="disabled" dictCode="mine_dxTransport_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="通风方式" name="dxVentilateMode">
              <JDictSelectTag v-model:value="formModel.dxVentilateMode" :disabled="disabled" dictCode="mine_dxVentilate_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="通风方法" name="dxVentilateMethod">
              <JDictSelectTag v-model:value="formModel.dxVentilateMethod" :disabled="disabled" dictCode="mine_dxVentilate_method" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山供电方式" name="powerSupplyMode">
              <JDictSelectTag v-model:value="formModel.powerSupplyMode" :disabled="disabled" dictCode="mine_power_supply_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排水方式" name="drainageMode">
              <JDictSelectTag v-model:value="formModel.drainageMode" :disabled="disabled" dictCode="mine_drainage_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 露天矿山 ===== -->
      <template v-else-if="isLt">
        <a-divider orientation="left">基本设计参数</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="sjkcsd" :rules="req('请输入设计开采深度')">
              <template #label>
                设计开采深度（m）
                <a-tooltip title="设计开采深度是指设计最大开采标高与最小开采标高之差，单位为m">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.sjkcsd" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="xzkcsd" :rules="req('请输入现状开采深度')">
              <template #label>
                现状开采深度（m）
                <a-tooltip title="现状开采深度是指实际开采最大标高与现状开采最小标高之差，单位为m">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.xzkcsd" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="ltDesignSlopeAngle" :rules="req('请输入设计工作帮坡角')">
              <template #label>
                设计工作帮坡角（度）
                <a-tooltip title="是指若干个连续生产台阶，形成的整体帮坡角度。可以通过台阶高度、台阶坡面角、台阶宽度计算。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.ltDesignSlopeAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工程地质类型" name="engineeringGeologyType" :rules="req('请选择工程地质类型')">
              <JDictSelectTag v-model:value="formModel.engineeringGeologyType" :disabled="disabled" dictCode="mine_engineering_geology_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开拓方式" name="openUpMethod" :rules="req('请选择开拓方式')">
              <JDictSelectTag v-model:value="formModel.openUpMethod" :disabled="disabled" dictCode="mine_open_up_method" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="台阶高度（m）" name="ltStepHeight" :rules="req('请输入台阶高度')">
              <a-input-number v-model:value="formModel.ltStepHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计最终边坡角（度）" name="ltEndSlopeAngle" :rules="req('请输入设计最终边坡角')">
              <a-input-number v-model:value="formModel.ltEndSlopeAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全设施设计批准机关" name="aqsssjpzjg">
              <a-input v-model:value="formModel.aqsssjpzjg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="批准时间" name="approvalDate">
              <a-date-picker v-model:value="formModel.approvalDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="勘探储量（万吨）" name="prospectReserves">
              <a-input-number v-model:value="formModel.prospectReserves" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可采储量（万吨）" name="recoverableReserves">
              <a-input-number v-model:value="formModel.recoverableReserves" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="productionScale" :rules="req('请输入设计生产能力')">
              <template #label>
                设计生产能力（万吨/年）
                <a-tooltip title="是指矿山企业经批准的安全设施设计中确定的能力，如果是万立方米/年，用矿石比重折算成万吨/年。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.productionScale" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山规模分类" name="scaleType">
              <JDictSelectTag v-model:value="formModel.scaleType" :disabled="disabled" dictCode="mine_scale_type" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水文地质类型" name="hydrogeologyType" :rules="req('请选择水文地质类型')">
              <JDictSelectTag v-model:value="formModel.hydrogeologyType" :disabled="disabled" dictCode="mine_hydrogeology_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿体形状" name="oreBodyShape">
              <JDictSelectTag v-model:value="formModel.oreBodyShape" :disabled="disabled" dictCode="mine_ore_body_shape" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿体厚度（米）" name="oreBodyThickness">
              <a-input-number v-model:value="formModel.oreBodyThickness" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="oreBodyHardness">
              <template #label>
                矿体抗压强度（MPa）
                <a-tooltip title="是指安全设施设计中地质部分可查到的矿体抗压强度，可填平均值或最大值。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.oreBodyHardness" :disabled="disabled" :precision="0" :step="1" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿体倾角（度）" name="oreBodyDipAngle">
              <a-input-number v-model:value="formModel.oreBodyDipAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="品位" name="grade">
              <a-input-number v-model:value="formModel.grade" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="表土类型" name="ltTopsoilType">
              <a-input v-model:value="formModel.ltTopsoilType" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="表土厚度（m）" name="ltTopsoilHickness">
              <a-input-number v-model:value="formModel.ltTopsoilHickness" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">开采工艺与爆破</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="采矿方法" name="miningMethod">
              <a-input v-model:value="formModel.miningMethod" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="台阶坡面角（度）" name="ltStepSlopeAngle">
              <a-input-number v-model:value="formModel.ltStepSlopeAngle" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="同时生产台阶数量（个）" name="ltProductStepCount">
              <a-input-number v-model:value="formModel.ltProductStepCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计边坡（排土场）高度（m）" name="ltEndSlopeHeight">
              <a-input-number v-model:value="formModel.ltEndSlopeHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="终了台阶高度（m）" name="ltEndStepHeight">
              <a-input-number v-model:value="formModel.ltEndStepHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场上口直径（m）" name="ltStopeUpperDiam">
              <a-input-number v-model:value="formModel.ltStopeUpperDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场下口直径（m）" name="ltStopeLowerDiam">
              <a-input-number v-model:value="formModel.ltStopeLowerDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全平台宽度（m）" name="ltSafePlatformWidth">
              <a-input-number v-model:value="formModel.ltSafePlatformWidth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="清扫平台宽度（m）" name="ltCleanPlatformWidth">
              <a-input-number v-model:value="formModel.ltCleanPlatformWidth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="潜孔钻型号" name="ltDthDrillModel">
              <a-input v-model:value="formModel.ltDthDrillModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="潜孔钻数量（台）" name="ltDthDrillCount">
              <a-input-number v-model:value="formModel.ltDthDrillCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="钻孔直径（mm）" name="ltDrillHoleDiam">
              <a-input-number v-model:value="formModel.ltDrillHoleDiam" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="一次起爆钻孔数量（个）" name="ltOneDetonationDrillHoleCount">
              <a-input-number v-model:value="formModel.ltOneDetonationDrillHoleCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="爆破作业方案编写人员" name="blastPersionName">
              <a-input v-model:value="formModel.blastPersionName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="爆破作业方案审批机关" name="bpzyfaspjg">
              <a-input v-model:value="formModel.bpzyfaspjg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="一次起爆炸药量（kg）" name="ltOneDetonationExplosiveQuantity">
              <a-input-number v-model:value="formModel.ltOneDetonationExplosiveQuantity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="一次爆破矿量（吨）" name="ltOneDetonationOreQuantity">
              <a-input-number v-model:value="formModel.ltOneDetonationOreQuantity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="平坡和上坡方向爆破警戒范围（m）" name="ltPphspfxbpjjfw">
              <a-input-number v-model:value="formModel.ltPphspfxbpjjfw" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="下坡方向爆破警戒范围（m）" name="ltXpfxbpjjfw">
              <a-input-number v-model:value="formModel.ltXpfxbpjjfw" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="台阶式开采" name="ltTjskc">
              <a-radio-group v-model:value="formModel.ltTjskc" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采矿方法详述" name="miningMethodDescribe">
              <a-textarea v-model:value="formModel.miningMethodDescribe" :disabled="disabled" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">运输与排水</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="矿山道路长度（m）" name="ltMineRoadLength">
              <a-input-number v-model:value="formModel.ltMineRoadLength" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山道路最大纵坡（%）" name="ltRoadMaxLongitudinalSlope">
              <a-input-number v-model:value="formModel.ltRoadMaxLongitudinalSlope" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山道路宽度（m）" name="ltMineRoadWidth">
              <a-input-number v-model:value="formModel.ltMineRoadWidth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运矿车辆型号" name="ltOreTransportVehicleModel">
              <a-input v-model:value="formModel.ltOreTransportVehicleModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运矿车辆数量（台）" name="ltOreTransportVehicleCount">
              <a-input-number v-model:value="formModel.ltOreTransportVehicleCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运矿皮带型号" name="ltOreTransportBeltModel">
              <a-input v-model:value="formModel.ltOreTransportBeltModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运矿皮带长度（m）" name="ltOreTransportBeltLength">
              <a-input-number v-model:value="formModel.ltOreTransportBeltLength" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运矿铁路宽度（m）" name="ltOreTransportRailwayWidth">
              <a-input-number v-model:value="formModel.ltOreTransportRailwayWidth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="截排洪沟形状" name="jphgxz">
              <JDictSelectTag v-model:value="formModel.jphgxz" :disabled="disabled" dictCode="mine_jphgxz" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="截排洪沟断面积（m²）" name="jphgmj">
              <a-input-number v-model:value="formModel.jphgmj" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="采场是否有凹陷开采" name="ltIfCcsfyaxkc">
              <a-radio-group v-model:value="formModel.ltIfCcsfyaxkc" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="凹陷排水方式" name="ltDepressionDrainageMode">
              <a-input v-model:value="formModel.ltDepressionDrainageMode" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="drainageMode">
              <template #label>
                排水方式
                <a-tooltip title="如果选择自流，其后机械排水设备型号、机械排水能力、水泵数量、管路数量就不填。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <JDictSelectTag v-model:value="formModel.drainageMode" :disabled="disabled" dictCode="mine_drainage_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="机械排水设备型号" name="ltMechanicsDrainageDeviceModel">
              <a-input v-model:value="formModel.ltMechanicsDrainageDeviceModel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="机械排水能力（m³/h）" name="ltMechanicsDrainageCapacity">
              <a-input-number v-model:value="formModel.ltMechanicsDrainageCapacity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水泵数量（台）" name="ltWaterPumpCount">
              <a-input-number v-model:value="formModel.ltWaterPumpCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管路数量（趟）" name="ltPipelineCount">
              <a-input-number v-model:value="formModel.ltPipelineCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="夜间是否生产" name="ltIfNightProduct">
              <a-radio-group v-model:value="formModel.ltIfNightProduct" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山供电方式" name="powerSupplyMode">
              <JDictSelectTag v-model:value="formModel.powerSupplyMode" :disabled="disabled" dictCode="mine_power_supply_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 尾矿库 ===== -->
      <template v-else-if="isWk">
        <a-divider orientation="left">基本设计参数</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="安全设施设计批准机关" name="aqsssjpzjg">
              <a-input v-model:value="formModel.aqsssjpzjg" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="批准时间" name="approvalDate">
              <a-date-picker v-model:value="formModel.approvalDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="wkLevel" :rules="req('请选择设计等别')">
              <template #label>
                设计等别
                <a-tooltip title="是指尾矿库确认的等级，一般为一等、二等、三等、四等、五等。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <JDictSelectTag v-model:value="formModel.wkLevel" :disabled="disabled" dictCode="mine_wk_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计总坝高（m）" name="wkTotalDamHeight" :rules="req('请输入设计总坝高')">
              <a-input-number v-model:value="formModel.wkTotalDamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="类型" name="wkType">
              <JDictSelectTag v-model:value="formModel.wkType" :disabled="disabled" dictCode="mine_design_params_wk_type" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计总库容（万立方米）" name="wkTotalStorageCapacity" :rules="req('请输入设计总库容')">
              <a-input-number v-model:value="formModel.wkTotalStorageCapacity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="wkFullStorageCapacity">
              <template #label>
                全库容（万立方米）
                <a-tooltip title="是指安全设施设计中确定的总库容。按批准的安全设施设计填写即可。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.wkFullStorageCapacity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="有效库容（万立方米）" name="wkValidStorageCapacity">
              <a-input-number v-model:value="formModel.wkValidStorageCapacity" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="汇水面积（km²）" name="wkWaterArea" :rules="req('请输入汇水面积')">
              <a-input-number v-model:value="formModel.wkWaterArea" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">坝体参数</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="初期坝类型" name="wkInitDamType">
              <a-input v-model:value="formModel.wkInitDamType" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="初期坝高（m）" name="wkInitDamHeight">
              <a-input-number v-model:value="formModel.wkInitDamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="堆积坝高（m）" name="wkCumulateDamHeight">
              <a-input-number v-model:value="formModel.wkCumulateDamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="筑坝方式" name="wkDamStockType">
              <JDictSelectTag v-model:value="formModel.wkDamStockType" :disabled="disabled" dictCode="mine_wk_dam_stock_type" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="子坝数量（级）" name="wkSubdamCount" :rules="req('请输入子坝数量')">
              <a-input-number v-model:value="formModel.wkSubdamCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="子坝高度（m）" name="wkSubdamHeight">
              <a-input-number v-model:value="formModel.wkSubdamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="子坝外坡比" name="wkSubdamOuterSlopeRatio">
              <a-input v-model:value="formModel.wkSubdamOuterSlopeRatio" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="子坝内坡比" name="wkSubdamLnternalSlopeRatio">
              <a-input v-model:value="formModel.wkSubdamLnternalSlopeRatio" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="挡水坝高（m）" name="wkWaterRetainingDamHeight">
              <a-input-number v-model:value="formModel.wkWaterRetainingDamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="拦砂坝高（m）" name="wkSandBlockingDamHeight">
              <a-input-number v-model:value="formModel.wkSandBlockingDamHeight" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">排洪与堆存</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="截排洪沟形状" name="jphgxz">
              <JDictSelectTag v-model:value="formModel.jphgxz" :disabled="disabled" dictCode="mine_jphgxz" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="截排洪沟断面积（m²）" name="jphgmj">
              <a-input-number v-model:value="formModel.jphgmj" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="坝肩沟形状" name="wkBjgxz">
              <a-input v-model:value="formModel.wkBjgxz" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="坝肩沟断面积（m²）" name="wkBjgdmj">
              <a-input-number v-model:value="formModel.wkBjgdmj" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排洪系统数量" name="wkFloodDischargeCount">
              <a-input-number v-model:value="formModel.wkFloodDischargeCount" :disabled="disabled" :precision="0" :step="1" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排洪系统型式" name="wkFloodDischargeType">
              <a-input v-model:value="formModel.wkFloodDischargeType" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排渗系统布置" name="wkFloodDischargeAssign">
              <a-input v-model:value="formModel.wkFloodDischargeAssign" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾水排放方式" name="wkWaterDischargeMode">
              <a-input v-model:value="formModel.wkWaterDischargeMode" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="堆存方式" name="wkOreDrawingMode">
              <JDictSelectTag v-model:value="formModel.wkOreDrawingMode" :disabled="disabled" dictCode="mine_ wk_ore_drawing_mode" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="临界浸润线" name="wkCriticalPhreaticLine">
              <a-input v-model:value="formModel.wkCriticalPhreaticLine" :disabled="disabled" />
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

interface Props {
  detail?: Record<string, any> | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})

const mineType = computed(() => {
  const raw = props.detail?.mineType ?? props.detail?.companyType
  return raw == null ? '' : String(raw)
})

// 类型判断 — MineType: 00地下矿山 01露天矿山(含排土场) 03尾矿库
const isDx = computed(() => mineType.value === '00')
const isLt = computed(() => mineType.value === '01')
const isWk = computed(() => mineType.value === '03')

function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail,
  (val) => {
    formModel.value = val?.productDesignParamDTO ? { ...val.productDesignParamDTO } : {}
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
