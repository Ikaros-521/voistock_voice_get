# 前言

纯前端开发，用于便捷下载 https://www.voistock.com/ja/voicelist/index.php 的免费语音文件。
运行index.html，用法应该一目了然了，可以看看源码，以上。

## 导出 data 文件格式

```json5
[
    {
        "id": "608f22a63e4186709c13f432",
        // 语音id 
        "voiceText": "It&#39;s not fair, is",
        // 语音文本
        "characternames": "美樹さやか",
        // 语音角色
        "contentsName": "まどか☆マギカ",
        // 作品标题
        "voiceEmotions": "クール、真剣、悲しみ、心配、安心、平穏、ほのぼの",
        // 语音情感
        "voiceactnames": "Sarah Williams",
        // 声优名
        "voiceLanguage": "jp",
        // 语音语言
        "titleName": "劇場版 魔法少女まどか☆マギカ 始まりの物語"
        // 作品标题
    },
    // .....
]
```
