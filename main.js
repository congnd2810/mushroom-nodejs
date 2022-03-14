const hd = require('./handle');
const fs = require('fs');

// (async() => {
//     speciesNames = fs.readFileSync('./speciesName.txt').toString().split('\r\n');
//     console.log(speciesNames);
//     for (sname of speciesNames) {
//         sUrl = `https://www.first-nature.com/fungi/${sname}.php`;
//         await hd.fetchDom(sUrl, sname, 3);
//         console.log(sUrl);
//     }
// })()
(async () => {
    let filePaths = [] 
    let speciesNames = []
    fs.readdirSync('./data/speciesDom/').forEach(file =>{
        filePaths.push('./data/speciesDom/'+file);
        speciesNames.push(file.substring(0, file.length-5));
    });
    for (i in filePaths) {
        let $ = await hd.loadDom(filePaths[i]);
        scientific = $('h1').first().text();
        scientific_name = scientific.split(' ').splice(0, 2).join(' ');
        common_name = scientific.split('-')[1].trim();
        console.log(scientific_name);
        // $('h1').each((index, element) => {
        //     // speciesText = $(element).text().replace(/ /g, '').toLowerCase().split('\n');
        //     sciname = console.log($(element).text())
        // });
        break;
    }
})()
