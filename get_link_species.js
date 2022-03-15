const handle = require('./handle');
const fs = require('fs');

(async() => {
    let fileNames = [] 

    fs.readdirSync('./data/dom/').forEach(file =>{
        fileNames.push('./data/dom/'+file);
    });
    for (fname of fileNames) {
        let $ =  await handle.loadDom(fname);
        let species = []

        $('div.clearfix > div.img > div.desc > a > i').each((index, element) => {
            speciesText = $(element).text().replace(/ /g, '').toLowerCase().split('\n');
            // speciesText = speciesText.join('-')
            // species.push(speciesText);
        });
        // for (s of species) {
        //     if (s.split('-').length <= 2) {
        //         fs.appendFileSync('./species.txt', 'https://www.first-nature.com/fungi/'+s+'.php'+'\n');
        //     }
        // }
        // fs.appendFileSync('./species.txt', newSpe.join('\n'));
    }
})()

// https://www.first-nature.com/fungi/agaricus-augustus.php
// body > div.container > div.clearfix > div.img > div.desc > a > i
// body > div.container > div.clearfix > div:nth-child(2) > div > a > i


