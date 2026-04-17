<template>
  <!--附件组件，只支持图片和文档，如有需要音视频文件，后续再扩展 -->
  <BasicModal
    :title="title"
    :width="'70vw'"
    :height="500"
    :default-fullscreen="true"
    :can-fullscreen="true"
    :keyboard="false"
    v-bind="$attrs"
    :maskClosable="false"
    :footer="null"
    @register="registerModal"
  >
    <div class="h-full">
      <iframe :src="previewURL" allowfullscreen="true" width="100%" height="100%"></iframe>
    </div>
  </BasicModal>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getDownloadFileUrl } from '/@/api/common/base';
  import { encryptByBase64 } from '/@/utils/cipher';
  const glob = useGlobSetting();
  const previewURL = computed(() => {
    let url = '';
    
    const fileUrl = `${window.location.origin}${glob.apiUrl}${getDownloadFileUrl}?filePath=${filePath.value}&fullfilename=${fileName.value}`;

    console.log(url = `${glob.viewUrl}${fileUrl}`);
    console.log(fileUrl);
    
    if(!filePath.value){
      //
      return '';
    }
    url = `${glob.viewUrl}${encodeURIComponent(encryptByBase64(fileUrl))}`;

    // console.log( fileUrl);
    
    //console.log(url);
    return url;
  });

  // 当前的弹窗数据
  let filePath = ref('');
  let fileName = ref('');
  let title = ref('附件预览');
  // 注册弹窗
  const [registerModal] = useModalInner(async (data) => {
    filePath.value = data.filePath;
    fileName.value = data.fileName;
    title.value = data?.title || '附件预览';
  });
</script>
<style lang="less" scoped></style>
