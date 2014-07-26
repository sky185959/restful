/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-22
 */
var request = require('request')
request = request.defaults({jar: true})
var future = require("sails").config.future

function Collection(resource) {
    this.url = resource;
    this.json = true
}

Collection.prototype.request = function (options, fn) {
    var url = this.url;
    options.url = url;
//    options.json = options.json || this.json;
    request(options, function (err, res, body) {
        if (err) {
            return fn(err);
        }
        return fn(null, body);
    });
}

Collection.prototype.post = function (options, fn) {
    options.method = 'POST';
    this.request(options, fn);
}

Collection.prototype.get = function (options, fn) {
    options.method = 'GET';
    this.request(options, fn);
}

Collection.prototype.put = function (options, fn) {
    options.method = 'PUT';
    this.request(options, fn);
}

Collection.prototype.del = function (options, fn) {
    options.method = 'DELETE';
    this.request(options, fn);
}
exports = module.exports = Collection;
