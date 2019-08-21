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
window.scrape= function () {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    const showResult = require('./showResult');
    /*const firebase= require('firebase');

    firebase.initializeApp({
        databaseURL: "https://ezsearchonlinedatabase.firebaseio.com/"
    });

    //let ref=firebase.database().ref('database');
    let ref=firebase.database().ref().child('database');*/



    let search = window.location.href; //get the url

    let temp = search.toString().split("?"); //splits the url to extract info
    let sTerm = temp[1].split("&"); //get splits the searcgtitle and website [0]=searchtitle, [1]=websites

    let ebaySearchTitle = sTerm[0].replace(/%20/gi, '+');
    let searchBarText = sTerm[0].replace(/%20/gi, ' ');

    document.getElementById("box").setAttribute("value", searchBarText);

    console.log(sTerm[1]);
    let checkedWebsites = sTerm[1].split("+");
    console.log(checkedWebsites);

    for (let i = 0; i < checkedWebsites.length; i++) {
        switch (checkedWebsites[i]) {
            case "Ebay":
                document.getElementById("ebay").setAttribute("checked", "checked");
                break;
            case "MicroCenter":
                document.getElementById("microcenter").setAttribute("checked", "checked");
                break;
            case "Craigslist":
                document.getElementById("craigslist").setAttribute("checked", "checked");
                break;
            case "walmart":
                document.getElementById("walmart").setAttribute("checked", "checked");
                break;
            case "hnm":
                document.getElementById("hnm").setAttribute("checked", "checked");
                break;
            case "geebo":
                document.getElementById("geebo").setAttribute("checked", "checked");
                break;
            case "poshmark":
                document.getElementById("poshmark").setAttribute("checked", "checked");
                break;
            case "tradesy":
                document.getElementById("tradesy").setAttribute("checked", "checked");
                break;
        }
        ;
    }

    console.log(ebaySearchTitle);
    //const url='https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.Xiphone+x+new.TRS1&_nkw=iphone+x+new&_sacat=0';
    const ebayUrl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.' + ebaySearchTitle + '.TRS1&_nkw=' + ebaySearchTitle + '&_sacat=0';
    const microCenterUrl = 'https://www.microcenter.com/search/search_results.aspx?Ntt=' + ebaySearchTitle + '&searchButton=search';
    const craigslistUrl = 'https://washingtondc.craigslist.org/search/sss?query=' + ebaySearchTitle + '&sort=rel';
    const walmartUrl='https://www.walmart.com/search/?cat_id=0&query='+ebaySearchTitle;
    const hnmUrl='https://www2.hm.com/en_us/search-results.html?q=' + ebaySearchTitle;
    const geeboUrl='https://geebo.com/merchandise/search/mobile//distance/50/?q=' + ebaySearchTitle;
    const poshmarkUrl='https://poshmark.com/search?query=' + ebaySearchTitle + '&type=listings&ac=true';
    const tradesyUrl = 'https://www.tradesy.com/search?q=' + ebaySearchTitle;


    //var file=fs.createWriteStream('output.txt');
    let ebaySearchResult = [];
    //let newEggSearchResult= [];
    let microCenterSearchResult = [];
    const craiglistSearchResult = [];
    let walmartSearchResult= [];
    let hnmSearchResult = [];
    let geeboSearchResult = [];
    let poshmarkSearchResult = [];
    let tradesySearchResult = [];


    if (document.getElementById("ebay").checked) {
        ebay(ebayUrl);
    }
    if (document.getElementById("microcenter").checked) {
        microcenter(microCenterUrl);
    }
    if (document.getElementById("craigslist").checked) {
        craigslist(craigslistUrl);
    }
    if (document.getElementById("walmart").checked) {
        walmart(walmartUrl);
    }
    if (document.getElementById("hnm").checked) {
        hnm(hnmUrl);
    }
    if (document.getElementById("geebo").checked) {
        geebo(geeboUrl);
    }
    if (document.getElementById("poshmark").checked) {
        poshmark(poshmarkUrl);
    }
    if (document.getElementById("tradesy").checked) {
        tradesy(tradesyUrl);
    }


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
                let price = items.children().eq(i).children().eq(1).children().eq(3).children().eq(0).children('.s-item__price').text();
                if (price == '') {
                    price = items.children().eq(i).children().eq(1).children().eq(4).children().eq(0).children('.s-item__price').text();
                    if (price == '') {
                        price = items.children().eq(i).children().eq(1).children().eq(5).children().eq(0).children('.s-item__price').text();
                    }
                }
                //price=price.replace("$", '');
                var n = price.indexOf('t');
                price = price.substring(0, n != -1 ? n : price.length);
                price=price.replace("$", '');
                price=Number(price);
                //file.write(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');
                if (i != items.length - 1) {
                    //ebaySearchResult.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink + '\n');
                    ref.push({
                        pLink: Plink,
                        pName: name,
                        img: img,
                        pPrice: price,
                        pCondition: condition
                    });
                    //ref.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink);
                } else {
                    //ebaySearchResult.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink);
                    ref.push({
                        pLink: Plink,
                        pName: name,
                        img: img,
                        pPrice: price,
                        pCondition: condition
                    });
                    //ref.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink);
                }
            }
            var allResult = '';
            for (let i = 0; i < ebaySearchResult.length; i++) {
                allResult = allResult.concat(ebaySearchResult[i]);
            }

            //showResult.show(allResult, 'ebay');
        });
    }
    let out=[];

    function microcenter(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $('#productGrid').children().eq(3).children('.product_wrapper');
            for (var j = 0; j < items.length * 2; j += 2) {
                const Plink = 'https://www.microcenter.com' + items.children().eq(j).children().eq(1).attr('href'); //https://www.microcenter.com + href
                const Pname = items.children().eq(j).children().eq(1).attr('data-name');
                const Pprice = items.children().eq(j).children().eq(1).attr('data-price');
                const Pimg = items.children().eq(j).children().eq(1).children().attr('src');
                //link
                microCenterSearchResult.push(Pimg + ' | ' + Pname + ' | ' + "New" + ' | ' + Pprice + ' | ' + Plink + '\n');
            }

            var allResult = '';
            for (let i = 0; i < microCenterSearchResult.length; i++) {
                allResult = allResult.concat(microCenterSearchResult[i]);
            }

            showResult.show(allResult, 'microcenter');
        });
    }

    function tradesy(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items=$("#items-container-grid").children();
            for(var i = 0; i < items.length; i++) {
                const itemnum = items.children().eq(i).children()
                if (itemnum.length == 3) {
                    const itemImg = items.children().eq(i).children().attr('data-category-want-image');
                    const itemTitle = items.children().eq(i).children().attr('data-category-want-title');
                    const itemPrice = items.children().eq(i).children().attr('data-category-want-price');
                    const itemLink = 'https://www.tradesy.com' + items.children().eq(i).children().eq(1).children().eq(1).attr('href');
                    console.log(itemImg)
                    console.log(itemTitle)
                    console.log(itemPrice)
                    console.log(itemLink)
                    tradesySearchResult.push(itemImg + ' | ' + itemTitle + ' | ' + "New" + ' | ' +  itemPrice + ' | ' + itemLink + '\n');

                }
                else if(itemnum.length == 4) {
                    const itemImg = items.children().eq(i).children().eq(1).attr('data-category-want-image');
                    const itemTitle = items.children().eq(i).children().eq(1).attr('data-category-want-title');
                    const itemPrice = items.children().eq(i).children().eq(1).attr('data-category-want-price');
                    const itemLink = 'https://www.tradesy.com' + items.children().eq(i).children().eq(2).children().eq(1).attr('href');
                    console.log(itemImg)
                    console.log(itemLink)
                    console.log(itemTitle)
                    console.log(itemPrice)
                    tradesySearchResult.push(itemImg + ' | ' + itemTitle + ' | ' + "New" + ' | ' +  itemPrice + ' | ' + itemLink + '\n');

                }
            }
            var allResult = '';
            for (let i = 0; i < tradesySearchResult.length; i++) {
                allResult = allResult.concat(tradesySearchResult[i]);
            }
            showResult.show(allResult, 'tradesy');
        });
    }

    function poshmark(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items=$("#tiles-con").children();
            for (var i = 0; i < items.length; i++){
                const itemTitle = items.children().eq(i).children().eq(0).attr('title')
                let itemPrice = items.children().eq(i).attr('data-post-price');
                const itemLink = 'https://poshmark.com' + items.children().eq(i).children().eq(0).attr('href')
                const itemImg = items.children().eq(i).children().eq(0).children().attr('src')
                itemPrice = itemPrice.replace('$',"");
                poshmarkSearchResult.push(itemImg + ' | ' + itemTitle + ' | ' + "New" + ' | ' + itemPrice + ' | ' + itemLink + '\n');
            }
            var allResult = '';
            for (let i = 0; i < poshmarkSearchResult.length; i++) {
                allResult = allResult.concat(poshmarkSearchResult[i]);
            }
            showResult.show(allResult, 'poshmark');
        });
    }

    function geebo(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items=$(".list_items").children();
            for(var i = 2; i < 40; i++){
                const itemImg = items.children().eq(i).children().eq(1).children().eq(0).children().attr('src');
                const itemLink = items.children().eq(i).children().eq(1).children().eq(1).children().eq(0).children().eq(0).attr('href')
                const itemTitle = items.children().eq(i).children().eq(1).children().eq(1).children().eq(0).children('.title').text()
                let itemPrice = items.children().eq(i).children().eq(1).children().eq(1).children('.price').text()
                itemPrice = itemPrice.replace('$',"");
                geeboSearchResult.push(itemImg + ' | ' + itemTitle + ' | ' + "New" + ' | ' +  itemPrice + ' | ' + itemLink + '\n');
            }
            var allResult = '';
            for (let i = 0; i < geeboSearchResult.length; i++) {
                allResult = allResult.concat(geeboSearchResult[i]);
            }
            showResult.show(allResult, 'geebo');
        });
    }

    function hnm(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items=$(".page-content").children().eq(0).children().eq(1).children();
            for(var i = 0; i < items.length; i++){
                const itemLink = 'https://www2.hm.com' +  items.children().eq(i).children().eq(0).children().eq(0).attr('href');
                const itemImg = 'http:' + items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('data-src');
                const itemTitle = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('alt');
                let itemPrice = items.children().eq(i).children().eq(1).children('.item-price').text();
                itemPrice = itemPrice.replace(/\s+/g,"");
                itemPrice = itemPrice.replace('$',"");
                hnmSearchResult.push(itemImg + ' | ' + itemTitle + ' | ' + "New" + ' | ' +  itemPrice + ' | ' + itemLink + '\n');
            }
            var allResult = '';
            for (let i = 0; i < hnmSearchResult.length; i++) {
                allResult = allResult.concat(hnmSearchResult[i]);
            }
            showResult.show(allResult, 'hnm');
        });
    }


    function craigslist(url) {
        let cors_api_url = 'https://cors-anywhere.herokuapp.com/';
        function doCORSRequest(options, printResult) {
            let x = new XMLHttpRequest();
            x.open(options.method, cors_api_url + options.url);
            x.onload = x.onerror = function () {
                printResult(
                    options.method + ' ' + options.url + '\n' +
                    x.status + ' ' + x.statusText + '\n\n' +
                    (x.responseText || '')
                );
            };
            if (/^POST/i.test(options.method)) {
                x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            x.send(options.data);
        }
        // Bind event
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                let items = $('#sortable-results').children().eq(3).children();
                console.log(items.length)
                if(items.length<50){
                    items = $('#sortable-results').children().eq(4).children();
                }
                console.log(items.length);
                for (let i = 0; i < items.length; i++) {
                    let imgAvail = items.eq(i).children().eq(0).children();
                    if (imgAvail != 0) {
                        const pLink = items.eq(i).children().eq(0).attr('href');
                        let purl = 'https://cors-anywhere.herokuapp.com/';
                        const result2 = fetch(`${purl + pLink}`).then(response => response.text())
                        result2.then(body => {
                            //console.log(body);
                            const $ = cheerio.load(body);
                            const pImg = $('.gallery').children().eq(3).children().eq(0).children().eq(0).children().eq(0).attr('src');
                            const pName = $('#titletextonly').text();
                            const pPrice = $('.price').text();
                            const pCondition = 'used';
                            showResult.show(pImg + ' | ' + pName + ' | ' + pCondition + ' | ' + pPrice + ' | ' + pLink + '\n', 'craigslist');
                        })
                    }
                }
                //showResult.show(allResult, 'craigslist');
            });

        })();
    }

    function walmart(url) {
        let cors_api_url = 'https://cors-anywhere.herokuapp.com/';

        function doCORSRequest(options, printResult) {
            let x = new XMLHttpRequest();
            x.open(options.method, cors_api_url + options.url);
            x.onload = x.onerror = function () {
                printResult(
                    options.method + ' ' + options.url + '\n' +
                    x.status + ' ' + x.statusText + '\n\n' +
                    (x.responseText || '')
                );
            };
            if (/^POST/i.test(options.method)) {
                x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            x.send(options.data);
        }

// Bind event
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                let items= $('#searchContent').html().toString();
                //console.log(items);
                let temp= items.split('{"productId":');
                let r=[];
                for(let i=1; i<35;i++){
                    let t=[];
                    /*  let pName;
                      let img;
                      let pLink='https://www.walmart.com';
                      let pPrice='$';
                      let pCondition='New';*/


                    let temp2=temp[i].split(',')
                    //console.log(temp2);
                    //for title format
                    //console.log(temp2)

                    for(let i=0; i<temp2.length;i++){
                        if(temp2[i].includes('productPageUrl')){
                            temp2[i]=temp2[i].replace(/"productPageUrl":"|"/gi, "")
                            temp2[i]='https://www.walmart.com'+temp2[i]
                            t.push(temp2[i]);
                            break;
                        }
                    }

                    //console.log(t);
                    for(let i=0; i<t.length;i++){
                        (function () {
                            const url=t[i];
                            doCORSRequest({
                                method: this.id === 'post' ? 'POST' : 'GET',
                                url:url,
                            }, function printResult(result) {
                                //.log(result)
                                const $ = cheerio.load(result);
                                //console.log(result);
                                let pName=$('.ProductTitle').children().eq(0).attr('content');
                                pName=pName.substring(0,60);
                                pName=pName.substring(0,Math.min(pName.length,pName.lastIndexOf(' ')));
                                const pLink=url;
                                const img=$('.prod-hero-image-carousel-image').attr('src');
                                const pPrice=$('.price-characteristic').attr('content');
                                const pCondition="New";
                                //console.log(pPrice);
                                //console.log(img);
                                if(img!='undefined'){
                                    showResult.show(img + ' | ' + pName + ' | ' + pCondition + ' | ' + pPrice + ' | ' + pLink + '\n', 'walmart');
                                }
                            });
                        })();
                    }
                }
            });
        })();
    }



    function waitForIt(N) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => resolve(), N);
        });
    };

    waitForIt(5000)
        .then(function () {
            let out=ref.orderByValue();
            out.once('value')
                .then(function (snap) {
                    console.log(snap.val(), '\n');
                });
        })

}
