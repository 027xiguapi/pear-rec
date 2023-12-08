export interface Lang {
  magnifier_position_label: string;
  operation_ok_title: string;
  operation_cancel_title: string;
  operation_save_title: string;
  operation_redo_title: string;
  operation_undo_title: string;
  operation_mosaic_title: string;
  operation_text_title: string;
  operation_brush_title: string;
  operation_arrow_title: string;
  operation_ellipse_title: string;
  operation_rectangle_title: string;
  operation_search_title: string;
  operation_scan_title: string;
  operation_pin_title: string;
}

const zhCN: Lang = {
  magnifier_position_label: '坐标',
  operation_ok_title: '确定',
  operation_cancel_title: '取消',
  operation_save_title: '保存',
  operation_redo_title: '重做',
  operation_undo_title: '撤销',
  operation_mosaic_title: '马赛克',
  operation_text_title: '文本',
  operation_brush_title: '画笔',
  operation_arrow_title: '箭头',
  operation_ellipse_title: '椭圆',
  operation_rectangle_title: '矩形',
  operation_search_title: '搜图',
  operation_scan_title: '扫码',
  operation_pin_title: '钉图',
};

export default zhCN;
