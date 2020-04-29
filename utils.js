const skus = require('./src/constants/whipSkus.json');

export const getCustomSku = (whipLength, handleLength, concho, waxed) => {
  const item = skus.filter(
    s =>
      s.concho === concho &&
      s.waxed === waxed &&
      s.handleLength === handleLength &&
      s.whipLength === whipLength
  );
  return item[0].sku;
};
