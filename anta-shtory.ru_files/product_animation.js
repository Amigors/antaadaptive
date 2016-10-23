/**
 * Created with JetBrains PhpStorm.
 * User: a
 * Date: 04.09.13
 * Time: 11:48
 * To change this template use File | Settings | File Templates.
 */

function animateImage(source_id, target_id, itemsCount, dataType) {


    if (window.isPreviewOpened) {
        var CartInfo = $('#product-cart button.do-buy');
        var GIInfo = $('#product-cart div.photo img.-active');
    } else {
        var CartInfo = $("div#product-item-" + target_id + " button.do-buy" + ((dataType.length > 0) ? '#'+target_id+'-'+dataType: ''));
        var GIInfo = $('div#product-item-' + target_id).find('img.-active').not('img.cycle-sentinel');
    }
    var offset= CartInfo.offset();
    var CartInfo_left = offset.left;
    var CartInfo_top = offset.top;

    var ImageID = source_id;
    if (window.isPreviewOpened) {
        var URLImageID = $('#product-cart div.photo img.-active').attr('src');
    } else {
        var URLImageID = $('div#product-item-' + target_id).find('img.-active').not('img.cycle-sentinel').attr('src');
    }

    var step = 10;

    //var GIInfo = $("#tabContent-" + source_id + " div.active img");
    var offset= GIInfo.offset();
    var GIleft = offset.left;
    var GItop = offset.top;
    var GIwidth = GIInfo.width();
    var GIheight = GIInfo.height();

    var GIwidth1 = GIwidth+step;
    var GIheight1 =  GIwidth1 / (GIwidth / GIheight);


    if (window.isPreviewOpened) var GIheight2 =  25;
    else var GIheight2 =  30;

    var GIwidth2 = GIheight2 / (GIheight / GIwidth);

    var DublicateImageID = 'Dublicate' + source_id;
    var DublicateImage = '<img id="' + DublicateImageID + '" style="border: 1px solid #333333; display: block; z-index:10000; position: absolute;' +
        'left: ' + GIleft + 'px; top: ' + GItop + 'px; ' +
        'width: ' + GIwidth + 'px; height: ' + GIheight + 'px;" ' +
        'src = "' + URLImageID + '" />';

    if (!$('#' + DublicateImageID).length) {
        $('body').prepend(DublicateImage);
    }

    var step_right = Math.abs(GIleft - (GIleft - CartInfo_left));
    var step_top = Math.abs(GItop - (GItop - CartInfo_top));

    $('#' + DublicateImageID).animate
    (
        { width: GIwidth1+ "px", height: GIheight1 + "px", left: GIleft-step + "px", top: GItop-step + "px" },
        'fast',
        function ()
        {
            $('#' + DublicateImageID).animate
            (
                { width: GIwidth2 + "px", height: GIheight2 + "px", opacity: "0.4", left: + step_right  + "px", top: + step_top + "px" },
                'slow',
                function()
                {
                    $('#' + DublicateImageID).animate
                    (
                        { opacity: "0" },
                        '100',
                        function ()
                        {
                            if (window.isPreviewOpened) {
                                CartInfo.fadeTo(200,0).fadeTo(200,1);
                            } else {
                                var pulsateDiv = createPulsateDiv();

                                CartInfo.fadeTo(200, 0.8).fadeTo(200, 0).fadeTo(200, 0.6).fadeTo(200, 1, function(){});


                                }
                            showPulsateDiv();
                           $('#' + DublicateImageID).remove();
                        }
                    );
                   /* setTimeout(function(){
                        var afterBuyHtml = '<span  style="font-size: 13px;">Товар в корзине, <a href="/order/register">оформить заказ?</a></span>';
                        var parent = "";
                        var target = "";
                        if (window.isPreviewOpened) {
                           parent = CartInfo.parent();
                           target = CartInfo;
                        } else {
                            target = $("div.actions button.add-to-cart-button");
                            parent = target.parent();
                        }
                        target.remove();
                        parent.prepend(afterBuyHtml);
                        parent.css("padding-bottom", "10px");
                    }, 1000);*/
                }
            );
        }
    );
};

function createPulsateDiv()
{
    var divId = window.isMenuFloating ? "floatingPulsateDiv" : "in-contentPulsateDiv";
    if ($("div#" + divId).attr("id") != undefined) {
        return $("div#" + divId);
    }
    var menuSelector = window.isMenuFloating ? "floating" : "in-content";
    var CartInfo = $("div." + menuSelector + " table.buttons td.cart");
    var pulseDivPadding = window.isMenuFloating ? "margin-left:-5px; padding:0 5px;" : "";

    var pulsateDiv =
        '<div style="background-color: #53C00A; position: absolute;' +
            ' width: '+CartInfo.width()+'px; opacity: 0;'+ pulseDivPadding +'" id="'+divId+'">.</div>';

    CartInfo.prepend(pulsateDiv);

    return $("div#" + divId);
}

function showPulsateDiv()
{
    var pulsateDiv = createPulsateDiv();
    var bagItemsCount = parseInt($("span.count:first").text());

    if (bagItemsCount > 0) {
        $(pulsateDiv).fadeTo(200, 0.4);
    } else {
        $(pulsateDiv).fadeTo(200, 0);
    }


};
