(function() {
    var doc = document;
    var win = window;
    var u = win.navigator.userAgent;
    var clientType = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    console.log(clientType);
    var JsBridge = win.JsBridge || (win.JsBridge = {});
    var ExposeMethod = {
        callMethod: function (method, jsonData) {         
            try{
                if(clientType) {
                    console.log('安卓测试联享家~~')
                    contact.webJsMethod(method,JSON.stringify(jsonData));
                    return true;
                } else {    
                    console.log('iOS测试联享家~~')      
                    PrivateEven.callNativeMethod('webJsMethod', {
                        command: method,
                        jsonData: JSON.stringify(jsonData)
                    }); 
                    return true;
                }
            }catch(e){
               console.log('非客户端环境');
               return false;
            }
            
        },
    };
    var PrivateEven = {
        callNativeMethod: function (methodName, parameters, callback) {
            var message = {
                'methodName': methodName,
                'parameters': parameters,
                'callback': callback
            }
            var jsonString = JSON.stringify(message);
            var callback = prompt(jsonString);
            return callback;
        },
    }

    
    for (var index in ExposeMethod) {
        if (ExposeMethod.hasOwnProperty(index)) {
            if (!Object.prototype.hasOwnProperty.call(JsBridge, index)) {
                JsBridge[index] = ExposeMethod[index];
            }
        }
    }
})()
