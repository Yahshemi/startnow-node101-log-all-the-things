const express = require('express');
const fs = require('fs');
const app = express();
app.use((req, res, next) => {
    // write your logging code here

    let agent = req.headers['user-agent'].replace(/,/, '');
    let time = new Date().toISOString();
    let method = req.method;
    let resource = req.path;
    let version = `HTTP/${req.httpVersion}`;
    let status = 200;

    let data = agent + ',' + time + ',' + method + ',' + resource + ',' + version + ',' + status + '\n';
    console.log(data)
    // Write data to the log.csv file
    fs.appendFile('./log.csv', data, 'utf8',
        // callback function
        function (err) {
            if (err) throw err;
            // if no error

      next();
})

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    
    res.send('Ok');
});


app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('./log.csv', 'utf8', function (err, data) {
        var obj = '[';
        var lines = data.split('\n');
        var items = undefined;
        for (var i = 1; i < lines.length; i++) {
            if (lines[i].length > 2) {
                items = lines[i].split(',');
                obj += '{' +
                    '"Agent":"' + items[0] + '",' +
                    '"Time":"' + items[1] + '",' +
                    '"Method":"' + items[2] + '",' +
                    '"Resource":"' + items[3] + '",' +
                    '"Version":"' + items[4] + '",' +
                    '"Status":"' + items[5] + '"' +
                    '}';
                if (i < lines.length - 2) {
                    obj += ',';
                }
            }

        }
        obj += ']';
        res.json(JSON.parse(obj));
    });
});
});
module.exports = app;
