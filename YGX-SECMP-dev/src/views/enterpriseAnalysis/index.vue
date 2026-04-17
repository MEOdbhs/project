<template>
    <div class="enterprise-analysis-container">
        <div class="enterprise-analysis-content">
            <div class="enterprise-analysis-content-left">
                <div class="enterprise-analysis-content-left-item card-item">
                    <Enterprise />
                </div>
                <div class="enterprise-analysis-content-left-item card-item">
                    <Chemicals />
                </div>
            </div>
            <div class="enterprise-analysis-content-right">
                <div class="enterprise-analysis-content-right-item enterprise-analysis-content-right-top">
                    <div class="enterprise-analysis-content-right-top-item card-item"><Area /></div>
                    <div class="enterprise-analysis-content-right-top-item card-item">
                        <Dangerous />
                    </div>
                </div>
                <div class="enterprise-analysis-content-right-item enterprise-analysis-content-right-bottom card-item">
                    <Process />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' name="enterpriseAnalysis" setup>
import Enterprise from './components/enterprise.vue'
import Area from './components/area.vue'
import Dangerous from './components/dangerous.vue'
import Chemicals from './components/chemicals.vue'
import Process from './components/process.vue'
</script>

<style lang='less' scoped>
.enterprise-analysis-container {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;

    .enterprise-analysis-content {
        height: 100%;
        width: 100%;
        display: flex;
        min-height: 0;
        box-sizing: border-box;

        &-left {
            flex: 1;
            margin-right: 10px;
            display: flex;
            flex-direction: column;
            min-height: 0;

            &-item {
                flex: 1;
                margin-bottom: 10px;
                min-height: 0;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }

        &-right {
            flex: 2;
            display: flex;
            flex-direction: column;
            min-height: 0;

            &-item {
                flex: 1;
                margin-bottom: 10px;
                min-height: 0;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            &-top {
                display: flex;
                min-height: 0;

                &-item {
                    flex: 1;
                    margin-right: 10px;
                    min-height: 0;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
    }

    .card-item {
        background-color: #0b1c36;
        // padding: 10px;
    }
}
</style>