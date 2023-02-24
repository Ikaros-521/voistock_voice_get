const fs = require('fs');
exports.parse_id_txt = (id_txt) => {
    return fs.readFileSync(id_txt, 'utf8')
        .split(/\s/)
        .filter((item) => item.length > 0);
}

exports.parse_data_json = (data_json) => {
    return JSON.parse(fs.readFileSync(data_json, 'utf8'))
}
