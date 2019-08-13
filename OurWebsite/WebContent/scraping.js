/*
window.scrape=function () {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    const Chromy = require('chromy');

    const showResult = require('./showResult');


    //const puppeteerWeb=require('./node_modules/puppeteer/utils/browser/puppeteer-web');


    var searchTitle = 'iphone x';
    searchTitle = searchTitle.replace(/ /gi, '+')
    console.log(searchTitle);
    //const url='https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.Xiphone+x+new.TRS1&_nkw=iphone+x+new&_sacat=0';
    const ebaySerachUrl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.' + searchTitle + '.TRS1&_nkw=' + searchTitle + '&_sacat=0';
    const aliExpressUrl = 'https://www.aliexpress.com/premium/iphone-new.html?ltype=premium&d=y&CatId=0&SearchText=iphone+new&trafficChannel=ppc&SortType=default&page=2&switch_new_app=y';

    //const urlList = [];
    //const itemDetail = [];
    //var file=fs.createWriteStream('output.txt');
    let ebaySearchResult = [];
    let aliExpressSearchResult = [];

//ebay(url);
    ebay(ebaySerachUrl);
    aliExpress(aliExpressUrl);

     function ebay(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $('#srp-river-main').children().eq(1).children().eq(0).children('.s-item');
            for (var i = 0; i < items.length; i++) {
                const Plink = items.children().eq(i).children().eq(1).children('.s-item__link').attr('href'); //gets the urls for all the results displayed in the search
                var img = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).children('.s-item__image-wrapper').children('.s-item__image-img').attr('data-src');
                if (img == undefined) {
                    img = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).children('.s-item__image-wrapper').children('.s-item__image-img').attr('src');
                }
                var name = items.children().eq(i).children().eq(1).children('.s-item__link').children().eq(0).children('.BOLD').text();
                if (name == '') {
                    name = items.children().eq(i).children().eq(1).children('.s-item__link').children('.s-item__title').text();
                }

                const condition = items.children().eq(i).children().eq(1).children('.s-item__subtitle').children('.SECONDARY_INFO').text();
                var price = items.children().eq(i).children().eq(1).children().eq(3).children().eq(0).children('.s-item__price').text();
                if (price == '') {
                    var price = items.children().eq(i).children().eq(1).children().eq(4).children().eq(0).children('.s-item__price').text();
                    if (price == '') {
                        var price = items.children().eq(i).children().eq(1).children().eq(5).children().eq(0).children('.s-item__price').text();
                    }
                }
                //file.write(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');
                ebaySearchResult.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink + '\n');
            }
            var allResult = '';
            for (let i = 0; i < ebaySearchResult.length; i++) {
                allResult = allResult.concat(ebaySearchResult[i]);
            }
            console.log(ebaySearchResult);
            showResult.show(allResult);
        });
    }

function aliExpress(url) {

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
         //chromy code
        let chromy = new Chromy({visible: true})
        chromy.chain()
            .goto(proxyUrl+url)
            .evaluate(() => {
                return document.body.innerHTML
            })
            .result((r) => {
                const $= cheerio.load(r);
                const item=$('#root').children('.glosearch-wrap').children('.page-content').children('.main-content').children().eq(1).children('.product-container')
                    .children().eq(1).children('.list-items').children().find('li');

                for(let i=0; i<item.length;i++){
                    const img=item.children().eq(i).children('.product-img').children('.place-container').children().eq(0).find('img').attr('src');
                    const name=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-title-wrap').children().eq(0).attr('title');

                    const Plink=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-title-wrap').children().eq(0).attr('href');



                    const condition='view at product webpage!!!'
                    let price=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-price-wrap').children('.item-price-row').children('.price-current').text();
                    //let shipping=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-shipping-wrap').children().text();



                    //console.log(price);
                    aliExpressSearchResult.push(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');

                }

                let allResult='';

                for(let i=0; i<aliExpressSearchResult.length;i++){
                    allResult=allResult.concat(aliExpressSearchResult[i]);
                }

                showResult(aliExpressSearchResult);

            })
            .end()
            .then(() => chromy.close())



        // chromy code

        /!*let chromy = new Chromy()
        await chromy.goto(url)
        const result = await chromy.evaluate(() => {
            return document.body.innerHTML;
        })
            .result((r) => {
                const $= cheerio.load(r);
                const item=$('#root').children('.glosearch-wrap').children('.page-content').children('.main-content').children().eq(1).children('.product-container')
                    .children().eq(1).children('.list-items').children().find('li');

                for(let i=0; i<item.length;i++){
                    const img=item.children().eq(i).children('.product-img').children('.place-container').children().eq(0).find('img').attr('src');
                    const name=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-title-wrap').children().eq(0).attr('title');

                    const Plink=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-title-wrap').children().eq(0).attr('href');



                    const condition='view at product webpage!!!'
                    let price=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-price-wrap').children('.item-price-row').children('.price-current').text();
                    //let shipping=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-shipping-wrap').children().text();



                    //console.log(price);
                    aliExpressSearchResult.push(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');

                }

                let allResult='';

                for(let i=0; i<ebaySearchResult.length;i++){
                    allResult=allResult.concat(ebaySearchResult[i]);
                }

                showResult(aliExpressSearchResult);

            })
            await chromy.close()
*!/



        // cheerio code
        /!*const $= cheerio.load(bodyHTML);
        const item=$('#root').children('.glosearch-wrap').children('.page-content').children('.main-content').children().eq(1).children('.product-container')
            .children().eq(1).children('.list-items').children().find('li');

        for(let i=0; i<item.length;i++){
            const img=item.children().eq(i).children('.product-img').children('.place-container').children().eq(0).find('img').attr('src');
            const name=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-title-wrap').children().eq(0).attr('title');

            const Plink=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-title-wrap').children().eq(0).attr('href');



            const condition='view at product webpage!!!'
            let price=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-price-wrap').children('.item-price-row').children('.price-current').text();
            //let shipping=item.children().eq(i).children().eq(1).children('.hover-help').children('.item-shipping-wrap').children().text();



            //console.log(price);
            aliExpressSearchResult.push(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');

        }


        let allResult='';

        for(let i=0; i<ebaySearchResult.length;i++){
            allResult=allResult.concat(ebaySearchResult[i]);
        }*!/
/!*
        //phantom js
    var _ph, _page, _outObj;

    phantom
        .create()
        .then(ph => {
            _ph = ph;
            return _ph.createPage();
        })
        .then(page => {
            _page = page;
            return _page.open(url);
        })
        .then(status => {
            console.log(status);
            return _page.property('content');
        })
        .then(content => {
            console.log(content);
            _page.close();
            _ph.exit();
        })
        .catch(e => console.log(e));*!/

    }

}*/

window.scrape=function() {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    const showResult = require('./showResult');

    let search=window.location.href;
    let temp=search.toString().split("?");
    let ebaySearchTitle=temp[1].replace(/%20/gi, '+');
    let searchBarText= temp[1].replace(/%20/gi, ' ');

    document.getElementById("box").setAttribute("value", searchBarText);

    console.log(ebaySearchTitle);
    //const url='https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.Xiphone+x+new.TRS1&_nkw=iphone+x+new&_sacat=0';
    const ebayUrl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.' + ebaySearchTitle + '.TRS1&_nkw=' + ebaySearchTitle + '&_sacat=0';
    const newEggUrl = 'https://www.newegg.com/p/pl?d='+ ebaySearchTitle +'&PageSize=96';
    const microCenterUrl='https://www.microcenter.com/search/search_results.aspx?Ntt='+ebaySearchTitle+'&searchButton=search'




    //var file=fs.createWriteStream('output.txt');
    let ebaySearchResult = [];
    let newEggSearchResult= [];
    let microCenterSearchResult=[];

    ebay(ebayUrl);
    //newegg(newEggUrl);
    micro(microCenterUrl);

    function ebay(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $('#srp-river-main').children().eq(1).children().eq(0).children('.s-item');
            for (var i = 0; i < items.length; i++) {
                const Plink = items.children().eq(i).children().eq(1).children('.s-item__link').attr('href'); //gets the urls for all the results displayed in the search
                var img = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).children('.s-item__image-wrapper').children('.s-item__image-img').attr('data-src');
                if (img == undefined) {
                    img = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).children('.s-item__image-wrapper').children('.s-item__image-img').attr('src');
                }
                var name = items.children().eq(i).children().eq(1).children('.s-item__link').children().eq(0).children('.BOLD').text();
                if (name == '') {
                    name = items.children().eq(i).children().eq(1).children('.s-item__link').children('.s-item__title').text();
                }

                const condition = items.children().eq(i).children().eq(1).children('.s-item__subtitle').children('.SECONDARY_INFO').text();
                var price = items.children().eq(i).children().eq(1).children().eq(3).children().eq(0).children('.s-item__price').text();
                if (price == '') {
                    var price = items.children().eq(i).children().eq(1).children().eq(4).children().eq(0).children('.s-item__price').text();
                    if (price == '') {
                        var price = items.children().eq(i).children().eq(1).children().eq(5).children().eq(0).children('.s-item__price').text();
                    }
                }
                //file.write(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');
                if(i!=items.length-1){
                    ebaySearchResult.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink + '\n');
                }else {
                    ebaySearchResult.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink);
                }
            }
            var allResult = '';
            for (let i = 0; i < ebaySearchResult.length; i++) {
                allResult = allResult.concat(ebaySearchResult[i]);
            }

            showResult.show(allResult, 'ebay');
        });
    }

    function newegg(url) {
        const proxyUrl = 'https://crossorigin.me/';
        const result = fetch(`${proxyUrl+url}`).then(response => response.text());
        result.then(body => {
            const $= cheerio.load(body);
            const items=$('.list-wrap').children().eq(3).children();
            console.log(items.length);

            for(var i = 0; i < items.length * 2; i+= 2){
                const itemLink = items.children().eq(i).attr('href');
                var itemImage = items.children().eq(i).children().eq(1).attr('src');
                var itemName = items.children().eq(i).children().eq(1).attr('title');
                itemImage = itemImage.substring(2, itemImage.length);
                itemName = itemName.substring(0, 60);
                itemName = itemName.substring(0, Math.min(itemName.length, itemName.lastIndexOf(" ")));
                //console.log(itemLink)
                //console.log(itemImage)
                //console.log(itemName)
                newEggSearchResult.push(itemImage + ' | ' + itemName + ' | ' + "New" + ' | ' + '$00.00' + ' | ' + itemLink + '\n');
            }
            const items2=$('.list-wrap').children().eq(7).children();
            console.log(items2.length);
            for(var i = 0; i < items2.length * 2; i+= 2){
                const itemLink = items2.children().eq(i).attr('href');
                var itemImage = items2.children().eq(i).children().eq(1).attr('src');
                var itemName = items2.children().eq(i).children().eq(1).attr('title');
                itemImage = itemImage.substring(2, itemImage.length);
                itemName = itemName.substring(0, 60);
                itemName = itemName.substring(0, Math.min(itemName.length, itemName.lastIndexOf(" ")));
                //console.log(itemLink)
                //console.log(itemImage)
                //console.log(itemName)
                newEggSearchResult.push(itemImage + ' | ' + itemName + ' | ' + "New" + ' | ' + '$00.00' + ' | ' + itemLink + '\n');
            }

            var allResult = '';
            for (let i = 0; i < newEggSearchResult.length; i++) {
                allResult = allResult.concat(newEggSearchResult[i]);
            }

            showResult.show(allResult, 'newegg');


        });
    }

    function micro(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl+url}`).then(response => response.text());
        result.then(body => {
            const $= cheerio.load(body);
            const items=$('#productGrid').children().eq(3).children('.product_wrapper');
            for(var j= 0; j<items.length * 2; j+= 2) {
                const Plink = 'https://www.microcenter.com'+items.children().eq(j).children().eq(1).attr('href'); //https://www.microcenter.com + href
                const Pname = items.children().eq(j).children().eq(1).attr('data-name');
                const Pprice = items.children().eq(j).children().eq(1).attr('data-price');
                const Pimg = items.children().eq(j).children().eq(1).children().attr('src');
                //link
                if (Plink != "undefined" || Pname != "undefined" || Pprice != "undefined" || Pimg != "undefined") {
                    console.log(Pname);
                    console.log(Pprice);
                    console.log(Pimg);
                    console.log(Plink);
                }
                if(Plink != "undefined" || Pprice != "undefined" || Pimg != "undefined" || Pname != "undefined"){
                    microCenterSearchResult.push(Pimg + ' | ' + Pname + ' | ' + "New" + ' | ' + '$' + Pprice + ' | ' + Plink + '\n');
                }
            }

            var allResult = '';
            for (let i = 0; i < microCenterSearchResult.length; i++) {
                allResult = allResult.concat(microCenterSearchResult[i]);
            }

            showResult.show(allResult, 'microcenter');
        });
    }




}
