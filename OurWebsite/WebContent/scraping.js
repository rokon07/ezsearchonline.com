window.scrape = function () {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    const showResult = require('./showResult');
    const firebase = require('firebase');

    firebase.initializeApp({
        databaseURL: "https://ezsearchonlinedatabase.firebaseio.com/"
    });


    const cors_api_url = 'https://ezsearchonlineproxy.herokuapp.com/';

    function doCORSRequest(options, printResult) {
        let x = new XMLHttpRequest();
        x.open(options.method, cors_api_url + options.url);
        x.onload = x.onerror = function () {
            if(x.status=='200'){
                printResult(
                    options.method + ' ' + options.url + '\n' +
                    x.status + ' ' + x.statusText + '\n\n' +
                    (x.responseText || '')
                );
            }
            /*printResult(
                options.method + ' ' + options.url + '\n' +
                x.status + ' ' + x.statusText + '\n\n' +
                (x.responseText || '')
            );*/
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
    //console.log(search);


    let temp = search.toString().split("?"); //splits the url to extract info
    //console.log(temp);
    let sTerm = temp[1].split("&"); //get splits the searcgtitle and website [0]=searchtitle, [1]=websites
    //console.log(sTerm);
    let SearchTitle = sTerm[0].replace(/%20/gi, '+');
    let searchBarText = sTerm[0].replace(/%20/gi, ' ');

    let checkedWebsites = sTerm[1].split("+");
    //console.log(checkedWebsites);
    //getting the price limit filter
    let priceLimitText=[];
    let pricelimit=[];
    let sort='acending';
    if(sTerm[1].includes('~')){
        priceLimitText = sTerm[1].split('~');
        console.log(priceLimitText);
        pricelimit = priceLimitText[1].split('-');
        sort = pricelimit[2];
    }

    let minPrice = 0;
    let maxPrice = 0;


    if (sort == 'decending') {
        document.getElementById("decending").selected = "true";
    } else {
        document.getElementById("ascending").selected = "true";
    }


    if (pricelimit[0] != undefined && pricelimit[1] != undefined) {
        document.getElementById('minPrice').setAttribute('value', pricelimit[0]);
        document.getElementById('maxPrice').setAttribute('value', pricelimit[1]);
        minPrice = Number(pricelimit[0]);
        maxPrice = Number(pricelimit[1]);
        console.log(minPrice);
        console.log(maxPrice);
    }


    document.getElementById("box").setAttribute("value", searchBarText);


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
            case "poshmark":
                document.getElementById("poshmark").setAttribute("checked", "checked");
                break;
            case "tradesy":
                document.getElementById("tradesy").setAttribute("checked", "checked");
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

    if (SearchTitle != '') {
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
        if (document.getElementById("poshmark").checked) {
            poshmark(poshmarkUrl);
        }
        if (document.getElementById("tradesy").checked) {
            tradesy(tradesyUrl);
        }
    }


    function ebay(url) {

        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                const items = $('#srp-river-main').children().eq(1).children().eq(0).children('.s-item');
                for (var i = 0; i < items.length; i++) {

                    if (minPrice != 0 && maxPrice != 0) {
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
                        if (price >= minPrice && price <= maxPrice) {
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
                            const pWebsite = 'ebay';
                            ref.push({
                                pLink: Plink,
                                pName: name,
                                img: img,
                                pPrice: price,
                                pCondition: condition,
                                pWebsite: pWebsite

                            });
                        }
                    } else {
                        let price = items.children().eq(i).children().eq(1).children().eq(3).children().eq(0).children('.s-item__price').text();
                        if (price == '') {
                            price = items.children().eq(i).children().eq(1).children().eq(4).children().eq(0).children('.s-item__price').text();
                            if (price == '') {
                                price = items.children().eq(i).children().eq(1).children().eq(5).children().eq(0).children('.s-item__price').text();
                            }
                        }
                        //price=price.replace("$", '');
                        let n = price.indexOf('t');
                        price = price.substring(0, n != -1 ? n : price.length);
                        price = price.replace("$", '');
                        price = Number(price);
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
                        const pWebsite = 'ebay';
                        ref.push({
                            pLink: Plink,
                            pName: name,
                            img: img,
                            pPrice: price,
                            pCondition: condition,
                            pWebsite: pWebsite

                        });
                    }
                }

            });

        })();

    }

    function micro(url) {

        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                const items = $('#productGrid').children().eq(3).children('.product_wrapper');
                for (let j = 0; j < items.length * 2; j += 2) {
                    if (minPrice != 0 && maxPrice != 0) {
                        let Pprice = items.children().eq(j).children().eq(1).attr('data-price');
                        Pprice = Number(Pprice);
                        if (Pprice >= minPrice && Pprice <= maxPrice) {
                            const Plink = 'https://www.microcenter.com' + items.children().eq(j).children().eq(1).attr('href'); //https://www.microcenter.com + href
                            const Pname = items.children().eq(j).children().eq(1).attr('data-name');
                            const Pimg = items.children().eq(j).children().eq(1).children().attr('src');
                            const pCondition = 'New';
                            const pWebsite = 'microcenter';

                            ref.push({
                                pLink: Plink,
                                pName: Pname,
                                img: Pimg,
                                pPrice: Pprice,
                                pCondition: pCondition,
                                pWebsite: pWebsite
                            });
                        }
                    } else {
                        const Plink = 'https://www.microcenter.com' + items.children().eq(j).children().eq(1).attr('href'); //https://www.microcenter.com + href
                        const Pname = items.children().eq(j).children().eq(1).attr('data-name');
                        let Pprice = items.children().eq(j).children().eq(1).attr('data-price');
                        Pprice = Number(Pprice);
                        const Pimg = items.children().eq(j).children().eq(1).children().attr('src');
                        const pCondition = 'New';
                        const pWebsite = 'microcenter';

                        ref.push({
                            pLink: Plink,
                            pName: Pname,
                            img: Pimg,
                            pPrice: Pprice,
                            pCondition: pCondition,
                            pWebsite: pWebsite
                        });
                    }
                }

            });

        })();

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
                                if (minPrice != 0 && maxPrice != 0) {
                                    let pPrice = $('.price').text();
                                    if (pPrice != '') {
                                        pPrice = pPrice.replace('$', '');
                                        pPrice = Number(pPrice);
                                        if (pPrice >= minPrice && pPrice <= maxPrice) {
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
                                    }

                                } else {
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
                    let temp2 = temp[i].split(',');
                    for (let i = 0; i < temp2.length; i++) {
                        if (temp2[i].includes('productPageUrl')) {
                            temp2[i] = temp2[i].replace(/"productPageUrl":"|"/gi, "")
                            temp2[i] = 'https://www.walmart.com' + temp2[i]
                            //console.log(temp2[i]);
                            t.push(temp2[i]);
                            break;
                        }
                    }
                    for (let i = 0; i < t.length; i++) {
                        (function () {
                            const url = t[i];
                            doCORSRequest({
                                method: this.id === 'post' ? 'POST' : 'GET',
                                url: url,
                            }, function printResult(result) {
                                //.log(result)
                                const $ = cheerio.load(result);
                                if (minPrice != 0 && maxPrice != 0) {
                                    let pPrice = $('.price-characteristic').attr('content');
                                    if (pPrice != '') {
                                        pPrice = pPrice.replace('$', '');
                                        pPrice = Number(pPrice);
                                        if (pPrice >= minPrice && pPrice <= maxPrice) {
                                            let pName = $('.ProductTitle').children().eq(0).attr('content');
                                            if (pName != null && pName != undefined) {
                                                pName = pName.substring(0, 60);
                                                pName = pName.substring(0, Math.min(pName.length, pName.lastIndexOf(' ')));
                                                const pLink = url;
                                                const img = $('.prod-hero-image-carousel-image').attr('src');
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
                                            }
                                        }
                                    }
                                } else {
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
                                }
                            });

                        })();


                    }

                }

            });

        })();
    }

    function tradesy(url) {
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                const items = $("#items-container-grid").children();
                for (var i = 0; i < items.length; i++) {
                    const itemnum = items.children().eq(i).children()
                    if (itemnum.length == 3) {
                        if (minPrice != 0 && maxPrice != 0) {
                            let itemPrice = items.children().eq(i).children().attr('data-category-want-price');
                            itemPrice = Number(itemPrice);
                            if (itemPrice >= minPrice && itemPrice <= maxPrice) {
                                const itemImg = items.children().eq(i).children().attr('data-category-want-image');
                                const itemTitle = items.children().eq(i).children().attr('data-category-want-title');
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
                            }
                        } else {
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
                        }
                    } else if (itemnum.length == 4) {
                        if (minPrice != 0 && maxPrice != 0) {
                            let itemPrice = items.children().eq(i).children().eq(1).attr('data-category-want-price');
                            itemPrice = Number(itemPrice);
                            if (itemPrice >= minPrice && itemPrice <= maxPrice) {
                                const itemImg = items.children().eq(i).children().eq(1).attr('data-category-want-image');
                                const itemTitle = items.children().eq(i).children().eq(1).attr('data-category-want-title');
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
                        } else {
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
                }

            });

        })();
    }

    function poshmark(url) {
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                const items = $("#tiles-con").children();
                for (var i = 0; i < items.length; i++) {
                    if (minPrice != 0 && maxPrice != 0) {
                        let itemPrice = items.children().eq(i).attr('data-post-price');
                        itemPrice = itemPrice.replace('$', "");
                        itemPrice = Number(itemPrice);
                        if (itemPrice >= minPrice && itemPrice <= maxPrice) {
                            const itemTitle = items.children().eq(i).children().eq(0).attr('title')
                            const itemLink = 'https://poshmark.com' + items.children().eq(i).children().eq(0).attr('href')
                            const itemImg = items.children().eq(i).children().eq(0).children().attr('src')
                            const itemWebsite = "poshmark";
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
                    } else {
                        const itemTitle = items.children().eq(i).children().eq(0).attr('title')
                        let itemPrice = items.children().eq(i).attr('data-post-price');
                        const itemLink = 'https://poshmark.com' + items.children().eq(i).children().eq(0).attr('href')
                        const itemImg = items.children().eq(i).children().eq(0).children().attr('src')
                        itemPrice = itemPrice.replace('$', "");
                        itemPrice = Number(itemPrice);
                        const itemWebsite = "poshmark";
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

                }

            });

        })();


    }

    function hnm(url) {
        (function () {
            doCORSRequest({
                method: this.id === 'post' ? 'POST' : 'GET',
                url: url,
            }, function printResult(result) {
                const $ = cheerio.load(result);
                const items = $(".page-content").children().eq(0).children().eq(1).children();
                for (var i = 0; i < items.length; i++) {
                    if (minPrice != 0 && maxPrice != 0) {
                        let itemPrice = items.children().eq(i).children().eq(1).children('.item-price').text();
                        itemPrice = itemPrice.replace(/\s+/g, "");
                        itemPrice = itemPrice.replace('$', "");
                        var n = itemPrice.indexOf('$');
                        itemPrice = itemPrice.substring(0, n != -1 ? n : itemPrice.length);
                        itemPrice = Number(itemPrice);
                        if (itemPrice >= minPrice && itemPrice <= maxPrice) {
                            const itemLink = 'https://www2.hm.com' + items.children().eq(i).children().eq(0).children().eq(0).attr('href');
                            const itemImg = 'http:' + items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('data-src');
                            const itemTitle = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('alt');
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
                    } else {
                        const itemLink = 'https://www2.hm.com' + items.children().eq(i).children().eq(0).children().eq(0).attr('href');
                        const itemImg = 'http:' + items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('data-src');
                        const itemTitle = items.children().eq(i).children().eq(0).children().eq(0).children().eq(0).attr('alt');
                        let itemPrice = items.children().eq(i).children().eq(1).children('.item-price').text();
                        itemPrice = itemPrice.replace(/\s+/g, "");
                        itemPrice = itemPrice.replace('$', "");
                        var n = itemPrice.indexOf('$');
                        itemPrice = itemPrice.substring(0, n != -1 ? n : itemPrice.length);
                        itemPrice = Number(itemPrice);
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
                }

            });

        })();
    }


    function waitForIt(N) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => resolve(), N);
        });
    };

    let allitems = [];
    let result;
    waitForIt(6000)
        .then(function () {
            ref.once('value', gotData, errData);

        });

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

            if (sort == 'decending') {
                console.log('decend')
                for (let i = 0; i < allitems.length - 1; i++) {
                    for (let j = 0; j < (allitems.length - i) - 1; j++) {
                        if (allitems[j][3] < allitems[j + 1][3]) {
                            let temp = allitems[j];
                            allitems[j] = allitems[j + 1];
                            allitems[j + 1] = temp;
                        }
                    }
                }
            } else {
                console.log('acend')
                for (let i = 0; i < allitems.length - 1; i++) {
                    for (let j = 0; j < (allitems.length - i) - 1; j++) {
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

        } else {
            //the console is showing bt item is no creating...i guess styling would fix it... try it
            /*console.log('no item');
            let node = document.createElement("DIV");
            node.id='no-result';
            let textNode=document.createElement("P");
            let text=document.createTextNode("Sorry! We could not find the item you are looking for 😔");
            textNode.appendChild(text);
            node.appendChild(textNode);*/
            window.alert("Sorry! We could not find the item you are looking for 😔. * Try again as some queries may not show up on first load. Make sure desired sites are selected aswell.");
        }


    }

    function errData(err) {
        console.log('error');
    }


};
