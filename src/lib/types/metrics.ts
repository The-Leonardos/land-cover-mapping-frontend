export type DeepLabMetrics = {
  modelName: string;
  date: string;
  year: string;
  iou: string;
  acc: string;
  prec: string;
  rec: string;
  f1: string;
};

export type DeepVarMetrics = {
  modelName: string;
  date: string;
  year: string;
  mae: string;
  rmse: string;
};
