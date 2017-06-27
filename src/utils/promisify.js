import Promise from '../../node_modules/es6-promise/dist/es6-promise.min';

export default (fn) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      fn(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  };
};
