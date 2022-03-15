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
    let data = []
    fs.readdirSync('./data/speciesDom/').forEach(file => {
        filePaths.push('./data/speciesDom/' + file);
        speciesNames.push(file.substring(0, file.length - 5));
    });

    for (let file of filePaths) {
        // load html dom
        let $ = await hd.loadDom(file);//disciotis-venosa
        // mushroom obj
        let mushroomObj = {'Scientific classification': {}, 'Identification': {}}

        // get attributes of obj from html dom:
        //-> common name and scientific name
        let scientific = $('h1').first().text();
        let classifyName = $('h1 ~').first().text();
        let scientific_name = scientific.split(' ').splice(0, 2).join(' ');
        let genus = scientific_name.split(' ')[0]
        let common_name = scientific.split('-')[1]?.trim();
        mushroomObj['Scientific classification']['Genus'] = genus;

        for (let i of classifyName.split('-')) {
            i = i.trim().split(':');
            mushroomObj['Scientific classification'][i[0]] = i[1]?.trim();
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
                if (tagAttr[i].name == 'h3') {
                    let header = tagAttr[i].children[0].data;
                    let pData = []
                    for(let temp = i+1; temp < tagAttr.length; temp++) {
                        if (headerTags.includes(tagAttr[temp].name)) break;
                        if ($(tagAttr[temp]).text() == '') continue;
                        pData.push($(tagAttr[temp]).text());

                    }
                    mushroomObj[header] = pData;
                    continue;
                }

                // get to reference sources
                if (tagAttr[i].children[1]?.data?.trim() == 'Reference Sources') break;
                // handle table tag
                if (tagAttr[i].children[1]?.data == 'Identification guide') {
                    let tableSelector = $('table > tbody > tr');
                    for (let j = 0; j < tableSelector.length; j++) {
                        let h3Tag = $(tableSelector[j]).find('h3');
                        if (h3Tag.length == 1) {
                            mushroomObj[h3Tag.text()] = $(tableSelector[j]).find('p').text().split('\n').join(' ')
                                .replace(/ +(?= )/g, '');}
                        else {
                            for (let k = 0; k < h3Tag.length; k++) {
                                let h3Name = $(h3Tag[k]).text().trim();
                                let h3Data = $(h3Tag[k]).find('~').first().text().trim();
                                mushroomObj[h3Name] = h3Data;
                            }
                        }
                    }
                } else {
                    //loop to get all p tag between 2 h tag
                    let pData = []
                    let header = tagAttr[i].children[1]?.data
                    for(let j = i+1; j < tagAttr.length; j++) {
                        if (headerTags.includes(tagAttr[j].name)) break;
                        if ($(tagAttr[j]).text() == '') continue;
                        pData.push($(tagAttr[j]).text());

                    }
                    mushroomObj[header] = pData;
                }
            }
        }

        data.push(mushroomObj);
        fs.writeFileSync('./data/json/data.json', JSON.stringify(data, null, 4), {encoding: 'utf-8'});
        console.log("pass", file);
    }
})()


