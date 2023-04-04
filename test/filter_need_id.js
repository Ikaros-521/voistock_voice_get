const fs = require('fs');
const path = require("path");
const utils = require("../tool/utils");
id_txt_file = path.join(path.dirname(__filename), "../id_佐倉杏子.txt")
data_json_file = path.join(path.dirname(__filename), "../data_佐倉杏子.json")

// id_txt = utils.parse_id_txt(id_txt_file)
data_json = utils.parse_data_json(data_json_file)


res = data_json
    .filter((item) => item['voiceactnames'] === '野中藍')
    .map((item) => item['id'])
    .join(" ")

// console.log(res)
// console.log(res.length)

fs.writeFile(id_txt_file, res, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
