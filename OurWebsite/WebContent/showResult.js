exports.show= function(allresult, website) {
    //const fs = require('browserify-fs');
    //let eachLine = fs.readFileSync('output.txt').toString().split("\n");

    let eachLine=allresult.split("\n");


    function putResultIntoGrid(index, pImg, pName, pCondition, pPrice, pLink) {
        let node = document.createElement("DIV");
        node.className = "grid-item";

        let img = document.createElement("IMG");
        img.id = "imgLink" + index;
        img.src = pImg;
        img.className = "itemImages";
        node.appendChild(img);

        let textNode = document.createElement("DIV");
        textNode.className = "imgText";

        let name = document.createElement("P");
        let nameText = document.createTextNode(pName);
        name.appendChild(nameText);
        textNode.appendChild(name);

        let condition = document.createElement("P");
        let condText = document.createTextNode(pCondition);
        condition.appendChild(condText);
        textNode.appendChild(condition);

        let price = document.createElement("P");
        let PriceText = document.createTextNode(pPrice);
        price.appendChild(PriceText);
        textNode.appendChild(price);

        let link = document.createElement("A");
        link.href = pLink;
        textNode.appendChild(link);

        node.appendChild(textNode);

        let button=document.createElement("BUTTON");
        button.className="gotoLink";
        button.addEventListener ("click", function() {
            location.href=pLink;
        });

        let websiteImg= document.createElement("IMG");
        switch (website) {
            case 'ebay':
                websiteImg.src="ebay-logo.png";
                break;
            case 'newegg':
                websiteImg.src="newEgg-logo.png";
                break;
            case 'microcenter' :
                websiteImg.src="microcenter-logo.png";
        }
        //websiteImg.src="ebay-logo.png";
        button.appendChild(websiteImg);

        node.appendChild(button);




        document.getElementById("grid-result").appendChild(node);


    }

    for (let index = 0; index < eachLine.length; index++) {
        let productInfo = eachLine[index].split("|")
        let pImg = productInfo[0];
        let pName = productInfo[1];
        let pCondition = productInfo[2];
        let pPrice = productInfo[3];
        let pLink = productInfo[4];
        putResultIntoGrid(index, pImg, pName, pCondition, pPrice, pLink);


    }

    let footer = document.createElement('DIV');
    footer.className = "footer";
    let footerText = document.createTextNode("© Mohd Rokon / Touhid Nuhash");
    footer.appendChild(footerText);
    document.getElementById("grid-result").appendChild(footer);

}