var mcache = require("memory-cache");
const { getClientIp } = require("request-ip");

var cache = (duration) => {
  return (req, res, next) => {
    let key = `_express_${req.originalUrl || req.url}_${getClientIp(req)}`;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

module.exports = cache;
