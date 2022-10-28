var characternames = [];
var contentsName = [];
var id = [];
var voiceText = [];

let page = 1;
let start = 0;

function first_get_base_info() {
    page = 1;
    start = 0;

    let content = document.getElementById("content_input").value;

    var url = "https://www.voistock.com/ja/voicelist/vlist-ajax.php";
    var data = {"draw":page,"columns":[{"data":"datalist","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"playbtn","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"voiceText","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"characternames","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"titleName","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"contentsName","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"voiceactnames","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"playCount","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"voiceEmotions","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"voiceTags","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"voiceLanguage","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"userNickname","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"submitDate","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"download","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"favorite","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}},{"data":"playlist","name":"","searchable":true,"orderable":true,
        "search":{"value":"","regex":false}}],"order":[{"column":12,"dir":"desc"}],"start":start,"length":25,
        "search":{"value":content,"regex":false},"myId":"635b36253e4186037b165562","lang":"ja",
        "searchword":content};

    var json = JSON.stringify(data)

    // 建立所需的对象
    var httpRequest = new XMLHttpRequest();
    // 打开连接  将请求参数写在url中 
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // 发送请求  将请求参数写在URL中
    httpRequest.send(json);
    httpRequest.onerror = function(error) { 
        console.log("请求get_base_info出错！" + error); 
    };
    httpRequest.ontimeout = function() { 
        console.log("请求get_base_info超时！"); 
    };
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            // 获取到json字符串
            var ret = httpRequest.responseText;
            //console.log(ret);
            // 转为JSON对象
            var json = JSON.parse(ret);
            console.log(json);

            try {
                if(json["data"].length <= 0) {
                    console.log("无数据了");
                    alert('无数据了');
                    return;
                }
            } catch (e) {
                console.log("发生异常:" + e);
                alert('发生异常' + e);
                return;
            }
            
            var str = "";
            for(var i = 0; i < json["data"].length; i++) {
                var temp1 = json["data"][i]["characternames"].split('>')[1].split('<')[0];
                var temp2 = json["data"][i]["contentsName"].split('>')[1].split('<')[0];
                var temp3 = json["data"][i]["id"];
                var temp4 = json["data"][i]["voiceText"].split('>')[2].split('<')[0];
                characternames.push(temp1);
                contentsName.push(temp2);
                id.push(temp3);
                voiceText.push(temp4);

                var str = str + "内容：" + temp4 + " | 角色：" + temp1 + " | 源自：" + temp2 + "\n";
            }

            document.getElementById("textarea1").value += str;

            var voice_num = 0;
            try {
                voice_num = json["recordsFiltered"]; 
            } catch (e) {
                alert('发生异常' + e);
                return;
            }

            console.log("voice_num=" + voice_num);
            
            for(let i = 0; i < voice_num/25; i++) {
                setTimeout(() => {
                    page += 1;
                    start += 25;
                    get_base_info(content, page, start);
                }, 5000 * i); // 延时改成5s感觉刚好，3s测过，正常跑完
            }
        }
    };
}

function get_base_info(content, page, start) {
    // 构建url
    var url = "https://www.voistock.com/ja/voicelist/vlist-ajax.php";

    var data = {"draw":page,"columns":[{"data":"datalist","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"playbtn","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"voiceText","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"characternames","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"titleName","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"contentsName","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"voiceactnames","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"playCount","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"voiceEmotions","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"voiceTags","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"voiceLanguage","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"userNickname","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"submitDate","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"download","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"favorite","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}},{"data":"playlist","name":"","searchable":true,"orderable":true,
    "search":{"value":"","regex":false}}],"order":[{"column":12,"dir":"desc"}],"start":start,"length":25,
    "search":{"value":content,"regex":false},"myId":"635b36253e4186037b165562","lang":"ja",
    "searchword":content};

    var json = JSON.stringify(data)

    // 建立所需的对象
    var httpRequest = new XMLHttpRequest();
    // 打开连接  将请求参数写在url中 
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // 发送请求  将请求参数写在URL中
    httpRequest.send(json);
    httpRequest.onerror = function(error) { 
        console.log("请求get_base_info出错！" + error); 
    };
    httpRequest.ontimeout = function() { 
        console.log("请求get_base_info超时！"); 
    };
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            // 获取到json字符串
            var ret = httpRequest.responseText;
            //console.log(ret);
            // 转为JSON对象
            var json = JSON.parse(ret);
            console.log(json);

            try {
                if(json["data"].length <= 0) {
                    console.log(id);
                    console.log("无数据了");
                    alert("没有新数据了");
                    return;
                }
            } catch (e) {
                console.log("发生异常:" + e);
                alert("发生异常:" + e);
                return;
            }
            
            var str = "";
            for(var i = 0; i < json["data"].length; i++) {
                var temp1 = json["data"][i]["characternames"].split('>')[1].split('<')[0];
                var temp2 = json["data"][i]["contentsName"].split('>')[1].split('<')[0];
                var temp3 = json["data"][i]["id"];
                var temp4 = json["data"][i]["voiceText"].split('>')[2].split('<')[0];
                characternames.push(temp1);
                contentsName.push(temp2);
                id.push(temp3);
                voiceText.push(temp4);

                var str = str + "内容：" + temp4 + " | 角色：" + temp1 + " | 源自：" + temp2 + "\n";
            }

            document.getElementById("textarea1").value += str;

            if(json["data"].length != 25) {
                console.log("数据获取完毕！");
                alert("数据获取完毕！");
                return;
            }
        }
    };
}

// 加载导出的id文件
function load_id() {
    var file_id = document.getElementById("file_id");
    var reader = new FileReader();
    reader.readAsText(file_id.files[0]); // 发起异步请求
    reader.onload = function() {
        // 读取完成后，数据保存在对象的result属性中
        console.log(this.result);
        id = this.result.split(" ");
    }
}

// 导出id文件
function download_id() {
    var data = "";
    for(var i = 0; i < id.length; i++) {
        if(i != (id.length - 1)) data += id[i] + ' ';
        else data += id[i];
    }

    //将字符串 转换成 Blob 对象
    var blob = new Blob([data], {
        type: 'text/plain'
    });

    var fileName = "id.txt"; // fileName为文件名称，自己根据实际情况赋值
    if (window.navigator.msSaveOrOpenBlob) { // IE浏览器下
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
}

function download_base_info() {
    var data = document.getElementById("textarea1").value;
    //将字符串 转换成 Blob 对象
    var blob = new Blob([data], {
        type: 'text/plain'
    });

    var fileName = "data.txt"; // fileName为文件名称，自己根据实际情况赋值
    if (window.navigator.msSaveOrOpenBlob) { // IE浏览器下
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
}

function download2() {
    for(let i = 0; i < id.length; i++) {
        setTimeout(() => {
            mp3play(id[i], i)
        }, 2000 * i); // 每两秒一次下载请求
    }
}

// 手动下载，导入后可以控制id数组和index下标
function download2_manual(id, index) {
    for(let i = index; i < id.length; i++) {
        setTimeout(() => {
            mp3play(id[i], i)
        }, 2000 * i);
    }
}

function mp3play(temp_id, filename) {
    var skey = createSkey()
    var scode = createScode(skey)
    url = "https://voice.voistock.com/mp3play.php?id=" + temp_id + "&skey=" + skey + "&scode=" + scode + 
        "&uid=" + "" + "&from=website"

    // 建立所需的对象
    var httpRequest = new XMLHttpRequest();
    // 打开连接  将请求参数写在url中 
    httpRequest.open('GET', url, true);
    httpRequest.setRequestHeader('Content-type', 'audio/mpeg');
    httpRequest.setRequestHeader('Accept', '*/*');
    httpRequest.responseType = "blob";
    // 发送请求  将请求参数写在URL中
    httpRequest.send();
    httpRequest.onerror = function(error) { 
        console.log("请求get_base_info出错！" + error); 
    };
    httpRequest.ontimeout = function() { 
        console.log("请求get_base_info超时！"); 
    };
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var blob = this.response;
            if (blob.type == "text/html") {
                console.log("出错了");
                return false;  
            }
            var fileName = filename; // fileName为文件名称，自己根据实际情况赋值
            if (window.navigator.msSaveOrOpenBlob) { // IE浏览器下
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }

        }
    };
}

function voiceDownload(vid) {
    uid = ""
    url = "https://api.voistock.com/voice/voiceDownload.php"
    var skey = createSkey()
    var scode = createScode(skey)

    var data = "uid=" + uid + "&vid=62b968063e4186274c1b45c4&scode=" + scode + "&skey=" + skey;

    // 建立所需的对象
    var httpRequest = new XMLHttpRequest();
    // 打开连接  将请求参数写在url中 
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.setRequestHeader('Accept', 'application/json');
    httpRequest.responseType = "arraybuffer";
    // 发送请求  将请求参数写在URL中
    httpRequest.send(data);
    httpRequest.onerror = function(error) { 
        console.log("请求get_base_info出错！" + error); 
    };
    httpRequest.ontimeout = function() { 
        console.log("请求get_base_info超时！"); 
    };
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var blob = this.response;
            if (blob.type == "text/html") {
                console.log("出错了");
                return false;  
            }
            var fileName = fileName; // fileName为文件名称，自己根据实际情况赋值
            if (window.navigator.msSaveOrOpenBlob) { // IE浏览器下
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }

        }
    };
}
