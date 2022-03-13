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
        filePaths.push('./data/Dom/'+file);
        speciesNames.push(file.substring(0, file.length-5));
    });
    for (i in filePaths) {
        let $ = hd.loadDom(filePaths[i]);
        $('div.clearfix > div.img > div.desc > a > i').each((index, element) => {
            speciesText = $(element).text().replace(/ /g, '').toLowerCase().split('\n');
            
        });
        break;
    }
})()
// let data = {'hic': {}}
// data['hic']['as'] = '1';
// console.log(data);