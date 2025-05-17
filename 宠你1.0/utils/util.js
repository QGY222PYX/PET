// 封装微信回调API为Promise
function wxPromise(fn, options = {}) {
  return new Promise((resolve, reject) => {
    fn({ ...options, success: resolve, fail: reject });
  });
}

module.exports = {
  wxPromise
}