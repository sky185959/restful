/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-22
 */
function RestfulCtrl($scope, Restful, $timeout, $modal,localStorageService) {
    $scope.initLocal = function() {
        var localMethod = localStorageService.get('localStorageMethod');
        if(localMethod&&localMethod.method) {
            $scope.method = localMethod.method;
        } else {
            $scope.method = 'GET';
        }
        var localBodyProfile = localStorageService.get('localStorageBodyProfile');
        console.log("$scope.localBodyProfile:\n", localBodyProfile);
        if(localBodyProfile && localBodyProfile.isShow){
            if("true" ==  localBodyProfile.isShow){
                $scope.showBody = true;
            } else {
                $scope.showBody = false;
            }
            console.log("boolean:\n", $scope.showBody);
        } else {
            $scope.showBody = true;
        }
    };
    $scope.objs =[{
        key:'',
        value:''
    }];
    $scope.addBody = function () {
        $scope.objs.push({
            key:'',
            value:''
        });
    };
    $scope.minusBody = function () {
        if ($scope.objs.length==0) {
            /*if ($scope.method == 'GET') {
                if ($scope.objs.length != 0) {
                    $scope.objs.pop();
                }
            }*/
            return;
        } else {
            $scope.objs.pop();
        }
    };
    function check(url) {
        if ((url.indexOf('http://') != 0) && (url.indexOf('https://') != 0) ) {
            $scope.isShow = true;
            $scope.msgClass = 'alert alert-danger';
            $scope.msg = '请输入正确的url，需以http://或https//开头';
            $timeout(function () {
                $scope.isShow = false;
            }, 2000);
            return false;
        } else {
            return true;
        }
    }
    $scope.tipsArr = localStorageService.get('localStorageTipsArr')||[];
    $scope.submit = function ($event, index) {
        if (index==1 && $event.keyCode != 13) {
            return;
        }
        if (!check($scope.url)) {
            return;
        }

        else if($scope.url){
            var method = $scope.method;
            var tempArrs = $scope.tipsArr;
            for (var v = 0; v < tempArrs.length; v++) {
                if (tempArrs[v] == $scope.url) {
                    break;
                }
            }
            if (v == tempArrs.length) {
                $scope.tipsArr.unshift($scope.url);
            }
            if ($scope.tipsArr.length >= 10) {
                $scope.tipsArr = $scope.tipsArr.slice(0, 10);
            }
            localStorageService.set('localStorageTipsArr',$scope.tipsArr);
            var obj = {
                method: $scope.method,
                url:$scope.url || ''
            }
            if (method == 'GET' || method == 'DELETE') {
                
                if (method == 'GET') {
                    var qs = '?';
                    var filterObj = $scope.objs.filter(function (item){
                        return (item.key&&item.value);
                    });
                    filterObj.forEach(function(item, index) {
                        var key = item.key;
                        var value = item.value
                        if (index == filterObj.length-1) {
                            qs +=  (key+ '='+ value) ;
                        } else {
                            qs +=  (key+ '='+ value) + '&';
                        }

                    });
                    if (qs != '?') {
                        obj.url = obj.url + qs;
                    }
                }
            } else if(method == 'POST' || method == 'PUT') {
                obj.body = {};
                $scope.objs = $scope.objs.filter(function (item){
                    return (item.key&&item.value);
                });
                $scope.objs.forEach(function (item, index) {
                    var id = 'type' + index;
                    var type = $('#'+ id).text();
                    if(type == 'Number') {
                        obj.body[item.key] = Number(item.value);
                    }
                    if(type == 'Boolean') {
                        obj.body[item.key] = Boolean(item.value);
                    }
                    if(type == 'Array') {
                        obj.body[item.key] = JSON.parse(item.value);
                    }
                    if(type == 'String') {
                        obj.body[item.key] = item.value;
                    }
                    if(type == 'Object') {
                        obj.body[item.key] = JSON.parse(item.value);
                    }
                });
            }
            $scope.isShowIcon = true;
            $scope.trackObj = obj;
            Restful.save(obj, function (result) {
                $scope.isShowIcon = false;
                var body = '';
                if (result.res[6]) {
                    body = result.res[6].Body;
                }
                if ((typeof body)=='string') {
                    console.log('&&&&');
                    $scope.bodyValue = body;
                    $scope.copyValueBody = angular.copy($scope.bodyValue);
                } else if((typeof body) == 'object') {
                    console.log('****');
                    $scope.bodyValue = angular.toJson(body, true);
                    $scope.copyValueBody = angular.copy($scope.bodyValue);
                    if (angular.isArray(body)) {
                        $scope.bodyLength = body.length;
                    }
                } else {
                    $scope.bodyValue = body;
                }
                result.req[13]['Cookies'] = angular.toJson(result.req[13]['Cookies'], true);
                $scope.req = result.req;
                $scope.res = result.res;

            }, function (err) {
                $scope.isShowIcon = false;
                console.log('get-er:\n', err);
            })
        }
    };
    $scope.showAllRes = function() {
        $scope.showBody = true;
    };
    function requestFullScreen(element) {

        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) {
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    $scope.chooseType = function(index, type) {
        console.log("index:\n", index);
        console.log("type:\n", type);
        var id = 'type' + index;
        console.log("id:\n", id);
        //document.getElementById(id).innerText = type;
        $('#'+ id).text(type);
    };
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.bodyValue;
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.storageType = 'Local storage';
    if (localStorageService.getStorageType().indexOf('session') >= 0) {
        $scope.storageType = 'Session storage'
    }
    if (!localStorageService.isSupported) {
        $scope.storageType = 'Cookie';
    }
    $scope.localMethod = {
        method:''
    };
    $scope.$watch('localMethod.method', function(value){
        if($scope.localMethod.method) {
            var obj = {
                method:$scope.localMethod.method
            }
            localStorageService.set('localStorageMethod',obj);
            $scope.initLocal();
        }
        console.log("local:\n", localStorageService.get('localStorageMethod'));
    });
    $scope.localBodyProfile = {
        isShow:''
    };
    $scope.$watch('localBodyProfile.isShow', function(value){
        if($scope.localBodyProfile.isShow) {
            var obj = {
                isShow:$scope.localBodyProfile.isShow
            };
            console.log("obj:\n", obj);
            localStorageService.set('localStorageBodyProfile',obj);
            $scope.initLocal();
        }
    });
    $scope.copyValueBody = '';
    $scope.flagForFormate = false;
    $scope.formate = function () {
        $scope.flagForFormate = !$scope.flagForFormate;
        if ($scope.flagForFormate) {
            $scope.bodyValue = format($scope.bodyValue, false);
            var parse = JSON.parse($scope.copyValueBody);
            if (angular.isArray(parse)) {
                $scope.bodyLength = '-数组长度为：' + parse.length;
                $timeout(function () {
                    $scope.bodyLength = '';
                }, 10000);
                console.log('leng:\n', $scope.bodyLength);
            }
            $timeout(function () {
                $scope.codeClass = 'json';
                $('pre span').each(function(i, e) {hljs.highlightBlock(e)}); 
            }, 1000);
        } else {
            $scope.bodyValue = $scope.copyValueBody;
        }
    }
    function format(txt,compress/*是否为压缩模式*/){/* 格式化JSON源码(对象转换为JSON文本) */
        var indentChar = '    ';
        if(/^\s*$/.test(txt)){
            alert('数据为空,无法格式化! ');
            return;
        }
        try{var data=eval('('+txt+')');}
        catch(e){
            alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');
            return;
        };
        var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;

        var notify=function(name,value,isLast,indent/*缩进*/,formObj){
            nodeCount++;/*节点计数*/
            for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */
            tab=compress?'':tab;/*压缩模式忽略缩进*/
            maxDepth=++indent;/*缩进递增并记录*/
            if(value&&value.constructor==Array){/*处理数组*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
                for (var i=0;i<value.length;i++)
                    notify(i,value[i],i==value.length-1,indent,false);
                draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
            }else   if(value&&typeof value=='object'){/*处理对象*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
                var len=0,i=0;
                for(var key in value)len++;
                for(var key in value)notify(key,value[key],++i==len,indent,true);
                draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
            }else{
                if(typeof value=='string')value='"'+value+'"';
                draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
            };
        };
        var isLast=true,indent=0;
        notify('',data,isLast,indent,false);
        return draw.join('');
    }
    $scope.hl = function (type) {
        console.log('ok:\n', "ok");
        switch (type) {
            case 'json': $scope.codeClass = 'json';break;
            case 'js': $scope.codeClass = 'javascript';break;
            case 'html': $scope.codeClass = 'html';break;
            case 'css': $scope.codeClass = 'css';break;
            default :$scope.codeClass = '';break;
        }
        $('pre span').each(function(i, e) {hljs.highlightBlock(e)});
    }
};
var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.modalBody = items;
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};