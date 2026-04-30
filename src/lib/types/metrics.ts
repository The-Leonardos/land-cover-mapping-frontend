export type DeepLabMetrics = {
  modelName: string;
  trainingDate: string;
  trainingData: string;
  year: string;

  iou: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
};

export type DeepVarMetrics = {
  modelName: string;
  trainingDate: string;
  trainingData: string;
  year: string;

  mae: string;
  rmse: string;
  r2: string;
  crps: string;
};
