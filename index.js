var characternames = [];
var contentsName = [];
var id = [];
var voiceText = [];

// 单次请求获取的数据量，10 25 50 100
var page_size = 100;

let searchContent = "";
let searchDataResult = [];

// 弹窗定时器
let interval_alert_div = null;

window.onload = function () {
    init_alert_div();
}

// 判断str是否有所有的searchStrings子串 返回bool
function includesAll(str, searchStrings) {
    return searchStrings.every(function (searchString) {
        return str.includes(searchString);
    });
}

// 生成弹窗div
function init_alert_div() {
    var body = document.getElementsByTagName("body")[0];
    var alert_div = document.createElement("div");
    var alert_content_span = document.createElement("span");

    alert_div.id = "alert_div";
    alert_div.style.zIndex = "66666";
    alert_div.style.top = "1%";
    alert_div.style.left = "30%";
    alert_div.style.width = "500px";
    alert_div.style.height = "50px";
    alert_div.style.padding = "5px";
    alert_div.style.position = "fixed"
    alert_div.style.background = "#4a4a4aaa";
    alert_div.style.display = "none";
    alert_content_span.id = "alert_content_span";
    alert_content_span.style.width = "280px";
    alert_content_span.style.fontSize = "16px";
    alert_content_span.style.color = "white";
    alert_content_span.style.backgroundColor = "#4a4a4a00";
    alert_content_span.innerText = "";

    alert_div.appendChild(alert_content_span);
    body.appendChild(alert_div);
}

// 显示弹出框 传入显示的内容content
function show_alert(content, auto_hide = true) {
    // 清除旧的定时
    clearTimeout(interval_alert_div);

    var alert_div = document.getElementById("alert_div");
    var alert_content_span = document.getElementById("alert_content_span");
    alert_content_span.innerText = content;
    alert_div.style.display = "block";

    // console.log(auto_hide);
    if (auto_hide) {
        console.log("自动隐藏")
        // 5s后自动隐藏弹窗div
        interval_alert_div = setTimeout(() => {
            alert_div.style.display = "none";
        }, 5000);
    }
}

function clear_alert() {
    var alert_div = document.getElementById("alert_div");
    alert_div.style.display = "none";
}

function isNumber(str) {
    return /^\d+$/.test(str);
}

// 匹配数字-数字格式
function isValidFormat(str) {
    // 匹配数字-数字格式，其中数字部分使用括号捕获
    const regex = /^(\d+)-(\d+)$/;
    const match = str.match(regex);
    if (!match) {
        return null; // 不符合格式要求，返回 null
    }
  
    // 将捕获的数字转为整数并比较大小
    const num1 = parseInt(match[1]);
    const num2 = parseInt(match[2]);
    if (isNaN(num1) || isNaN(num2) || num1 > num2) {
        return null; // 前面的数字大于后面的数字，或者存在非数字字符，返回 null
    }
  
    return [num1, num2]; // 符合格式要求且前面的数字小于后面的数字
}

async function get_all_base_info() {
    // 获取下待搜索的关键词
    let content = document.getElementById("content_input").value;
    searchContent = content;

    // 检索页面范围
    let page_scope = document.getElementById("page_scope").value;
    let start_page = 1;
    let end_page = 2;

    let ret_nums = isValidFormat(page_scope);
    if(ret_nums) {
        start_page = ret_nums[0];
        end_page = ret_nums[1];
    } else {
        console.log("页数范围格式非 数字-数字，使用默认配置");
    }

    // 获取请求间隔时间
    let request_interval = document.getElementById("request_interval_input").value;
    if (isNumber(request_interval)) {
        request_interval = parseInt(request_interval);
    } else {
        console.log("给ye填数字啊，kora");
        show_alert("给ye填数字啊，kora");
        request_interval = 5000;
    }
    console.log("搜索内容:" + content + " | 请求间隔时间:" + request_interval.toString() + "毫秒");
    show_alert("开始请求接口获取数据喵~");

    // 初始传参
    let page = start_page;
    let start = (page - 1) * page_size;
    let voice_num = Number.MAX_VALUE;
    let result = [];

    let get_base_info_then = async function (page, start) {
        console.log(voice_num);
        let message = `请求第${page}页，起始坐标${start}。`
        if (start > 0) message += `音频总数=${voice_num}`

        console.log(message);
        show_alert(message, false);

        const [data, _voice_num, str] = await get_base_info(content, page, start);
        voice_num = _voice_num
        result.push(...data);
        // 追加入文本框
        document.getElementById("textarea1").value += str;
        clear_alert();
    }
    try {
        // let promise_list = [];

        var loop_num = 0;
        // 用户设定的页面范围溢出
        if((voice_num / page_size) < end_page) {
            loop_num = (voice_num / page_size) - start_page - 1;
        } else {
            loop_num = end_page - start_page;
        }

        for (let i = 0; i <= loop_num; i++) {
            // promise_list.push(get_base_info_then(page, start));
            await get_base_info_then(page, start);
            page += 1;
            start += page_size;
        }
        // let result_list = await Promise.all(promise_list)

        searchDataResult = result;
        show_alert("请求完成。");
    } catch (e) {
        console.log("发生异常:", e);
        show_alert('发生异常', e);
    }
}

// 获取关键词的搜索结果
async function get_base_info(content, page, start) {
    return new Promise((resolve, reject) => {
        // 构建url
        var url = "https://www.voistock.com/ja/voicelist/vlist-ajax.php";

        var data = {
            "draw": page, "columns": [{
                "data": "datalist", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "playbtn", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "voiceText", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "characternames", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "titleName", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "contentsName", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "voiceactnames", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "playCount", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "voiceEmotions", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "voiceTags", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "voiceLanguage", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "userNickname", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "submitDate", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "download", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "favorite", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }, {
                "data": "playlist", "name": "", "searchable": true, "orderable": true,
                "search": {"value": "", "regex": false}
            }], "order": [{"column": 12, "dir": "desc"}], "start": start, "length": page_size,
            "search": {"value": content, "regex": false}, "myId": "635b36253e4186037b165562", "lang": "ja",
            "searchword": content
        };

        var json = JSON.stringify(data)

        // 建立所需的对象
        var httpRequest = new XMLHttpRequest();
        // 打开连接  将请求参数写在url中
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // 发送请求  将请求参数写在URL中
        httpRequest.send(json);
        httpRequest.onerror = function (error) {
            console.log("请求get_base_info出错！" + error);
            show_alert("请求get_base_info出错！" + error);
        };
        httpRequest.ontimeout = function () {
            console.log("请求get_base_info超时！");
            show_alert("请求get_base_info超时！");
        };
        // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                // 获取到json字符串
                var ret = httpRequest.responseText;

                // 转为JSON对象
                var json = JSON.parse(ret);
                console.log(json);

                try {
                    if (json["data"].length <= 0) {
                        console.log(id);
                        console.log("无数据了");
                        show_alert("没有新数据了");
                        return;
                    }
                } catch (e) {
                    console.log("发生异常:" + e);
                    show_alert("发生异常:" + e);
                    return;
                }

                var searchStrings = ["<", ">"];

                var result = [];
                var str = "";
                for (var i = 0; i < json["data"].length; i++) {
                    if (includesAll(json["data"][i]["characternames"], searchStrings))
                        var temp1 = json["data"][i]["characternames"].split('>')[1].split('<')[0];
                    else
                        var temp1 = "-"
                    if (includesAll(json["data"][i]["contentsName"], searchStrings))
                        var temp2 = json["data"][i]["contentsName"].split('>')[1].split('<')[0];
                    else
                        var temp2 = "-"
                    var temp3 = json["data"][i]["id"];
                    if (includesAll(json["data"][i]["voiceText"], searchStrings))
                        var temp4 = json["data"][i]["voiceText"].split('>')[2].split('<')[0];
                    else
                        var temp4 = "-"

                    // 情感
                    let voiceEmotions = "-";
                    let voiceEmotionsRaw = json["data"][i]["voiceEmotions"]
                    if (includesAll(voiceEmotionsRaw, searchStrings)) {
                        voiceEmotions = voiceEmotionsRaw
                            .split("<br>")
                            .map(s => s.replace(/<.*?>/g, ''))
                            .filter(s => s.length > 0)
                            .join("、");
                    }

                    // 声优名
                    let voiceactnames = "-";
                    let voiceactnamesRaw = json["data"][i]["voiceactnames"]
                    if (includesAll(voiceactnamesRaw, searchStrings)) {
                        voiceactnames = voiceactnamesRaw
                            .replace(/<.*?>/g, '')
                            .trim()
                    }

                    // 语言
                    let voiceLanguage = json["data"][i]["voiceLanguage"]

                    // 作品标题
                    let titleName = "-"
                    let titleNameRaw = json["data"][i]["titleName"]
                    if (includesAll(titleNameRaw, searchStrings)) {
                        titleName = titleNameRaw
                            .replace(/<.*?>/g, '')
                            .trim()
                    }

                    characternames.push(temp1);
                    contentsName.push(temp2);
                    id.push(temp3);
                    voiceText.push(temp4);

                    var s = (start + i + 1) + "：内容：" + temp4 + " | 声优：" + voiceactnames + " | 源自：" + temp2;
                    // str
                    console.log(s);

                    str += s + "\n";
                    result.push({
                        id: temp3,
                        voiceText: temp4,
                        characternames: temp1,
                        contentsName: temp2,
                        voiceEmotions: voiceEmotions,
                        voiceactnames: voiceactnames,
                        voiceLanguage: voiceLanguage,
                        titleName: titleName
                    });
                }

                var voice_num = 0;
                var recordsTotal = 0;
                try {
                    voice_num = json["recordsFiltered"];
                } catch (e) {
                    show_alert('发生异常' + e);
                    reject(httpRequest, e);
                    return;
                }

                console.log("音频总数=" + voice_num.toString());
                // show_alert("音频总数=" + voice_num.toString());
                document.getElementById("voice_scale").innerText = (start + page_size) + '/' + voice_num;

                console.log(result);
                
                resolve([result, voice_num, str]);

            } else if (httpRequest.status !== 200) {
                console.log("请求get_base_info失败！", httpRequest);
                reject(httpRequest);
            }
        };
    });
}

// 加载导出的id文件
function load_id() {
    var file_id = document.getElementById("file_id");
    var reader = new FileReader();
    reader.readAsText(file_id.files[0]); // 发起异步请求
    reader.onload = function () {
        // 读取完成后，数据保存在对象的result属性中
        console.log(this.result);
        id = this.result.split(" ");
    }
}

// 导出id文件
function download_id() {
    let content = getSearchContent();
    var data = "";
    for (var i = 0; i < id.length; i++) {
        if (i != (id.length - 1)) data += id[i] + ' ';
        else data += id[i];
    }

    //将字符串 转换成 Blob 对象
    var blob = new Blob([data], {
        type: 'text/plain'
    });

    var fileName = `id_${content}.txt`; // fileName为文件名称，自己根据实际情况赋值
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

// 下载 解析完毕后的爬取到的数据
function download_base_info() {
    let content = getSearchContent();

    let data = JSON.stringify(searchDataResult)
    console.log(searchDataResult)
    // console.log(data)
    //将字符串 转换成 Blob 对象
    var blob = new Blob([data], {
        type: 'text/plain'
    });

    var fileName = `data_${content}.json`; // fileName为文件名称，自己根据实际情况赋值

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

function getSearchContent() {
    return document.getElementById("content_input").value;
}

// 下载喵 “下载音频文件”按键
function download2() {
    let time = document.getElementById("download_interval_input").value;
    let content = getSearchContent();

    if (isNumber(time)) {
        time = parseInt(time);
    } else {
        time = 2000;
        console.log("给ye填数字啊，kora");
        show_alert("给ye填数字啊，kora");
    }

    for (let i = 0; i < id.length; i++) {
        setTimeout(() => {
            mp3play(id[i], content + "_" + id[i])
        }, time * i);
    }
}

// 获取文件喵
function mp3play(temp_id, filename) {
    // 调用官方加密库生成传参
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
    httpRequest.onerror = function (error) {
        console.log("请求get_base_info出错！" + error);
        show_alert("请求get_base_info出错！" + error);
    };
    httpRequest.ontimeout = function () {
        console.log("请求get_base_info超时！");
        show_alert("请求get_base_info超时！");
    };
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var blob = this.response;
            if (blob.type == "text/html") {
                console.log("出错了 blob.type == text/html");
                show_alert("出错了 blob.type == text/html");
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

// ======================== 以下函数未使用 ========================

// 手动下载，导入后可以控制 id数组 和 index下标 还有 每个打开的延时ms
function download2_manual(id, index, time) {
    for (let i = index; i < id.length; i++) {
        setTimeout(() => {
            mp3play(id[i], i)
        }, time * i);
    }
}

// 下载音频文件
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
    httpRequest.onerror = function (error) {
        console.log("请求get_base_info出错！" + error);
        show_alert("请求get_base_info出错！" + error);
    };
    httpRequest.ontimeout = function () {
        console.log("请求get_base_info超时！");
        show_alert("请求get_base_info超时！");
    };
    // 获取数据后的处理程序
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var blob = this.response;
            if (blob.type == "text/html") {
                console.log("出错了 blob.type == text/html");
                show_alert("出错了 blob.type == text/html");
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
