const hd = require('./handle');
const fs = require('fs');
const { table } = require('console');

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
    data = []
    fs.readdirSync('./data/speciesDom/').forEach(file => {
        filePaths.push('./data/speciesDom/' + file);
        speciesNames.push(file.substring(0, file.length - 5));
    });
    for (i in filePaths) {
        // load html dom
        let $ = await hd.loadDom('./data/speciesDom/agaricus-arvensis.html');

        // mushroom obj
        let mushroomObj = {'Scientific classification': {}, 'Identification': {}}

        // get attributes of obj from html dom:
        //-> common name and scientific name
        let scientific = $('h1').first().text();
        let classifiName = $('h1 ~').first().text();
        let scientific_name = scientific.split(' ').splice(0, 2).join(' ');
        let common_name = scientific.split('-')[1].trim();

        for (i of classifiName.split('-')) {
            i = i.trim().split((':'));
            mushroomObj['Scientific classification'][i[0]] = i[1].trim();
        }
        mushroomObj['Common name'] = common_name;
        mushroomObj['Scientific name'] = scientific_name;
           
        //-> distribution
        let distribution = $('h2 ~ p').first().text();
        mushroomObj['Distribution'] = distribution
        //-> test
        let tagAttr = $('h2 ~ ');
        let headerTags = ['h2', 'h3']

        //loop tags of the same level as h2 tag
        for (let i = 0; i < tagAttr.length; i++) {
            if (headerTags.includes(tagAttr[i].name)) {
                if (tagAttr[i].children[1].data == 'Reference Sources') break;
                // handle table tag
                if (tagAttr[i].children[1].data == 'Identification guide') {
                    tableSelector = $('table > tbody > tr');
                    listTitle = []
                    $('table h3').each((err, element) => {
                        listTitle.push($(element).text());
                    });
                    
                    console.log(listTitle);
                };
                // loop to get all p tag between 2 h tag
                // pData = []
                // header = tagAttr[i].children[1].data
                // for(let j = i+1; j < tagAttr.length; j++) {
                //     if (headerTags.includes(tagAttr[j].name)) break;
                //     if ($(tagAttr[j]).text() == '') continue;
                //     pData.push($(tagAttr[j]).text());
                
                // }
                // mushroomObj[header] = pData;
            }
        }
        // console.log(mushroomObj);
        for (let i = 0; i < tagAttr.length; i++) {
            // console.log(tagAttr[9].children[0].data);
            break;
        }
        break;
    }
})()
// div#id_div > p:first-of-type
// body > div.container > p:nth-child(14)