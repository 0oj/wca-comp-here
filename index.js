const fs = require('fs');
const request = require('request');
const path = require('path');
const cheerio = require('cheerio');
const notifier = require('node-notifier');
const open = require('open');

const url_noida = 'https://www.worldcubeassociation.org/competitions?utf8=%E2%9C%93&region=India&search=noida&state=present&year=all+years&from_date=&to_date=&delegate=&display=list';
const url_delhi = 'https://www.worldcubeassociation.org/competitions?utf8=%E2%9C%93&region=India&search=delhi&state=present&year=all+years&from_date=&to_date=&delegate=&display=list';
const url_india = 'https://www.worldcubeassociation.org/competitions?utf8=%E2%9C%93&region=India&search=&state=present&year=all+years&from_date=&to_date=&delegate=&display=list';

request(url_noida, (err, res, body) => {
  var $ = cheerio.load(body);
  var comp_html = '';
  var comp_array = [];


  $('li.not-past', 'div#upcoming-comps').each(function(){
    comp_html += $(this).html();
    comp_array.push($(this).html());
  })


  fs.readFile('./comps.html', 'utf8', (err, data) => {

    if(data != comp_html){
      var comps = comp_array.map(comp => {
        comp = cheerio.load(comp)
        return {
          name: comp('span.competition-info p.competition-link a').text(),
          date: comp('span.date').text().replace(/(\r\n|\n|\r|  )/gm,""),
          location: comp('span.competition-info p.location').text().replace(/(\r\n|\n|\r|  )/gm,""),
          venue: comp('span.competition-info div.venue-link p').text().replace(/(\r\n|\n|\r|  )/gm,""),
          link: 'https://www.worldcubeassociation.org' + comp('span.competition-info p.competition-link a').attr('href')
        }
      })

      comps.forEach(comp => {
        notifier.notify({
          title: comp.name,
          message: `${comp.date} \n ${comp.venue} \n ${comp.location}`,
          icon: path.join(__dirname, 'logo.jpg'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        }, (err, response) => { if(err){console.error(err)}});
        notifier.on('click', (notifierObject, options) => open(comp.link));
      })

      fs.writeFile('./comps.html', comp_html, err => {if(err){console.log(err)}})
    }
  })

})
