/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-22
 */
var ServerAgent = require('../services/ServerAgent.js')
var RestfulController = {
    index: function (req, res) {
        var headers = req.headers;
        var reqArr = [
          //  {'Remote Address': req.host},
            {'Request URL': req.body.url},
            {'Request Method': req.body.method},
            {'Accept': headers.accept},
            {'Accept-Encoding': headers['accept-encoding']},
            {'Accept-Language': headers['accept-language']},
            {'Connection': headers['connection']},
            {'Host': headers['host']},
            {'User-Agent': headers['user-agent']},
            {'Content-type': headers['content-type']},
            {'Content-length': headers['content-length']},
          //  {'Origin': headers['origin']},
            //{'Referer': headers['referer']},
            {'Protocol': req.protocol},
            {'Fresh': req.fresh},
            {'Xhr': req.xhr},
            {'Cookies': req.cookies},
        ];
        var body = req.body;
        if (body.method == 'GET') {
            var request = require('request')
            request = request.defaults({jar: true});
            var options = {
                url:body.url,
                method: body.method
            }
            request(options, function (err, response, resBody) {
                var resArr = [];
                if (err) {
                    resArr = [
                        {'Error-Message': err}
                    ]
                } else {
                    var resHeaders = response.headers;
                    resArr = [
                        {'Status Code': response.statusCode},
                        {'Content-length': resHeaders['content-length']},
                        {'Content-type': resHeaders['content-type']},
                        {'Date': resHeaders.date},
                        {'Connection': resHeaders.connection},
                        {'Set-cookie': resHeaders['set-cookie']}
                    ];
                    resArr.push({
                        'Body': resBody
                    });
                }
                var result = {
                    req:  reqArr,
                    res: resArr
                }
                return res.send(result);
            });
        } else if (body.method == 'DELETE') {
            var request = require('request')
            request = request.defaults({jar: true});
            var options = {
                url:body.url,
                method: body.method
            }
            request(options, function (err, response, resBody) {
                var resArr = [];
                if (err) {
                    resArr = [
                        {'Error-Message': err}
                    ]
                } else {
                    var resHeaders = response.headers;
                    resArr = [
                        {'Status Code': response.statusCode},
                        {'Content-length': resHeaders['content-length']},
                        {'Content-type': resHeaders['content-type']},
                        {'Date': resHeaders.date},
                        {'Connection': resHeaders.connection},
                        {'Set-cookie': resHeaders['set-cookie']}
                    ];
                    resArr.push({
                        'Body': resBody
                    });
                }
                var result = {
                    req:  reqArr,
                    res: resArr
                }
                return res.send(result);
            });
        } else if (body.method == 'POST') {
            var request = require('request')
            request = request.defaults({jar: true});
            var options = {
                url:body.url,
                method: body.method,
                json: body.body
            };
            console.log('options:\n', options);
            request(options, function (err, response, resBody) {
                var resArr = [];
                if (err) {
                    resArr = [
                        {'Error-Message': err}
                    ]
                    console.log('err:\n', err);
                } else {
                    var resHeaders = response.headers;
                    resArr = [
                        {'Status Code': response.statusCode},
                        {'Content-length': resHeaders['content-length']},
                        {'Content-type': resHeaders['content-type']},
                        {'Date': resHeaders.date},
                        {'Connection': resHeaders.connection},
                        {'Set-cookie': resHeaders['set-cookie']},
                        {'Body': resBody}
                    ];
                }
                var result = {
                    req:  reqArr,
                    res: resArr
                }
                return res.send(result);
            });
        } else if (body.method == 'PUT') {
            var request = require('request')
            request = request.defaults({jar: true});
            var options = {
                url:body.url,
                method: body.method,
                json: body.body
            };
            console.log('options:\n', options);
            request(options, function (err, response, resBody) {
                var resArr = [];
                if (err) {
                    resArr = [
                        {'Error-Message': err}
                    ]
                    console.log('err:\n', err);
                } else {
                    var resHeaders = response.headers;
                    resArr = [
                        {'Status Code': response.statusCode},
                        {'Content-length': resHeaders['content-length']},
                        {'Content-type': resHeaders['content-type']},
                        {'Date': resHeaders.date},
                        {'Connection': resHeaders.connection},
                        {'Set-cookie': resHeaders['set-cookie']},
                        {'Body': resBody}
                    ];
                }
                var result = {
                    req:  reqArr,
                    res: resArr
                }
                return res.send(result);
            });
        } else {
            return res.send('参数错误', 404);
        }
    }
};

module.exports = RestfulController;