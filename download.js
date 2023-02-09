const fs = require('fs');
const request = require('request');
const commandLineArgs = require('command-line-args');
const path = require("path");

// file is included here:
function include(f) {
    let js = fs.readFileSync(f).toString()
    eval.apply(global, [js]);
}

include('./jsSHA/src/sha.js');
include('./apiAuth.js');

let API_URL = "https://api.voistock.com/voice/voiceDownload.php"
let uid = ""
function download(id, filename) {
    let skey = createSkey()
    let scode = createScode(skey)
    const options = {
        method: 'POST',
        url: API_URL,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            uid: uid,
            vid: id,
            scode: scode,
            skey: skey
        }
    };
    const file = fs.createWriteStream(filename);

    request(options)
        .pipe(file)
        .on('close', function () {
            file.close();
            console.log('File saved.', filename);
        });
}


const optionDefinitions = [
    {
        name: 'id-txt',
        type: String
    },
    {
        name: 'data-json',
        type: String,
    },
    {
        name: 'out-dir',
        type: String,
    },
    {
        name: 'uid',
        type: String,
        }
];
const options = commandLineArgs(optionDefinitions);

let id_txt = options['id-txt'];
let data_json = options['data-json'];
let output_dir = options['out-dir'];
let _uid = options['uid'];
uid = _uid;

if (id_txt && data_json) {
    let id_list = fs.readFileSync(id_txt, 'utf8')
        .split(/\s/)
        .filter((item) => item.length > 0);
    let data_map = JSON.parse(fs.readFileSync(data_json, 'utf8'))
        .reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {})

    fs.mkdirSync(output_dir, {recursive: true});

    for (let id of id_list) {
        // console.log(id)
        let data = data_map[id];
        let filename = path.join(output_dir, `${data['characternames']}_${data['voiceText']}_${id}.mp3`);
        if (fs.existsSync(filename)) {
            console.log("File exists. Skip", filename)
        } else {
            console.log("Download:  ", id, filename)
            download(id, filename)
        }
    }
} else {
    console.log("Please provide id-txt and data-json")
}
