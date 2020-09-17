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
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector("#price");
const basePrice = document.querySelector("#base-price-product");
const modal = document.querySelector(".modal");
const closeModal = document.querySelectorAll(".close-modal");
const modalAlert = document.querySelector("#alert");
document.querySelector('#next').addEventListener('click', () => {
    saveBtn.click()
    if(titleInput.value === "" | priceInput.value === "") {
        if(titleInput.value === "") {
            titleInput.classList.add('required')
        }
        if(descriptionInput.value === "") {
            descriptionInput.classList.add('required')
        }
        if(priceInput.value === "") {
            priceInput.classList.add('required')
        }
        return
    }

    titleInput.classList.remove('required')
    descriptionInput.classList.remove('required')
    priceInput.classList.remove('required')
    document.querySelector("body > div.fpd-modal-internal.fpd-modal-overlay > div > div.fpd-modal-content > input[type=text]").value = titleInput.value;

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

closeModal.forEach(closeM => {
    closeM.addEventListener('click', () => {
        modal.classList.remove('show')
    })
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
const styleID = getUrlParam('style_id');
let colorSwatchImage = getUrlParam('image') || '65594_f_fm';

jQuery(document).ready(function(){

    //set total 
    function set_price_total(){
     
    const price_embroidery = parseFloat($('select#embroidery-type').val());
    const price_shipping = parseFloat($('#base-price-shipping').val());
    const price_product = parseFloat($('#base-price-product').val());
    const price_markup = parseFloat($('#base-price-markup').val());
    const price_total = $('#base-price-total');

    if ( window.localStorage.getItem('userType') == 'Founder' ) {

      price_markup = 0;

    }

    const grand_total = (price_embroidery + price_shipping + price_product + price_markup).toFixed(2);
     
    price_total.html(grand_total);
    $('#price').val(grand_total);

    } // end of set_price_total()
    

    $('select#embroidery-type').change(function(){
      
      set_price_total();

    }); // end of $('select#embroidery-type')
     
    // publish to shopify
    $('#publish').click(function(){

      yourDesigner.getProductDataURL(function(dataURL) {
        
        const title = $('#title').val();
        const descrip = tinyMCE.get('description').getContent();
        const price = $('#price').val();
        const image = dataURL;
        const clean_image = image.split(',').pop();

        const product_data = {
          "product": {
            "title": title,
            "body_html": descrip,
            "vendor": "Big Stitchy",
            "product_type": "Custom Big Stitchy",
            "images": [
              {
                "attachment": clean_image
              }
            ],
            "variants": [
              {
                "price": price,
                "presentment_prices": [
                  {
                    "price": {
                      "currency_code": "USD",
                      "amount": price
                    },
                    "compare_at_price": null
                  }
                ]
              }
            ]
          }
        }

        // big stitchy api endpoint to create shopify product
        $.ajax({
          url: "https://api.bigstitchy.com/api/shop-product-publish",
          type: "POST",
          data: { product_data: product_data },
          success: function(data) {
            $('.modal').addClass('show');
            $('.modal__inner p').text('Store Product Successfully Created!');
          }
        });

      }); // end of yourDesigner.getProductDataURL(function(dataURL)

    }); // end of $('$publish).click();


    // products
    $.ajax({
        url: "https://api.bigstitchy.com/api/products?search=headwear",
        type: "GET",
        success: function(data) {
            const prod = data.filter(d => (d.styleID == styleID));
            window.localStorage.setItem('clothing-designer', JSON.stringify(data));
            titleInput.value = prod[0].title;
            tinyMCE.activeEditor.setContent(prod[0].description);
        }
    });

    // styles
    $.ajax({
        url: `https://api.bigstitchy.com/api/products?style_id=${styleID}`,
        type: "GET",
        success: function(data) {
            basePrice.value = parseFloat((data[0].salePrice));
            set_price_total();
        }
    });
    
    tinymce.init({
        selector: '#description',
        toolbar: false,
        menubar:false,
        statusbar: false,
        plugins: [ 'quickbars' ],
    });

    var $yourDesigner = $('#clothing-designer'), pluginOpts = {
        productsJSON: [[{
            "elements": [{
                "type": "image",
                "source": "https://cdn.ssactivewear.com/Images/Color/"+colorSwatchImage+".jpg",
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
            'top': ['snap', 'preview-lightbox'],
            'right': ['magnify-glass', 'zoom', 'reset-product', 'ruler'],
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
});