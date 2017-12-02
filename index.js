const fs = require('fs');
const request = require('request');
const path = require('path');
const cheerio = require('cheerio');

const url_noida = 'https://www.worldcubeassociation.org/competitions?region=India&search=Nodia&state=present&year=all+years&display=list';
const url_delhi = 'https://www.worldcubeassociation.org/competitions?region=India&search=Delhi&state=present&year=all+years&display=list';


request(url_noida, (err, res, body) => {
  fs.WriteStream('./comps.html').write(body)
  console.log('Were done!');
})
