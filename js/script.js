// Dynamic referencing of DOM : BEGIN
// Note: this should be use because elements of Fancy Product Designer is dynamycally rendered

let saveBtn;
let addImageBtn;
let addTextBtn;
let manageLayersBtn;
// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
    // Use traditional 'for loops' for IE 11 // FIXED THIS FOR LOOP IN THE NEXT VERSION
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if(!document.querySelector('[data-action=save]')) {
                return;
            } else {
                // set download name with the email name
                saveBtn = document.querySelector('[data-action=save]');
            }
            if(!document.querySelector('[data-module=text]')) {
                return;
            } else {
                // set download name with the email name
                addTextBtn = document.querySelector('[data-module=text]');
            }
            if(!document.querySelector('[data-module=images]')) {
                return;
            } else {
                // set download name with the email name
                addImageBtn = document.querySelector('[data-module=images]');
            }
            if(!document.querySelector('[data-module=manage-layers]')) {
                return;
            } else {
                // set download name with the email name
                manageLayersBtn = document.querySelector('[data-module=manage-layers]');
            }
        }
    }
};
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(document.body, {childList: true});

// Dynamic referencing of DOM : END

document.querySelector('#next').addEventListener('click', () => {
    saveBtn.click()
    document.querySelector("body > div.fpd-modal-internal.fpd-modal-overlay > div > div.fpd-modal-content > input[type=text]").value =document.querySelector("#title").value;
    document.querySelector("body > div.fpd-modal-internal.fpd-modal-overlay > div > div.fpd-modal-content > span").click();
})

document.querySelector('#add-text').addEventListener('click', () => {
    addTextBtn.click()
})

document.querySelector('#add-image').addEventListener('click', () => {
    addImageBtn.click()
})

document.querySelector('#manage-layers').addEventListener('click', () => {
    manageLayersBtn.click()
})

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter){
    let urlparameter;
    urlparameter = getUrlVars()[parameter];
    if ( urlparameter == null ) {
        return 0;
    }
    return urlparameter;
}

const product = getUrlParam('product');
const token = getUrlParam('token');
let productImage = getUrlParam('image');

if (productImage === '') {
    productImage = '65594_f_fm';
};

jQuery(document).ready(function(){
    var $yourDesigner = $('#clothing-designer'), pluginOpts = {
        productsJSON: [[{
            "elements": [{
                "type": "image",
                "source": "https://cdn.ssactivewear.com/Images/Color/"+productImage+".jpg",
                "title": "Base",
                "parameters": {
                    "draggable": false,
                    "autoCenter": true,
                    "colors": "#ededed",
                    "price": 5
                }
            }]
        }]],
        designsJSON: 'json/designs.json', //see JSON folder for designs sorted in categories
        stageWidth: 500,
        stageHeight: 500,
        editorMode: false,
        smartGuides: false,
        fonts: [
            {name: 'Helvetica'},
            {name: 'Times New Roman'},
            {name: 'Pacifico', url: 'Enter_URL_To_Pacifico_TTF'},
            {name: 'Arial'},
            {name: 'Lobster', url: 'google'}
        ],
        customTextParameters: {
            colors: true,
            removable: true,
            resizable: true,
            draggable: true,
            rotatable: true,
            autoCenter: true,
            boundingBox: "Base"
        },
        customImageParameters: {
            draggable: true,
            removable: true,
            resizable: true,
            rotatable: true,
            colors: '#000',
            autoCenter: true,
            boundingBox: "Base"
        },
        actions:  {
            'top': ['download','print', 'snap', 'preview-lightbox'],
            'right': ['magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
            'bottom': ['undo','redo'],
            'left': ['manage-layers','save']
        },
        mainBarModules: ['images', 'text', 'manage-layers']
    },
    yourDesigner = new FancyProductDesigner($yourDesigner, pluginOpts);

    //print button
    $('#print-button').click(function(){
        yourDesigner.print();
        return false;
    });

    //create an image
    $('#image-button').click(function(){
        var image = yourDesigner.createImage();
        return false;
    });

    //checkout button with getProduct()
    $('#checkout-button').click(function(){
        var product = yourDesigner.getProduct();
        console.log(product);
        return false;
    });

    //event handler when the price is changing
    $yourDesigner.on('priceChange', function(evt, price, currentPrice) {
        $('#thsirt-price').text(currentPrice);
    });

    //save image on webserver
    $('#save-image-php').click(function() {
        yourDesigner.getProductDataURL(function(dataURL) {
            $.post( "php/save_image.php", { base64_image: dataURL} );
        });
    });

    //send image via mail
    $('#send-image-mail-php').click(function() {
        yourDesigner.getProductDataURL(function(dataURL) {
            $.post( "php/send_image_via_mail.php", { base64_image: dataURL} );
        });
    });

    $.ajax({
        url: "https://api.bigstitchy.com/api/accounts/attachments",
        type: "GET",
        headers: { 
        Authorization: `Bearer ${token}`
        },
            success: function(data) {
            data.forEach(d => {
                console.log(d.title);
            })
            window.localStorage.setItem('clothing-designer', JSON.stringify(data));
        }
    });
});