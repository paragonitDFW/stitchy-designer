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
const embroideryType = document.querySelector('select#embroidery-type');
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
        if(modalAlert.innerHTML === "The product is successfully submitted!") {
          window.parent.postMessage(
            JSON.stringify({
              error: false,
              message: 'close modal'
            }),
            '*'
          );
        }
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
const isDiscounted = JSON.parse(getUrlParam('discounted')) || false;

let grand_total = 0;

jQuery(document).ready(function(){

    if ( category != 'headwear' ) {

      $('.embroi').hide();

    }

    let price_embroidery;
    const embroideryType = $('select#embroidery-type');
    const price_total = $('#base-price-total');

    //set total 
    function set_price_total(){

      if(embroideryType.val() === 'flat') {
          price_embroidery = 7.5;
      } else {
          price_embroidery = 9.5;
      }
      const price_shipping = parseFloat(4);
      const price_product = parseFloat(basePrice.value);
      const price_markup = parseFloat(3);

      if ( window.localStorage.getItem('userType') == 'Founder' ) {

        price_markup = 0;

      }

      grand_total = (price_embroidery + price_shipping + price_product + price_markup).toFixed(2);

      if(isDiscounted) {
        grand_total-=1;
        price_total.html(`${parseFloat(grand_total)} <del style='color: #c9c9c9;'>$${parseFloat(grand_total)+1}</del>`);
      } else {
        grand_total-=0; // this somehow convert grand_total to an integer
        price_total.html(grand_total);
      }
      
      $('#price').val((parseFloat(grand_total)+parseFloat(grand_total)*.3).toFixed(2));

      const expected_profit = (parseFloat($('#price').val()) - parseFloat(grand_total)).toFixed(2);
      $('#expected-profit').html(expected_profit);

    } // end of set_price_total()

    $('#price').keyup(function(){
      const expected_profit = (parseFloat($('#price').val() || 0) - parseFloat(grand_total)).toFixed(2);
      $('#expected-profit').html(expected_profit);
    });

    $('#price').change(function(){
      $(this).val( parseFloat($(this).val() || 0).toFixed(2));
    });

    embroideryType.change(function(){
      
      if(embroideryType.val() === 'flat') {

        grand_total -= 2

        const price = parseFloat($('#price').val()) - 2;
        $('#price').val((price).toFixed(2));
        
        const expected_profit = (parseFloat($('#price').val()) - parseFloat(grand_total)).toFixed(2);
        $('#expected-profit').html(expected_profit);

        if(isDiscounted) {
          price_total.html(`${parseFloat(grand_total)} <del style='color: #c9c9c9;'>$${parseFloat(grand_total)+1}</del>`);
        } else {
          price_total.html((parseFloat(grand_total)).toFixed(2));
        }

      } else {

        grand_total += 2

        const price = parseFloat($('#price').val()) + 2;
        $('#price').val((price).toFixed(2));
        const expected_profit = (parseFloat($('#price').val()) - parseFloat(grand_total)).toFixed(2);
        $('#expected-profit').html(expected_profit);

        if(isDiscounted) {
          price_total.html(`${parseFloat(grand_total)} <del style='color: #c9c9c9;'>$${parseFloat(grand_total)+1}</del>`);
        } else {
          price_total.html((parseFloat(grand_total)).toFixed(2));
        }

      }

    }); // end of embroideryType

    function loadProductData(){
      // style
      if(!designID) { // execute only if it's not in edit mode
        $.ajax({
            url: `https://api.bigstitchy.com/api/products/${provider}/styles/${styleID}`, // for description and title
            type: "GET",
            headers: {
              'Authorization': `Bearer ${token}`
            },
            success: function(style) {
                window.localStorage.setItem('clothing-designer', JSON.stringify([style]));
                titleInput.value = style.title;
                tinyMCE.activeEditor.setContent(style.description);
            }
        });
      }
    } // end of loadProductData()

    // products
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
          success: function(products) {
              // get the specific variant base on the colorCode
              variant = products.filter(product => {
                return product.colorCode === colorCode
              });
              basePrice.value = parseFloat(variant[0].customerPrice)
              set_price_total();
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

    /* ADD TEXT button clicked */
    $('body').on('click', '.fpd-btn', function(){

      if( $(this).children().first().text() === 'Add Text' ) {

        $('.fpd-icon-close').click();

      }

    });


    // ADD IMAGE AND IMG CLICK
    $('body').on('click', '.fpd-item', function(){
      const firstEle = $(this).children().first();
    
      if (firstEle.is('picture')) {

        $('.fpd-icon-close').click();

      }

    });
    //$('.modal').removeClass('show');

    let elements = [
      {
        type: "image",
        source: "https://cdn.ssactivewear.com/Images/Color/"+colorSwatchImage+".jpg",
        title: "Base",
        parameters: {
            draggable: false,
            autoCenter: true,
        }
      }];

    if (category == 'shirts') {
      elements.push({
        type: "image",
        source: "images/stitchy/logo-placeholder.png",
        title: "Logo",
        parameters: {
            left: 250,
            top: 110,
            uploadZone: true,
            uploadZoneMovable: true
        }
      });
    }

    var $yourDesigner = $('#clothing-designer'), pluginOpts = {
        productsJSON: [[{
          elements: elements
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
            {name: 'Pacifico', url: 'google'},
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
            localStorage.removeItem('clothing-designer')
            yourDesigner.loadProduct(design[0].product);
            titleInput.value = design[0].title;
            tinyMCE.activeEditor.setContent(design[0].description);
            $('#price').val(design[0].price);
            basePriceTotal.innerHTML = design[0].cost;
            grand_total = design[0].cost;
            variant = design[0].variants;
            const expected_profit = (parseFloat($('#price').val()) - parseFloat(grand_total)).toFixed(2);
            $('#expected-profit').html(expected_profit);
            embroideryType.val(design[0].embroidery_type)
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
