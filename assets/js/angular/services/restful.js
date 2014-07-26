/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-22
 */
app.factory('Restful', function ($resource) {
    return $resource(window.restful.baseURL + 'restful/:ID',{ID:'@_id'}, {
    })
})