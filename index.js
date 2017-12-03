const fs = require('fs');
const request = require('request');
const path = require('path');
const cheerio = require('cheerio');

const url_noida = 'https://www.worldcubeassociation.org/competitions?utf8=%E2%9C%93&region=India&search=noida&state=present&year=all+years&from_date=&to_date=&delegate=&display=list';
const url_delhi = 'https://www.worldcubeassociation.org/competitions?utf8=%E2%9C%93&region=India&search=delhi&state=present&year=all+years&from_date=&to_date=&delegate=&display=list';


request(url_noida, (err, res, body) => {
  var $ = cheerio.load(body);
  var comps = '';

  $('li.not-past', 'div#upcoming-comps').each(function(){
    comps += $(this).html();
  })

  var last = fs.readFileSync('./comps.html', 'utf8')


  if(last === comps){
    console.log('It\'s the same thing after all. It\'s the same thing after all it the dame thing aaaaaaaaaaafter it the same damn thing!');
  }else{
    fs.writeFile('./comps.html', comps, err => {if(err){console.log(err)}})
  }

})
