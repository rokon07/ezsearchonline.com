window.scrape = function () {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    const showResult = require('./showResult');
    const firebase = require('firebase');

    firebase.initializeApp({
        databaseURL: "https://ezsearchonlinedatabase.firebaseio.com/"
    });


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


    //let ref=firebase.database().ref('database');

    function ID() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    let ref = firebase.database().ref().child(ID());


    let search = window.location.href; //get the url

    let temp = search.toString().split("?"); //splits the url to extract info
    let sTerm = temp[1].split("&"); //get splits the searcgtitle and website [0]=searchtitle, [1]=websites

    let SearchTitle = sTerm[0].replace(/%20/gi, '+');
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
            case "tradesy":
                document.getElementById("tradesy").setAttribute("checked", "checked");
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
            case "decending":
                document.getElementById("decending").selected = "true";
                break;
        }

    }

    const ebayUrl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR11.TRC2.A0.H0.' + SearchTitle + '.TRS1&_nkw=' + SearchTitle + '&_sacat=0';
    const microCenterUrl = 'https://www.microcenter.com/search/search_results.aspx?Ntt=' + SearchTitle + '&searchButton=search';
    const craigslistUrl = 'https://washingtondc.craigslist.org/search/sss?query=' + SearchTitle + '&sort=rel';
    const walmartUrl = 'https://www.walmart.com/search/?cat_id=0&query=' + SearchTitle;
    const hnmUrl = 'https://www2.hm.com/en_us/search-results.html?q=' + SearchTitle;
    const geeboUrl = 'https://geebo.com/merchandise/search/mobile//distance/50/?q=' + SearchTitle;
    const poshmarkUrl = 'https://poshmark.com/search?query=' + SearchTitle + '&type=listings&ac=true';
    const tradesyUrl = 'https://www.tradesy.com/search?q=' + SearchTitle;


    if (document.getElementById("ebay").checked) {
        ebay(ebayUrl);
    }
    if (document.getElementById("microcenter").checked) {
        micro(microCenterUrl);
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
                price = price.replace("$", '');
                price = Number(price);
                const pWebsite = 'ebay';
                //file.write(img +' | '+ name +' | '+ condition + '| ' + price + ' | '+ Plink +'\n');
                //ebaySearchResult.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink + '\n');
                ref.push({
                    pLink: Plink,
                    pName: name,
                    img: img,
                    pPrice: price,
                    pCondition: condition,
                    pWebsite: pWebsite

                });
                //ref.push(img + ' | ' + name + ' | ' + condition + '| ' + price + ' | ' + Plink);
            }
        });
    }

    function micro(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $('#productGrid').children().eq(3).children('.product_wrapper');
            for (var j = 0; j < items.length * 2; j += 2) {
                const Plink = 'https://www.microcenter.com' + items.children().eq(j).children().eq(1).attr('href'); //https://www.microcenter.com + href
                const Pname = items.children().eq(j).children().eq(1).attr('data-name');
                let Pprice = items.children().eq(j).children().eq(1).attr('data-price');
                Pprice = Number(Pprice);
                const Pimg = items.children().eq(j).children().eq(1).children().attr('src');
                const pCondition = 'New';
                const pWebsite = 'microcenter'
                //link
                //microCenterSearchResult.push(Pimg + ' | ' + Pname + ' | ' + pCondition + ' | ' + Pprice + ' | ' + Plink + '\n');
                ref.push({
                    pLink: Plink,
                    pName: Pname,
                    img: Pimg,
                    pPrice: Pprice,
                    pCondition: pCondition,
                    pWebsite: pWebsite
                });
            }

            /*var allResult = '';
            for (let i = 0; i < microCenterSearchResult.length; i++) {
                allResult = allResult.concat(microCenterSearchResult[i]);
            }

            showResult.show(allResult, 'microcenter');*/
        });
    }

    function craigslist(url) {
        // Bind event
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                let items = $('#sortable-results').children().eq(3).children();
                console.log(items.length)
                if (items.length < 50) {
                    items = $('#sortable-results').children().eq(4).children();
                }
                console.log(items.length);
                for (let i = 0; i < items.length; i++) {
                    let imgAvail = items.eq(i).children().eq(0).children();
                    if (imgAvail != 0) {
                        (function () {
                            const url = items.eq(i).children().eq(0).attr('href');
                            doCORSRequest({
                                method: this.id === 'post' ? 'POST' : 'GET',
                                url: url,
                            }, function printResult(result) {
                                const $ = cheerio.load(result);
                                let pPrice = $('.price').text();
                                if (pPrice != '') {
                                    pPrice = pPrice.replace('$', '');
                                    pPrice = Number(pPrice);
                                    //console.log(pPrice);
                                    const pImg = $('.gallery').children().eq(3).children().eq(0).children().eq(0).children().eq(0).attr('src');
                                    const pName = $('#titletextonly').text();
                                    const pWebsite = 'craigslist';

                                    const pCondition = 'used';
                                    ref.push({
                                        pLink: url,
                                        pName: pName,
                                        img: pImg,
                                        pPrice: pPrice,
                                        pCondition: pCondition,
                                        pWebsite: pWebsite
                                    });
                                }

                            });

                        })();

                    }

                }
            });

        })();
    }

    function walmart(url) {
// Bind event
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                let items = $('#searchContent').html().toString();
                //console.log(items);
                let temp = items.split('{"productId":');
                let r = [];
                for (let i = 1; i < 35; i++) {
                    let t = [];
                    let temp2 = temp[i].split(',')
                    for (let i = 0; i < temp2.length; i++) {
                        if (temp2[i].includes('productPageUrl')) {
                            temp2[i] = temp2[i].replace(/"productPageUrl":"|"/gi, "")
                            temp2[i] = 'https://www.walmart.com' + temp2[i]
                            //console.log(temp2[i]);
                            t.push(temp2[i]);
                            break;
                        }
                    }

                    // console.log(t);
                    for (let i = 0; i < t.length; i++) {
                        (function () {
                            const url = t[i];
                            doCORSRequest({
                                method: this.id === 'post' ? 'POST' : 'GET',
                                url: url,
                            }, function printResult(result) {
                                //.log(result)
                                const $ = cheerio.load(result);
                                //console.log(result);
                                let pName = $('.ProductTitle').children().eq(0).attr('content');
                                //console.log(pName);
                                if (pName != null && pName != undefined) {
                                    pName = pName.substring(0, 60);
                                    pName = pName.substring(0, Math.min(pName.length, pName.lastIndexOf(' ')));
                                }
                                /*pName=pName.substring(0,60);
                                pName=pName.substring(0,Math.min(pName.length,pName.lastIndexOf(' ')));*/
                                const pLink = url;
                                const img = $('.prod-hero-image-carousel-image').attr('src');
                                let pPrice = $('.price-characteristic').attr('content');
                                pPrice = pPrice.replace('$', '');
                                pPrice = Number(pPrice);
                                const pCondition = "New";
                                const pWebsite = 'walmart';
                                if (img != undefined && pName != undefined && pLink != undefined && pPrice != undefined) {
                                    ref.push({
                                        pLink: url,
                                        pName: pName,
                                        img: img,
                                        pPrice: pPrice,
                                        pCondition: pCondition,
                                        pWebsite: pWebsite
                                    });
                                }

                            });

                        })();


                    }

                }

            });

        })();
    }

    function tradesy(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $("#items-container-grid").children();
            for (var i = 0; i < items.length; i++) {
                const itemnum = items.children().eq(i).children()
                if (itemnum.length == 3) {
                    const itemImg = items.children().eq(i).children().attr('data-category-want-image');
                    const itemTitle = items.children().eq(i).children().attr('data-category-want-title');
                    let itemPrice = items.children().eq(i).children().attr('data-category-want-price');
                    itemPrice = Number(itemPrice);
                    const itemLink = 'https://www.tradesy.com' + items.children().eq(i).children().eq(1).children().eq(1).attr('href');
                    const itemCondition = "Used";
                    const itemWebsite = "tradesy";
                    ref.push({
                        pLink: itemLink,
                        pName: itemTitle,
                        img: itemImg,
                        pPrice: itemPrice,
                        pCondition: itemCondition,
                        pWebsite: itemWebsite

                    });

                } else if (itemnum.length == 4) {
                    const itemImg = items.children().eq(i).children().eq(1).attr('data-category-want-image');
                    const itemTitle = items.children().eq(i).children().eq(1).attr('data-category-want-title');
                    let itemPrice = items.children().eq(i).children().eq(1).attr('data-category-want-price');
                    itemPrice = Number(itemPrice);
                    const itemCondition = "Used";
                    const itemWebsite = "tradesy";
                    const itemLink = 'https://www.tradesy.com' + items.children().eq(i).children().eq(2).children().eq(1).attr('href');
                    ref.push({
                        pLink: itemLink,
                        pName: itemTitle,
                        img: itemImg,
                        pPrice: itemPrice,
                        pCondition: itemCondition,
                        pWebsite: itemWebsite

                    });

                }
            }
        });
    }

    function poshmark(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $("#tiles-con").children();
            for (var i = 0; i < items.length; i++) {
                const itemTitle = items.children().eq(i).children().eq(0).attr('title')
                let itemPrice = items.children().eq(i).attr('data-post-price');
                const itemLink = 'https://poshmark.com' + items.children().eq(i).children().eq(0).attr('href')
                const itemImg = items.children().eq(i).children().eq(0).children().attr('src')
                itemPrice = itemPrice.replace('$', "");
                itemPrice = Number(itemPrice);
                const itemWebsite = "poshmark";
                const itemCondition = 'New';
                //poshmarkSearchResult.push(itemImg + ' | ' + itemTitle + ' | ' + itemCondition + ' | ' + itemPrice + ' | ' + itemLink + '\n');
                ref.push({
                    pLink: itemLink,
                    pName: itemTitle,
                    img: itemImg,
                    pPrice: itemPrice,
                    pCondition: itemCondition,
                    pWebsite: itemWebsite

                });
            }

        });
    }

    function geebo(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $(".list_items").children();
            for (var i = 2; i < 40; i++) {


                const itemImg = items.children().eq(i).children().eq(1).children().eq(0).children().attr('src');
                const itemLink = items.children().eq(i).children().eq(1).children().eq(1).children().eq(0).children().eq(0).attr('href');
                const itemTitle = items.children().eq(i).children().eq(1).children().eq(1).children().eq(0).children('.title').text();
                let itemPrice = items.children().eq(i).children().eq(1).children().eq(1).children('.price').text();

                itemPrice = itemPrice.replace('$', "");
                itemPrice = itemPrice.replace(',', "");
                itemPrice = Number(itemPrice);
                const itemWebsite = 'geebo';
                const itemCondition = 'Used'
                //console.log(itemPrice);
                if (itemPrice != undefined && !isNaN(itemPrice) && itemImg != undefined && itemTitle != undefined && itemLink != undefined) {
                    ref.push({
                        pLink: itemLink,
                        pName: itemTitle,
                        img: itemImg,
                        pPrice: itemPrice,
                        pCondition: itemCondition,
                        pWebsite: itemWebsite

                    });
                }
            }
        });
    }

    function hnm(url) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const result = fetch(`${proxyUrl + url}`).then(response => response.text());
        result.then(body => {
            const $ = cheerio.load(body);
            const items = $(".page-content").children().eq(0).children().eq(1).children();
            for (var i = 0; i < items.length; i++) {
                const itemLink = 'https://www2.hm.com' + items.children().eq(i).children().eq(0).children().eq(0).attr('href');
                const itemImg = 'http:' + items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('data-src');
                const itemTitle = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('alt');
                let itemPrice = items.children().eq(i).children().eq(1).children('.item-price').text();
                itemPrice = itemPrice.replace(/\s+/g, "");
                itemPrice = itemPrice.replace('$', "");
                var n = itemPrice.indexOf('$');
                itemPrice = itemPrice.substring(0, n != -1 ? n : itemPrice.length);
                itemPrice = Number(itemPrice);
                console.log(itemPrice)
                const itemWebsite = 'hnm';
                const itemCondition = 'New';
                ref.push({
                    pLink: itemLink,
                    pName: itemTitle,
                    img: itemImg,
                    pPrice: itemPrice,
                    pCondition: itemCondition,
                    pWebsite: itemWebsite

                });
            }
        });
    }


    function waitForIt(N) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => resolve(), N);
        });
    };

    let allitems = [];
    let result;
    waitForIt(5000)
        .then(function () {
            ref.on('value', gotData, errData);

        })

    function gotData(data) {
        result = data.val();
        if (result != undefined) {
            let keys = Object.keys(result);

            for (let i = 0; i < keys.length; i++) {
                let temp = [];
                let k = keys[i];
                temp.push(result[k].img);
                temp.push(result[k].pName);
                temp.push(result[k].pCondition);
                temp.push(result[k].pPrice)
                temp.push(result[k].pLink);
                temp.push(result[k].pWebsite);
                allitems.push(temp);
            }

            var ddl = document.getElementById("sort");
            var selectedValue = ddl.options[ddl.selectedIndex].value;
            for (let i = 0; i < allitems.length - 1; i++) {
              for (let j = 0; j < (allitems.length - i) - 1; j++) {
                if(selectedValue == "decending"){
                  if (allitems[j][3] < allitems[j + 1][3]) {
                    let temp = allitems[j];
                    allitems[j] = allitems[j + 1];
                    allitems[j + 1] = temp;
                  }
                }
                else{
                  if (allitems[j][3] > allitems[j + 1][3]) {
                    let temp = allitems[j];
                    allitems[j] = allitems[j + 1];
                    allitems[j + 1] = temp;
                  }
                }
              }
            }

            let modifiedList = [];
            let finalList = '';

            for (let i = 0; i < allitems.length; i++) {
                let temp = '';
                for (j = 0; j < allitems[i].length; j++) {
                    if (j != allitems[i].length - 1) {
                        temp = temp + allitems[i][j] + "|";
                    } else {
                        temp = temp + allitems[i][j];
                    }
                }
                modifiedList.push(temp);
            }

            for (let i = 0; i < modifiedList.length; i++) {
                if (i != modifiedList.length - 1) {
                    finalList = finalList + modifiedList[i] + '\n';
                } else {
                    finalList = finalList + modifiedList[i];
                }
            }

            showResult.show(finalList);

            ref.remove().then(function () {
                ref.onDisconnect();
            });

        }


    }

    function errData(err) {
        console.log('error');
    }


}
