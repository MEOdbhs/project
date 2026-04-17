<template>
  <div class="enterprise-info-stats">
    <div class="card-header-box">
      <span class="card-title">企业信息统计</span>
      <span class="more-btn" @click="handleMore">更多</span>
    </div>
    <div class="card-content">
      <div class="enterprise-item" v-for="(item, index) in enterpriseList" :key="index">
        <div class="enterprise-header">
          <div class="enterprise-name-box">
            <span class="enterprise-name" :title="item.name">{{ item.name }}</span>
            <span class="category ml-2 tag-primary">{{ item.category }}</span>
            <span class="size ml-2 tag-primary">{{ item.size }}</span>
          </div>
          <div class="enterprise-meta">
            <span :class="['status', item.statusText === '在用' ? 'active' : 'inactive']">
              {{ item.statusText }}
            </span>
          </div>
        </div>

        <div class="enterprise-details" v-if="item.details">
          <div class="detail-row-container">
            <div class="detail-row">
              <span class="detail-row-item">
                <span class="label">安全负责人：</span>
                <span class="value">{{ item.details.enterpriseHead }}</span>
              </span>

              <span class="px-2 division-line">|</span>
              <span class="detail-row-item">
                <span class="label">安全负责人电话：</span>
                <span class="phone">{{ item.details.enterpriseHeadPhone }}</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-row-item">
                <span class="label">企业负责人：</span>
                <span class="value">{{ item.details.leader }}</span>
              </span>

              <span class="px-2 division-line">|</span>
              <span class="detail-row-item">
                <span class="label">企业负责人电话：</span>
                <span class="phone">{{ item.details.leaderPhone }}</span>
              </span>
            </div>
          </div>

          <div class="detail-address" style="padding-top: 10px;">
            <span class="label">地址：</span>
            <span class="value address">{{ item.details.address }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BasicModal
    title="企业信息列表"
    width="1200px"
    :showOkBtn="false"
    destroyOnClose
    @register="registerModal"
  >
    <BasicTable  @register="registerTable" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
import { BasicModal, useModal } from '/@/components/Modal';
import { enterpriseListData } from '../api';

interface EnterpriseDetail {
  enterpriseHead: string;
  enterpriseHeadPhone: string;
  safetyHead: string;
  safetyHeadPhone: string;
  address: string;
}

interface EnterpriseItem {
  name: string;
  category: string;
  size: string;
  status: string;
  details?: EnterpriseDetail;
}

const enterpriseList = ref<EnterpriseItem[]>([]);

const enterpriseColumns: BasicColumn[] = [
  {
    title: '企业名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '企业编码',
    dataIndex: 'code',
    width: 160,
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'creditCode',
    width: 200,
  },
  {
    title: '法人代表',
    dataIndex: 'legalPerson',
    width: 120,
  },
  {
    title: '企业负责人',
    dataIndex: 'leader',
    width: 120,
  },
  {
    title: '企业负责人电话',
    dataIndex: 'leaderPhone',
    width: 160,
  },
  {
    title: '安全负责人',
    dataIndex: 'safer',
    width: 120,
  },
  {
    title: '安全负责人电话',
    dataIndex: 'saferPhone',
    width: 160,
  },
  {
    title: '所属行业',
    dataIndex: 'industryText',
    width: 140,
  },
  {
    title: '企业规模',
    dataIndex: 'scaleText',
    width: 120,
  },
  {
    title: '企业状态',
    dataIndex: 'statusText',
    width: 120,
  },
];

const enterpriseSearchSchemas: FormSchema[] = [
  {
    field: 'name',
    label: '企业名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '企业编码',
    component: 'Input',
    colProps: { span: 9 },
  },
];

const [registerModal, { openModal }] = useModal();

const [registerTable, { reload }] = useTable({
  api: enterpriseListData,
  autoOrgCode:false,
  columns: enterpriseColumns,
  useSearchForm: true,
  formConfig: {
    labelWidth: 90,
    schemas: enterpriseSearchSchemas,
  },
  showTableSetting: false,
  bordered: true,
  striped: true,
  canResize: false,
  showIndexColumn: true,
  rowKey: 'code',
  pagination: true,
  scroll: { y: 480 },
});

const getEnterpriseList = async () => {
  const res = await enterpriseListData({});
  if(res){
    enterpriseList.value = res.map((item: any) => {
      return {
        name: item.name,
        category: item.industryText,
        size: item.scaleText,
        status: item.statusText==='0'?'在用':'停用',
        statusText: item.statusText,
        details: {
          enterpriseHead: item.safer,
          enterpriseHeadPhone: item.saferPhone,
          safetyHead: item.safer,
          safetyHeadPhone: item.saferPhone,
          leader:item.leader,
          leaderPhone:item.leaderPhone,
          address: item.registerAddress
        }
      }
    });
  }
};

const handleMore = () => {
  openModal(true);
  reload();
};

onMounted(() => {
  getEnterpriseList();
});
</script>

<style lang="less" scoped>
.enterprise-info-stats {
  background: rgba(11, 28, 54, 0.6);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;

  .card-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }

    .more-btn {
      font-size: 14px;
      color: #40a9ff;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .card-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    padding-right: 4px;

    .enterprise-item {
      border: 1px solid #2c63b6;
      background-color: rgba(44, 99, 182, 0.3);
      padding: 10px;
      margin-bottom: 10px;
      // &:last-child {
      //   border-bottom: none;
      // }

      .enterprise-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
        .enterprise-name-box{
          max-width: 80%;
        }
        .tag-primary {
          font-size: 13px;
          padding: 2px 8px;
          border-radius: 2px;
          background: rgba(44, 99, 182, 0.2);
          color: #fff;
        }
      }

      .enterprise-name {
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        display: inline-block;
        max-width: 22ch;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }

      .enterprise-meta {
        display: flex;
        gap: 12px;
        align-items: center;

        .category,
        .size {
          font-size: 13px;
          color: #87ceeb;
        }

        .status {
          font-size: 13px;
          padding: 2px 8px;
          border-radius: 2px;

          &.active {
            color: #52c41a;
            background: rgba(82, 196, 26, 0.2);
          }

          &.inactive {
            color: #ff4d4f;
            background: rgba(255, 77, 79, 0.2);
          }
        }
      }

      .enterprise-details {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);

        .detail-row {
          display: flex;
          align-items: center;
          font-size: 13px;
          margin-bottom: 6px;
          padding: 5px 0;
          gap: 8px;

          > span {
            flex: 1;
            text-align: left;
            min-width: 0;
          }

          > .division-line {
            flex: 0 0 auto;
            padding: 0 4px;
            text-align: center;
          }
          .detail-row-item {
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          }

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            color: #87ceeb;
            // min-width: 90px;
          }
          .address {
            flex-basis: 40%;
            flex-shrink: 0;
            flex-grow: 0;
            text-align: left;
          }
          .value {
            color: #fff;
            // flex: 1;
          }

          .phone {
            color: #40a9ff;
            white-space: nowrap;
          }
        }
        .detail-address {
          color: #87ceeb;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      }
    }
  }
}
</style>
