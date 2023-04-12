const express = require('express');
const fs = require('fs');
const cors = require('cors');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

const url = "https://lib.xidian.edu.cn/application/view/33996/data?sversion=247c9807823e67016e17fdeabd4ed136141&wfwfid=2403&websiteId=13313&pageId=14305";

const headers = {
  "accept": "*/*",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  "cookie": "id=191400724; UID=191400724; vc=b261080637b3b41aeb13b7ff93545f50; fanyamoocs=76CAED661758B1B101A2650E5D0A921A; _dd191400724=1656673422703; current_page_id=14305; website_id=13313; website_fid=2403; website_fid_login=1; mh_sign=44238865f43d8ff5b9deb9aaa33a29c6; lan=zh; goc=o; zh_choose=n",
  "referer": "https://lib.xidian.edu.cn/",
  "sec-ch-ua-platform": "Windows",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.66 Safari/537.36 Edg/103.0.1264.44",
  "x-requested-with": "XMLHttpRequest"
};

function getNumber() {
  return new Promise((resolve, reject) => {
    request({url, headers}, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const data = JSON.parse(body).data.div.replace(/\\/g, '');
        const $ = cheerio.load(data);
        const numList = $('.num');
        resolve(numList.first().text());
      }
    });
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 设置CORS响应头
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/append-to-file', (req, res) => {
    console.log(req.body)
    const base64Data = req.body.data;
    console.log(base64Data)
    const decodedData = Buffer.from(base64Data, 'base64').toString();
    const decodedURIData=decodeURIComponent(decodedData);
  fs.appendFile('data.txt', decodedURIData + '\n\n', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error appending to file');
    } else {
      console.log('Data appended to file');
      res.status(200).send('Data appended to file');
    }
  });
});

app.get('/getnumber', async (req, res) => {
  try {
    const number = await getNumber();
    res.send(number);
  } catch (error) {
    res.send('null');
  }
});

app.listen(3000, "0.0.0.0",() => {
  console.log('Server running on port 3000');
});
