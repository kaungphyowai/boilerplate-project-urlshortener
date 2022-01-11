require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const { arch } = require('os');
// Basic Configuration
const port = process.env.PORT || 3000;

let list = [];

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

//Get Url for Short Url
app.get('/api/shorturl/:id', (req, res) => {
  let id = req.params.id;
  //check if the id is valid
  let isNumber = Number.isInteger(id);
  let isWithinRange = id <= list.length;
  if(isNumber !== NaN && isWithinRange){
    let orignalUrl = list[id - 1]['original_url'];
    res.redirect(orignalUrl);
  }else{
    res.json({"error" : "not valid shorturl"})
  }
})



//Post Url
app.post('/api/shorturl', (req, res) => {
  let newUrl = req.body.url;
  console.log(newUrl)

  //just get the aa record
  let aRecord = newUrl.replace(/.+?:\/\/(.+)/, "$1");
  console.log(aRecord)

  //validate the new link
  let acceptedFormat = /http/.test(newUrl)
  console.log(acceptedFormat)
  if(acceptedFormat){

    dns.lookup(aRecord, (err, addr, fam) => {
      // console.log(err)
        // if(addr){
          let newShortObj = { original_url : newUrl, short_url : list.length + 1}
          list.push(newShortObj)
          res.json(newShortObj)
        // }else{
        //   res.json({"error": "Invalid Hostname"});
        // }
      }
      )
  }else{
    res.json({ error: 'invalid url' })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
