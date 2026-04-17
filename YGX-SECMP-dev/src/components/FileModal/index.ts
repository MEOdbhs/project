// 获取简化的fileType，根据文件类型和后缀名判断文件类型
export const getFileType = (fileName) => {
  const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  if (['png', 'jpg', 'jpeg'].includes(extension)) {
    return 'img';
  }
  if (['doc', 'docx'].includes(extension)) {
    return 'word';
  }
  if (['xls', 'xlsx'].includes(extension)) {
    return 'excel';
  }
  if (['pdf'].includes(extension)) {
    return 'pdf';
  }
  return 'other';
};
// 获取fileType对应的后端数值
export const getFileTypeNum = (fileType) => {
  if (fileType === 'img') {
    return 1;
  }
  return 4;
};
