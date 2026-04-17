<template>
    <div class="workbench-container">
        <IndexItem pageType="workbench" />
    </div>
</template>

<script lang="ts" setup>
import IndexItem from '../pageConfig/components/IndexItem.vue'

</script>

<style lang="less" scoped>

.workbench-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .workbench-header {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 20px;
        border-bottom: 1px solid #e5e5e5;
        .workbench-header-text {
            font-size: 16px;
            font-weight: 600;
            color: #FFF;
            margin: 0 10px;
            cursor: pointer;
            &:hover {
                color: #1677ff;
                text-decoration: underline;
            }
            &.active {
                color: #1677ff;
                text-decoration: underline;
            }
        }
    }
}

</style>