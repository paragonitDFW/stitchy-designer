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
                saveBtn.style.opacity = '0'
                saveBtn.style.position = 'absolute'
                saveBtn.style.visibility = 'hidden'
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
const basePriceTotal = document.querySelector("#base-price-total");
const modal = document.querySelector(".modal");
const closeModal = document.querySelectorAll(".close-modal");
const modalAlert = document.querySelector("#alert");
const costInventory = document.querySelector("#cost-inventory");
let variants;
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
const shop_token = getUrlParam('shop');
const token = getUrlParam('token');
const styleID = getUrlParam('style_id');
const colorCode = getUrlParam('colorCode');
const colorSwatchImage = getUrlParam('image');
const designID = getUrlParam('design_id');
const category = getUrlParam('category');
const provider = getUrlParam('provider');

let grand_total = 0;

jQuery(document).ready(function(){

    let price_embroidery;
    //set total 
    function set_price_total(){
      if($('select#embroidery-type').val() === 'flat') {
          price_embroidery = 7.5;
      } else {
          price_embroidery = 9.5;
      }
      const price_shipping = parseFloat(4);
      const price_product = parseFloat(basePrice.value);
      const price_markup = parseFloat(3);
      const price_total = $('#base-price-total');

      if ( window.localStorage.getItem('userType') == 'Founder' ) {

        price_markup = 0;

      }

      grand_total = (price_embroidery + price_shipping + price_product + price_markup).toFixed(2);
      price_total.html(grand_total);
      $('#price').val((parseFloat(grand_total)+parseFloat(grand_total)*.3).toFixed(2));
      $('#cost-inventory').val(grand_total);

    } // end of set_price_total()

    function change_price_total(){
      if($('select#embroidery-type').val() === 'flat') {
        const price = parseFloat($('#price').val()) - 2;
        $('#price').val((price).toFixed(2));
        } else {
          const price = parseFloat($('#price').val()) + 2;
          $('#price').val((price).toFixed(2));
        }
    }

    $('select#embroidery-type').change(function(){
      
      change_price_total();

    }); // end of $('select#embroidery-type')

    $('#price').change(function(){
      $(this).val( parseFloat($(this).val()).toFixed(2) );
    });
     
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
            "metafields": [
              {
                "key": "stitchy_product",
                "value": "true",
                "value_type": "string",
                "namespace": "global"
              },
              {
                "key": "stitchy_cost",
                "value": 30,
                "value_type": "integer",
                "namespace": "global"
              }
            ],
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
          url: "https://api.bigstitchy.com/api/shop-products",
          type: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: { key: shop_token, payload: product_data },
          success: function( data ) {
            inventoryUpdate(data.variants[0].inventory_item_id);
            $('.modal').addClass('show');
            $('.modal__inner p').text('Store Product Successfully Created!');
          },
          error: function( data ){
            console.log(data.responseText);
          }
        });

        function inventoryUpdate( variant_id ){

          $.ajax({
            url: "https://api.bigstitchy.com/api/shop-inventory-update",
            type: "POST",
            headers: {
              'Authorization': `Bearer ${token}`
            },
            data: { key: shop_token, variant_id: variant_id, cost: costInventory.value },
            success: function( data ) {
              console.log(JSON.stringify(data));
            },
            error: function( data ){
              console.log(data.responseText);
            }
          });

        }



      }); // end of yourDesigner.getProductDataURL(function(dataURL)

    }); // end of $('$publish).click();


    function loadProductData(){
      // products
      if(!designID) { // execute only if it's not in edit mode
        $.ajax({
            url: `https://api.bigstitchy.com/api/products/${provider}/styles/`, // for description and title
            type: "GET",
            data: {
              search: category
            },
            headers: {
              'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                const prod = data.filter(d => (d.styleID == styleID));
                window.localStorage.setItem('clothing-designer', JSON.stringify(data));
                titleInput.value = prod[0].title;
                tinyMCE.activeEditor.setContent(prod[0].description);
                console.log(data);
            }
        });
      }
    } // end of loadProductData()

    // styles
    if(!designID) { // execute only if it's not in edit mode
      $.ajax({
          url: `https://api.bigstitchy.com/api/products/${provider}/`, // for style details 
          type: "GET",
          data: {
            style_id: styleID
          },
          headers: {
            'Authorization': `Bearer ${token}`
          },
          success: function(data) {

              basePrice.value = parseFloat((data[0].customerPrice));
              set_price_total();
              console.log(data);
              variants = data.filter(d => {
                return d.colorCode === colorCode
              });
              data.forEach(d => {
                console.log(d.sku, d.colorCode, d.color1, d.sizeCode, d.sizeName);
              })
          }
      });
    }

    tinymce.init({
      selector: '#description',
      toolbar: false,
      menubar:false,
      statusbar: false,
      plugins: [ 'quickbars' ],
      init_instance_callback : function() {
        $('.modal').removeClass('show');
        $('.modal__inner p').text('');
        $('.close-modal').removeClass('hide');
        loadProductData();
      }
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
        stageWidth: 400,
        stageHeight: 400,
        editorMode: false,
        smartGuides: false,
        fitImagesInCanvas: true,
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
            boundingBox: "Base",
            maxW: 5000,
            maxH: 5000
        },
        actions:  {
            'left': ['undo','redo','magnify-glass', 'zoom', 'reset-product', 'ruler', 'snap'],
            'bottom': ['manage-layers', 'save']
        },
        mainBarModules: ['images', 'text', 'manage-layers']
    },
    yourDesigner = new FancyProductDesigner($yourDesigner, pluginOpts);
    
    // Load design using design_id url params
    if(!!designID) {
      $('.close-modal').addClass('hide');
      $('.modal').addClass('show');
      $('.modal__inner p').text('Loading your design, please wait...');
      document.querySelector('#cta').innerHTML = 'Save changes';
      // load design
      $.ajax({
        url: `https://api.bigstitchy.com/api/accounts/attachments`,
        type: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        success: function(data) {
          const design = data.filter(d => {
            return d.id == designID
          })

          // actual rendering to UI
          if(!!design) {
            console.log(design[0]);
            yourDesigner.loadProduct(design[0].product);
            titleInput.value = design[0].title;
            console.log(tinyMCE.activeEditor);
            tinyMCE.activeEditor.setContent(design[0].description);
            $('#price').val(design[0].price);
            basePriceTotal.innerHTML = design[0].cost;
            grand_total = design[0].cost;
            costInventory.value = design[0].cost_inventory;
            variants = design[0].variants;
          }
          
          $('.modal').removeClass('show');
          $('.modal__inner p').text('');
          $('.close-modal').removeClass('hide');
        }
      });
    }

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
