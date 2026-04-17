<template>
  <div class="tab-form-wrap">
    <a-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
    >
      <!-- ===== 公共只读头部：矿山编码 / 名称 / 行政区域 / 矿山类型 ===== -->
      <a-divider orientation="left">基础信息（只读）</a-divider>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="矿山编码" name="mineId">
            <a-input v-model:value="formModel.mineId" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item name="name">
            <template #label>
              {{ nameLabel }}
              <a-tooltip title="以登记矿山名称为准，如果有若干个不同独立生产系统，其后可加后缀予以区分。">
                <QuestionCircleOutlined class="label-tip-icon" />
              </a-tooltip>
            </template>
            <a-input v-model:value="formModel.name" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="行政区域" name="areaId">
            <a-input v-model:value="formModel.areaName" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="矿山类型" name="mineType">
            <a-input v-model:value="formModel.mineTypeText" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- ===== 地下矿山（00）===== -->
      <template v-if="isDx">
        <a-divider orientation="left">企业基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="企业性质" name="companyType" :rules="req('请选择企业性质')">
              <JDictSelectTag v-model:value="formModel.companyType" :disabled="disabled" dictCode="mine_company_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="标准化等级" name="safeStandardLevel" :rules="req('请选择标准化等级')">
              <JDictSelectTag v-model:value="formModel.safeStandardLevel" :disabled="disabled" dictCode="mine_safe_standard_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产矿石量（万吨/年）" name="mineralProductionNum" :rules="req('请输入生产矿石量')">
              <a-input-number v-model:value="formModel.mineralProductionNum" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="上年实际矿石产量（万吨）" name="lastMineralProductionNum" :rules="req('请输入上年实际矿石产量')">
              <a-input-number v-model:value="formModel.lastMineralProductionNum" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="designedDepth" :rules="req('请输入设计开采深度')">
              <template #label>
                设计开采深度（m）
                <a-tooltip title="设计开采深度是指设计最大开采标高与最小开采标高之差，单位为m">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <a-input-number v-model:value="formModel.designedDepth" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全风险等级" name="safetyLevel" :rules="req('请选择安全风险等级')">
              <JDictSelectTag v-model:value="formModel.safetyLevel" :disabled="disabled" dictCode="mine_safety_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否存在露天地下开采相互关系" name="interrelation" :rules="req('请选择')">
              <a-radio-group v-model:value="formModel.interrelation" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业责任人职务" name="firmLeaderJob" :rules="req('请输入企业责任人职务')">
              <a-input v-model:value="formModel.firmLeaderJob" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业责任人" name="safeDirectorName" :rules="req('请输入企业责任人')">
              <a-input v-model:value="formModel.safeDirectorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业责任人联系方式" name="safeDirectorPhone" :rules="req('请输入企业责任人联系方式')">
              <a-input v-model:value="formModel.safeDirectorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工商营业执照证照编号" name="meTyshxydm">
              <a-input v-model:value="formModel.meTyshxydm" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建矿时间" name="buildMineDate">
              <a-date-picker v-model:value="formModel.buildMineDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投产时间" name="productDate">
              <a-date-picker v-model:value="formModel.productDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="industry">
              <template #label>
                所属行业
                <a-tooltip title="是指矿山开采矿种或矿产品属于哪个行业，如铜、镍、铅、锌、稀土等属于有色行业…">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <JDictSelectTag v-model:value="formModel.industry" :disabled="disabled" dictCode="mine_belong_industry_00" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否有堆置高度200米以上排土场" name="ifTwoHundredName">
              <a-radio-group v-model:value="formModel.ifTwoHundredName" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <!-- dxBaseInfo 中内嵌了 baseInfoSame2 相同字段 -->
          <a-col :span="12">
            <a-form-item label="经济类型" name="companyEconomyType" :rules="req('请选择经济类型')">
              <JDictSelectTag v-model:value="formModel.companyEconomyType" :disabled="disabled" dictCode="mine_company_economy_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址" name="address" :rules="req('请输入地址')">
              <a-input v-model:value="formModel.address" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="距周边城市最近里程（km）" name="jzbcszjlc">
              <a-input-number v-model:value="formModel.jzbcszjlc" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="从最近城市到矿山耗时（h）" name="czjcsdkshs">
              <a-input-number v-model:value="formModel.czjcsdkshs" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法人代表姓名" name="legalName">
              <a-input v-model:value="formModel.legalName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法人代表移动电话" name="legalPhone">
              <a-input v-model:value="formModel.legalPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要负责人姓名" name="directorName" :rules="req('请输入主要负责人姓名')">
              <a-input v-model:value="formModel.directorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要负责人移动电话" name="directorPhone" :rules="req('请输入主要负责人移动电话')">
              <a-input v-model:value="formModel.directorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全管理机构名称" name="safeManageOrgName">
              <a-input v-model:value="formModel.safeManageOrgName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专职安全管理人员数量（人）" name="fullTimeSafePersonCount">
              <a-input-number v-model:value="formModel.fullTimeSafePersonCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人" name="contacts">
              <a-input v-model:value="formModel.contacts" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电话" name="contactsPhone">
              <a-input v-model:value="formModel.contactsPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电子邮箱" name="contactsMailbox">
              <a-input v-model:value="formModel.contactsMailbox" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="高层管理人员数量（人）" name="seniorManagementCount">
              <a-input-number v-model:value="formModel.seniorManagementCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业技术人员数量（人）" name="professionalTechniciansCount">
              <a-input-number v-model:value="formModel.professionalTechniciansCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种作业人员数量（人）" name="specialOperationPersonCount">
              <a-input-number v-model:value="formModel.specialOperationPersonCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="从业人员数量（人）" name="employeesCount">
              <a-input-number v-model:value="formModel.employeesCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">坐标信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="工业广场（主井口）经度" name="longitude" :rules="req('请输入经度')">
              <a-input-number v-model:value="formModel.longitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" placeholder="如：104.065735" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工业广场（主井口）纬度" name="latitude" :rules="req('请输入纬度')">
              <a-input-number v-model:value="formModel.latitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" placeholder="如：30.659462" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">其他信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="是否有委托技术服务机构" name="ifTechnicalServicesOrg">
              <a-radio-group v-model:value="formModel.ifTechnicalServicesOrg" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="委托技术服务机构名称" name="technicalServicesOrgName">
              <a-input v-model:value="formModel.technicalServicesOrgName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="外包工程队伍数量（支）" name="outsourceTeamCount">
              <a-input-number v-model:value="formModel.outsourceTeamCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业邮政编码" name="postalCode">
              <a-input v-model:value="formModel.postalCode" :disabled="disabled" :maxlength="6" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排土场数量（个）" name="wasteDumpCount">
              <a-input-number v-model:value="formModel.wasteDumpCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 露天矿山（01）===== -->
      <template v-else-if="isLt">
        <a-divider orientation="left">企业基本信息</a-divider>
        <a-row :gutter="24">
          <!-- baseInfoSame1b -->
          <a-col :span="12">
            <a-form-item label="企业性质" name="companyType" :rules="req('请选择企业性质')">
              <JDictSelectTag v-model:value="formModel.companyType" :disabled="disabled" dictCode="mine_company_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工商营业执照证照编号" name="meTyshxydm">
              <a-input v-model:value="formModel.meTyshxydm" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建矿时间" name="buildMineDate">
              <a-date-picker v-model:value="formModel.buildMineDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投产时间" name="productDate">
              <a-date-picker v-model:value="formModel.productDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="industry">
              <template #label>
                所属行业
                <a-tooltip title="是指矿山开采矿种或矿产品属于哪个行业，如铜、镍、铅、锌、稀土等属于有色行业…">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <JDictSelectTag v-model:value="formModel.industry" :disabled="disabled" dictCode="mine_belong_industry_00" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否有堆置高度200米以上排土场" name="ifTwoHundredName">
              <a-radio-group v-model:value="formModel.ifTwoHundredName" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <!-- baseInfoSame2 -->
          <a-col :span="12">
            <a-form-item label="经济类型" name="companyEconomyType" :rules="req('请选择经济类型')">
              <JDictSelectTag v-model:value="formModel.companyEconomyType" :disabled="disabled" dictCode="mine_company_economy_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址" name="address" :rules="req('请输入地址')">
              <a-input v-model:value="formModel.address" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="距周边城市最近里程（km）" name="jzbcszjlc">
              <a-input-number v-model:value="formModel.jzbcszjlc" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="从最近城市到矿山耗时（h）" name="czjcsdkshs">
              <a-input-number v-model:value="formModel.czjcsdkshs" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法人代表姓名" name="legalName">
              <a-input v-model:value="formModel.legalName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法人代表移动电话" name="legalPhone">
              <a-input v-model:value="formModel.legalPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要负责人姓名" name="directorName" :rules="req('请输入主要负责人姓名')">
              <a-input v-model:value="formModel.directorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要负责人移动电话" name="directorPhone" :rules="req('请输入主要负责人移动电话')">
              <a-input v-model:value="formModel.directorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全管理机构名称" name="safeManageOrgName">
              <a-input v-model:value="formModel.safeManageOrgName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专职安全管理人员数量（人）" name="fullTimeSafePersonCount">
              <a-input-number v-model:value="formModel.fullTimeSafePersonCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全负责人姓名" name="safeDirectorName">
              <a-input v-model:value="formModel.safeDirectorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全负责人移动电话" name="safeDirectorPhone">
              <a-input v-model:value="formModel.safeDirectorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人" name="contacts">
              <a-input v-model:value="formModel.contacts" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电话" name="contactsPhone">
              <a-input v-model:value="formModel.contactsPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电子邮箱" name="contactsMailbox">
              <a-input v-model:value="formModel.contactsMailbox" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="高层管理人员数量（人）" name="seniorManagementCount">
              <a-input-number v-model:value="formModel.seniorManagementCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业技术人员数量（人）" name="professionalTechniciansCount">
              <a-input-number v-model:value="formModel.professionalTechniciansCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种作业人员数量（人）" name="specialOperationPersonCount">
              <a-input-number v-model:value="formModel.specialOperationPersonCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="从业人员数量（人）" name="employeesCount">
              <a-input-number v-model:value="formModel.employeesCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">坐标信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="矿山采场入口经度" name="longitude" :rules="req('请输入经度')">
              <a-input-number v-model:value="formModel.longitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" placeholder="如：104.065735" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="矿山采场入口纬度" name="latitude" :rules="req('请输入纬度')">
              <a-input-number v-model:value="formModel.latitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" placeholder="如：30.659462" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- baseInfoSame3 + baseInfoSame4 -->
        <a-divider orientation="left">其他信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="是否有委托技术服务机构" name="ifTechnicalServicesOrg">
              <a-radio-group v-model:value="formModel.ifTechnicalServicesOrg" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="委托技术服务机构名称" name="technicalServicesOrgName">
              <a-input v-model:value="formModel.technicalServicesOrgName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全标准化等级" name="safeStandardLevel">
              <JDictSelectTag v-model:value="formModel.safeStandardLevel" :disabled="disabled" dictCode="mine_safe_standard_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全风险等级" name="safeRiskLevel" :rules="req('请选择安全风险等级')">
              <JDictSelectTag v-model:value="formModel.safeRiskLevel" :disabled="disabled" dictCode="mine_safety_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="外包工程队伍数量（支）" name="outsourceTeamCount">
              <a-input-number v-model:value="formModel.outsourceTeamCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业邮政编码" name="postalCode">
              <a-input v-model:value="formModel.postalCode" :disabled="disabled" :maxlength="6" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排土场数量（个）" name="wasteDumpCount">
              <a-input-number v-model:value="formModel.wasteDumpCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 尾矿库（03）===== -->
      <template v-else-if="isWk">
        <a-divider orientation="left">尾矿库基本信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="工商营业执照证照编号" name="meTyshxydm">
              <a-input v-model:value="formModel.meTyshxydm" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建库时间" name="buildMineDate">
              <a-date-picker v-model:value="formModel.buildMineDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="试运行时间" name="wkPilotRunDate">
              <a-date-picker v-model:value="formModel.wkPilotRunDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="投产时间" name="productDate">
              <a-date-picker v-model:value="formModel.productDate" :disabled="disabled" value-format="YYYY-MM-DD" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿库类型" name="wkTypeCode">
              <JDictSelectTag v-model:value="formModel.wkTypeCode" :disabled="disabled" dictCode="mine_wk_type_code" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="尾矿矿种" name="wkMinerals">
              <a-input v-model:value="formModel.wkMinerals" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="industry">
              <template #label>
                所属行业
                <a-tooltip title="是指矿山开采矿种或矿产品属于哪个行业，如铜、镍、铅锌、稀土等属于有色行业、铁矿、锰矿等属于黑色行业。">
                  <QuestionCircleOutlined class="label-tip-icon" />
                </a-tooltip>
              </template>
              <JDictSelectTag v-model:value="formModel.industry" :disabled="disabled" dictCode="mine_belong_industry_03" placeholder="请选择" allow-clear />
            </a-form-item>
          </a-col>
          <!-- baseInfoSame2 -->
          <a-col :span="12">
            <a-form-item label="经济类型" name="companyEconomyType" :rules="req('请选择经济类型')">
              <JDictSelectTag v-model:value="formModel.companyEconomyType" :disabled="disabled" dictCode="mine_company_economy_type" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址" name="address" :rules="req('请输入地址')">
              <a-input v-model:value="formModel.address" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="距周边城市最近里程（km）" name="jzbcszjlc">
              <a-input-number v-model:value="formModel.jzbcszjlc" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="从最近城市到矿山耗时（h）" name="czjcsdkshs">
              <a-input-number v-model:value="formModel.czjcsdkshs" :disabled="disabled" :precision="4" :step="0.0001" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法人代表姓名" name="legalName">
              <a-input v-model:value="formModel.legalName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法人代表移动电话" name="legalPhone">
              <a-input v-model:value="formModel.legalPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要负责人姓名" name="directorName" :rules="req('请输入主要负责人姓名')">
              <a-input v-model:value="formModel.directorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="主要负责人移动电话" name="directorPhone" :rules="req('请输入主要负责人移动电话')">
              <a-input v-model:value="formModel.directorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全管理机构名称" name="safeManageOrgName">
              <a-input v-model:value="formModel.safeManageOrgName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专职安全管理人员数量（人）" name="fullTimeSafePersonCount">
              <a-input-number v-model:value="formModel.fullTimeSafePersonCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全负责人姓名" name="safeDirectorName">
              <a-input v-model:value="formModel.safeDirectorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全负责人移动电话" name="safeDirectorPhone">
              <a-input v-model:value="formModel.safeDirectorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人" name="contacts">
              <a-input v-model:value="formModel.contacts" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电话" name="contactsPhone">
              <a-input v-model:value="formModel.contactsPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人电子邮箱" name="contactsMailbox">
              <a-input v-model:value="formModel.contactsMailbox" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="高层管理人员数量（人）" name="seniorManagementCount">
              <a-input-number v-model:value="formModel.seniorManagementCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="专业技术人员数量（人）" name="professionalTechniciansCount">
              <a-input-number v-model:value="formModel.professionalTechniciansCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="特种作业人员数量（人）" name="specialOperationPersonCount">
              <a-input-number v-model:value="formModel.specialOperationPersonCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="从业人员数量（人）" name="employeesCount">
              <a-input-number v-model:value="formModel.employeesCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否有生产经营主体" name="wkIfScjyzt">
              <a-radio-group v-model:value="formModel.wkIfScjyzt" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">坐标信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="初期坝顶中点经度" name="longitude" :rules="req('请输入经度')">
              <a-input-number v-model:value="formModel.longitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" placeholder="如：104.065735" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="初期坝顶中点纬度" name="latitude" :rules="req('请输入纬度')">
              <a-input-number v-model:value="formModel.latitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" placeholder="如：30.659462" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="初期坝坝轴线两端端点经度" name="wkZxldLongitude">
              <a-input-number v-model:value="formModel.wkZxldLongitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="初期坝坝轴线两端端点纬度" name="wkZxldLatitude">
              <a-input-number v-model:value="formModel.wkZxldLatitude" :disabled="disabled" :precision="6" :step="0.01" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="是否在长江、黄河及其主要支流、其他重要河流岸线范围内"
              name="wkIfCjhhfw"
              :rules="req('请选择')"
            >
              <a-radio-group v-model:value="formModel.wkIfCjhhfw" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- baseInfoSame3 -->
        <a-divider orientation="left">其他信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="是否有委托技术服务机构" name="ifTechnicalServicesOrg">
              <a-radio-group v-model:value="formModel.ifTechnicalServicesOrg" :disabled="disabled">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="委托技术服务机构名称" name="technicalServicesOrgName">
              <a-input v-model:value="formModel.technicalServicesOrgName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全标准化等级" name="safeStandardLevel">
              <JDictSelectTag v-model:value="formModel.safeStandardLevel" :disabled="disabled" dictCode="mine_safe_standard_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全风险等级" name="safeRiskLevel" :rules="req('请选择安全风险等级')">
              <JDictSelectTag v-model:value="formModel.safeRiskLevel" :disabled="disabled" dictCode="mine_safety_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="外包工程队伍数量（支）" name="outsourceTeamCount">
              <a-input-number v-model:value="formModel.outsourceTeamCount" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- ===== 煤矿（07/08）===== -->
      <template v-else-if="isCoal">
        <a-divider orientation="left">企业结构信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="企业负责人" name="directorName" :rules="req('请输入企业负责人')">
              <a-input v-model:value="formModel.directorName" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办公电话" name="directorPhone" :rules="req('请输入办公电话')">
              <a-input v-model:value="formModel.directorPhone" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="煤矿地址" name="address" :rules="req('请输入煤矿地址')">
              <a-input v-model:value="formModel.address" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地质条件" name="geologicalConditions" :rules="req('请输入地质条件')">
              <a-input v-model:value="formModel.geologicalConditions" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="煤矿等级" name="gasLevel" :rules="req('请输入煤矿等级')">
              <a-input v-model:value="formModel.gasLevel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设计生产能力" name="designCapacity" :rules="req('请输入设计生产能力')">
              <a-input v-model:value="formModel.designCapacity" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="核定生产能力" name="certifiedCapacity" :rules="req('请输入核定生产能力')">
              <a-input v-model:value="formModel.certifiedCapacity" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="水患等级" name="floodLevel" :rules="req('请输入水患等级')">
              <a-input v-model:value="formModel.floodLevel" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全生产标准化等级" name="safeStandardLevel" :rules="req('请选择安全生产标准化等级')">
              <JDictSelectTag v-model:value="formModel.safeStandardLevel" :disabled="disabled" dictCode="mine_safe_standard_level" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="煤尘爆炸危险性" name="explosionHazard" :rules="req('请输入煤尘爆炸危险性')">
              <a-input v-model:value="formModel.explosionHazard" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开采煤层" name="workingSeam" :rules="req('请输入开采煤层')">
              <a-input v-model:value="formModel.workingSeam" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全资金" name="securityFunds" :rules="req('请输入安全资金')">
              <a-input v-model:value="formModel.securityFunds" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="安全资金年份" name="securityFundsYear" :rules="req('请输入安全资金年份')">
              <a-input v-model:value="formModel.securityFundsYear" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="生产状态" name="mineState" :rules="req('请选择生产状态')">
              <JDictSelectTag v-model:value="formModel.mineState" :disabled="disabled" dictCode="mine_product_status" placeholder="请选择" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="核定下井人数（人）" name="upperLimitPeople" :rules="req('请输入核定下井人数')">
              <a-input-number v-model:value="formModel.upperLimitPeople" :disabled="disabled" :precision="0" :min="0" style="width:100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="持证状态" name="certificateState" :rules="req('请输入持证状态')">
              <a-input v-model:value="formModel.certificateState" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="煤的自然发火倾向性" name="selfIgnition" :rules="req('请输入煤的自然发火倾向性')">
              <a-textarea v-model:value="formModel.selfIgnition" :disabled="disabled" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">坐标信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="经度" name="longitude" :rules="req('请输入经度')">
              <a-input v-model:value="formModel.longitude" :disabled="disabled" placeholder="如：104.065735" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" name="latitude" :rules="req('请输入纬度')">
              <a-input v-model:value="formModel.latitude" :disabled="disabled" placeholder="如：30.659462" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { getDictTextByCode } from '/@/utils/dict'
import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue'

interface Props {
  detail: Record<string, any>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const formRef = ref()
const formModel = ref<Record<string, any>>({})

const mineTypeCode = computed(() => {
  const raw = formModel.value.mineType
  return raw == null ? '' : String(raw)
})

// 类型判断 — MineType: 00地下矿山 01露天矿山(含排土场) 03尾矿库 07井工煤矿 08露天煤矿
const isDx   = computed(() => mineTypeCode.value === '00')
const isLt   = computed(() => mineTypeCode.value === '01')
const isWk   = computed(() => mineTypeCode.value === '03')
const isCoal = computed(() => mineTypeCode.value === '07' || mineTypeCode.value === '08')

// 只读头部标签随类型变化
const nameLabel = computed(() => isWk.value ? '尾矿库名称' : isCoal.value ? '煤矿名称' : '矿山名称')

/** 辅助：生成必填规则 */
function req(message: string) {
  return [{ required: true, message }]
}

watch(
  () => props.detail,
  (val) => {
    if (!val) return
    const next = { ...val }
    const rawType = next.mineType ?? next.companyType
    const code = rawType == null ? '' : String(rawType)
    next.mineTypeText = code
      ? getDictTextByCode(code, 'mine_speciality') || code
      : (next.mineTypeText ?? '')
    formModel.value = next
  },
  { immediate: true, deep: true }
)

/** 校验表单并返回数据，由 EnterpriseDetail 统一调用 */
async function validate(): Promise<Record<string, any>> {
  await formRef.value?.validate()
  return { ...formModel.value }
}

defineExpose({ validate })
</script>

<style lang="less" scoped>
@import './formClassComponent.less';
</style>
