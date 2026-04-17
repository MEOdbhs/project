import { FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict';

export const columns = [
  {
    title: '危险化工工艺名称',
    dataIndex: 'dangerWorkmanship',
    customRender: ({ record }) => {
      return getDictTextByCode(record.dangerWorkmanship,'dangerous_chemical_process');
    },
    width: 200,
  },
  {
    title: '涉及的典型工艺装置名称',
    dataIndex: 'dictText',
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'typicalWorkmanship',
    label: '工艺装置名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
