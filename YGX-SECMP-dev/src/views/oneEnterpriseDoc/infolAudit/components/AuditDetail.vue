<template>
  <EnterpriseDetail
    v-if="detail"
    :detail="detail"
    :is-view="isView"
    :loading="loading"
    :show-audit-panel="!isView"
    @back="emit('back')"
    @auditApprove="handleApprove"
    @auditReturn="handleReturn"
  />
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import EnterpriseDetail from '../../enterpriseList/components/EnterpriseDetail.vue'
import { auditMine } from '../infolAudit.api'

interface Props {
  detail: Record<string, any> | null
  isView?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { isView: false, loading: false })
const emit = defineEmits<{ back: []; approved: []; returned: [] }>()

async function handleReturn(reason: string) {
  const realReason = reason.trim()
  if (!realReason) {
    message.warning('请填写退回原因')
    return
  }
  const checkId = props.detail?.waitCheckId
  if (!checkId) {
    message.error('缺少审核记录ID')
    return
  }
  await auditMine({ checkId, pass: false, checkComment: realReason })
  message.success('已退回')
  emit('returned')
  emit('back')
}

async function handleApprove() {
  const checkId = props.detail?.waitCheckId
  if (!checkId) {
    message.error('缺少审核记录ID')
    return
  }
  await auditMine({ checkId, pass: true, checkComment: '' })
  message.success('审核通过')
  emit('approved')
  emit('back')
}
</script>
