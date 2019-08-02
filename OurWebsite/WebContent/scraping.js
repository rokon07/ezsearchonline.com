const request = require('request');
const fetch= require('node-fetch');
const cheerio= require('cheerio');
const fs= require('fs');

const url='https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1312.R2.TR10.TRC2.A0.H0.TRS2&_nkw=samsung+s10&_sacat=0&LH_TitleDesc=0&_osacat=0&_odkw=sam';

const urlList = [];
const itemDetail = [];
var file=fs.createWriteStream('output.txt');

//gets the html of the page
const result=fetch(`${url}`).then(response => response.text());
    //parse the html
    result.then(body => {
        //cheerio.load takes the html
        const $= cheerio.load(body);
        //iterates the whole html and looks for specified tags to extract data
        const items=$('#srp-river-main').children().eq(1).children().eq(0).children('.s-item'); //get the list of search result. NOTE: Ebay stores all the search resuslts in an unordered list in html

        /*for(var i=0; i<items.length;i++){
            urlList.push(items.children().eq(i).children().eq(1).children('.s-item__link').attr('href')); //gets the urls for all the results displayed in the search

        }*/

        for(var i=0; i<items.length;i++){
            const Plink=items.children().eq(i).children().eq(1).children('.s-item__link').attr('href'); //gets the urls for all the results displayed in the search
            var img= items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).children('.s-item__image-wrapper').children('.s-item__image-img').attr('data-src');
            if(img==undefined){
                img= items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).children('.s-item__image-wrapper').children('.s-item__image-img').attr('src');
            }
            var name=items.children().eq(i).children().eq(1).children('.s-item__link').children().eq(0).children('.BOLD').text();
            if(name==''){
                name=items.children().eq(i).children().eq(1).children('.s-item__link').children('.s-item__title').text();
            }

            const condition= items.children().eq(i).children().eq(1).children('.s-item__subtitle').children('.SECONDARY_INFO').text();
            var price= items.children().eq(i).children().eq(1).children().eq(3).children().eq(0).children('.s-item__price').text();
            if(price == ''){
                var price= items.children().eq(i).children().eq(1).children().eq(4).children().eq(0).children('.s-item__price').text();
                if(price==''){
                    var price= items.children().eq(i).children().eq(1).children().eq(5).children().eq(0).children('.s-item__price').text();
                }
            }
            file.write(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');
        }


        //console.log(urlList);

        //iterates through the list of urls
        /*for(var j=0; j<urlList.length;j++) {
            //gets the html for each url in the list
            const resultHTML = fetch(`${urlList[j]}`).then(response => response.text());
            resultHTML.then(b => {
                //load the html in cheerio. NOTE: b is the html
                const $ = cheerio.load(b);
                //const name = $('#CenterPanelInternal').children('#LeftSummaryPanel').children('.vi-swc-lsp').children('#vi-lkhdr-itmTitl').text();
                const name = $('#vi-lkhdr-itmTitl').text(); //extract the name of the item by looking at the specified tag in the html
                const img =$('#mainImgHldr').children('#icImg').attr('src'); //extract the image src of the item by looking at the specified tag in the html
                var temp = `Name: ${name}`; //formating the string
                var temp2=`image: ${img}`; //formating the string
                console.log(temp.concat(",").concat(temp2)); //concats both name and img src together
            });
        }*/

        //does the same thing, short version
        /*for(var i=0; i<items.length;i++){
            const resultHTML = fetch(`${items.children().eq(i).children().eq(1).children('.s-item__link').attr('href')}`).then(response => response.text());
            resultHTML.then(b => {
                const $ = cheerio.load(b);
                //const name = $('#CenterPanelInternal').children('#LeftSummaryPanel').children('.vi-swc-lsp').children('#vi-lkhdr-itmTitl').text();
                const name = $('#vi-lkhdr-itmTitl').text();
                const img =$('#mainImgHldr').children('#icImg').attr('src');
                var temp = `Name: ${name}`;
                var temp2=`image: ${img}`;
                console.log(temp.concat(",").concat(temp2));
        });

        }*/
});




