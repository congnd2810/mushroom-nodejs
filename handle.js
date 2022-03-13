const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');
const url = require('url');

function getFamilyNames (filePath) {
    result = fs.readFileSync(filePath).toString().split('\r\n');
    return result;
}

async function fetchDom(url, species, retries) {
    const config = {
        method: 'get',
        url: url
    }
    filename = `./data/check/${species}.html`;
    try {
        let res = await axios(config);
        if(!fs.existsSync('./data/check'))
            await fs.mkdirSync('./data/check', {recursive: true});
        await fs.writeFileSync(filename, res.data)
    } catch (err) {
        if (retries > 0) 
            await fetchDom(url, retries-1)
        else {
            await fs.appendFileSync('./data/error.txt', url + '\n');
        }
    }
}

async function loadDom(path) {
    try {
        dom = await fs.readFileSync(path, {encoding:'utf-8'});
        return cheerio.load(dom);
    } catch (err) {
        console.log(err);
    }
}

// (async () => {
//     let listFamily = getFamilyNames('./family.txt');
//     // for (family of listFamily) {
//     //     let fungiUrl = await `https://www.first-nature.com/fungi/~${family}.php`;
//     //     await fetchDom(fungiUrl, family, 3);
//     // }
//     const $ = await loadDom('./data/dom/agaricaceae.html');
//     console.log($('h2').text());
// })()

module.exports = {
    getFamilyNames: getFamilyNames,
    fetchDom: fetchDom,
    loadDom: loadDom
} 

