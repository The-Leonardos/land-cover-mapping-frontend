const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/(main)/map/_components',
  'src/app/(main)/map/_stores',
  'src/app/(main)/forecast/_components',
  'src/app/(main)/forecast/_actions',
  'src/app/(main)/forecast/[barangay]/[year]'
];

dirs.forEach(d => fs.mkdirSync(d, {recursive: true}));

const moves = [
  ['src/components/barangay-detail-panel.tsx', 'src/app/(main)/map/_components/barangay-detail-panel.tsx'],
  ['src/components/barangay-vector-layer.tsx', 'src/app/(main)/map/_components/barangay-vector-layer.tsx'],
  ['src/components/dynamic-world-image-renderer.tsx', 'src/app/(main)/map/_components/dynamic-world-image-renderer.tsx'],
  ['src/components/interactive-map.tsx', 'src/app/(main)/map/_components/interactive-map.tsx'],
  ['src/components/layer-panel.tsx', 'src/app/(main)/map/_components/layer-panel.tsx'],
  ['src/components/satellite-image-renderer.tsx', 'src/app/(main)/map/_components/satellite-image-renderer.tsx'],
  ['src/components/timeline-control.tsx', 'src/app/(main)/map/_components/timeline-control.tsx'],
  ['src/lib/store/barangayStore.ts', 'src/app/(main)/map/_stores/barangayStore.ts'],
  ['src/lib/store/loadingLayerStore.ts', 'src/app/(main)/map/_stores/loadingLayerStore.ts'],
  ['src/components/forecasting-panel.tsx', 'src/app/(main)/forecast/_components/forecasting-panel.tsx'],
  ['src/actions/getBaranggayTimeSeriesData.ts', 'src/app/(main)/forecast/_actions/getBaranggayTimeSeriesData.ts']
];

moves.forEach(([src, dest]) => {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved ${src} to ${dest}`);
  } else {
    console.log(`Missing ${src}`);
  }
});
