import { onMounted, onUnmounted } from 'vue';

/**
 * 自动调整表格高度
 * @param getDataSource 获取表格数据源的方法
 * @param offset 高度偏移量
 *
 */
export function useTableHeight(getDataSource: () => any[], offset = 350) {
  const setHeight = () => {
    setTimeout(() => {
      // 获取当前窗口高度
      return;
      const windowHeight = window.innerHeight;
      const dataSource = getDataSource();
      console.log(dataSource);
      // 判断有没有数据
      if (!dataSource || dataSource.length === 0) {
        const tableContent = document.querySelector('.ant-table-content');
        if (tableContent) {
          tableContent['style'].height = 'unset';
        }

        const tBody = document.querySelector('.ant-table-tbody');
        console.log(tBody, '这里');

        if (tBody) {
          // 动态设置高度----空列表还未测试！
          tBody['style'].height = `${windowHeight - offset - 106}px`;
          tBody['style'].overflow = 'auto';
        }
      } else {
        const tableContent = document.querySelector('.ant-table-content') || document.querySelector('.ant-table-body');
        if (tableContent) {
          // 动态设置高度
          tableContent['style'].height = `${windowHeight - offset}px`;
          tableContent['style'].overflow = 'auto';
          console.log(windowHeight - offset, 333333);
        }
      }
    }, 500);
  };

  const eventResize = () => {
    window.addEventListener('resize', setHeight);
  };

  onMounted(() => {
    // eventResize();
    // setHeight();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', setHeight);
  });

  return {
    setHeight,
    eventResize,
  };
}
