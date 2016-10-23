var isPreviewOpened = false;
var initializeProductPreview,initializePhotoCarousel;
var stopInfiniteScroll = false;
(function() {
// init for product data ajax load
    function initProductSubLoad()
    {
        $('body').delegate('.sub-load','click', function(){
            var productId = $(this).data('item');
            var data = getProductData(productId,this);


            return false;
        });
    }
    function updateProductData(data,link)
    {
        data = $(data);

        if (!isPreviewOpened) {
            //url
            window.history.replaceState({},'','product'+$(link).data('item')+'.html');
            // page title
            $('title').text(data.find('h1.headline').text());
        }
        //pagination
        $('div.breadcrumbs span').html(data.find('div.breadcrumbs span').html());
        // article
        $('div.property.-article span.value').html(data.find('div.property.-article span.value').html());
        // h1
        $('h1.headline').text(data.find('h1.headline').text());
        // short description
        $('div.property.short-desc span.value').html(data.find('div.property.short-desc span.value').html());
        // full description
        $('div.property.desc span.value').html(data.find('div.property.desc span.value').html());
        $('div.property.desc').niceScroll({cursorcolor:'#5e87c3',autohidemode:'scroll'}).resize();
        // consist of
        $('div.property.consist span.value').html(data.find('div.property.consist span.value').html());
        // size
        $('div.property.size span.value').html(data.find('div.property.size span.value').html());
        // stock
        $('div.stock').html(data.find('div.stock').html());
        // old price
        if ($('div.property.oldPrice').length) {
            if (data.find('div.property.oldPrice').length) {
                // if current and next product has old price, replace price
                $('div.property.oldPrice span.old-price-preview').html(data.find('div.property.oldPrice span.old-price-preview').html());
            } else {
                // if current product has old price, but next doesn't, remove div with old price
                $('div.property.oldPrice').remove();
            }
        } else {
            if (data.find('div.property.oldPrice').length) {
                // if current product doesn't have old price, but next product has, add div with old price from data, before div with actual price
                var oldPriceDiv = data.find('div.property.oldPrice');
                oldPriceDiv.insertBefore('div.actual-price');
            }
        }
        // change product-information div's id to next product id
        $('div.product-information').attr('id','product-item-'+$(link).data('item'));
        // actual price
        $('div.actual-price div.price').html(data.find('div.actual-price div.price').html());
        // buy button
        $('button.do-buy').attr('id', $(link).data('item'));
        if ($('div.actual-price p.added').length > 0) {
            $('div.actual-price p.added').remove();
            $('button.do-buy').show();
        }

        if ($(link).data('type') == 'size') {
            // size box
            // if user clicked on size, we must deselect current size box and select next size
            $('div.size-list span.value label').removeClass('-active');
            $('div.size-list span.value').find('input#'+$(link).parent().attr('for')).click(); // click radio of next size
            $(link).parent().addClass('-active');
            $('div.size-list span.value label a').addClass('sub-load');
            $(link).removeClass('sub-load');
            //textile box
            $('div.slider.textile-selector div.slider-carousel').html($(data).find('div.slider.textile-selector div.slider-carousel').html());
            //image box
            if (!isPreviewOpened) {
                // product card
                $('div.photo.photo-item').html(data.find('div.photo.photo-item').html());
                $('div.product-cart div.photo-carousel1').find('div.image-wrapper').each(function(){
                    $(this).zoom({url:$(this).find('img').attr('big-img')});
                });
                $('ul.photo-pagination li>a>img').each(function(){
                    $(this).unbind('click');
                    $(this).on('click',function(){
                        return setBigPhoto(this);
                    });
                });
                setBigPhoto($('ul.photo-pagination li>a>img:first'));
            } else {
                // product preview
                $('div.product-preview-cart div.photo div.photo-carousel').html(data.find('div.photo div.photo-carousel').html());
                $('div.product-preview-cart div.basic ul.photo-pagination').html(data.find('div.basic ul.photo-pagination').html());
                $(".product-preview-cart .photo-carousel").data('cycle.opts','');
                $(".product-preview-cart .photo-carousel").each(function() {
                    return initializePhotoCarousel.call(this);
                });
                $('div.photo-pagination.-popup').niceScroll({cursorcolor:'#5e87c3'});
            }

        } else if ($(link).data('type') == 'textile') {
            //if user clicked on textile or image, replace current product size data with size data from next product
            $('div.size-list').html(data.find('div.size-list').html());
            $(link).parent().find('a').addClass('sub-load').removeClass('slider-item-active');
            $(link).addClass('slider-item-active').removeClass('sub-load');
            //image box
            if (!isPreviewOpened) {
                // product card
                $('div.photo.photo-item').html($(data.find('div.photo.photo-item').html()));
                $('div.product-cart div.photo-carousel1').find('div.image-wrapper').each(function(){
                    $(this).zoom({url:$(this).find('img').attr('big-img')});
                });
                $('ul.photo-pagination li>a>img').each(function(){
                    $(this).unbind('click');
                    $(this).on('click',function(){
                        return setBigPhoto(this);
                    });
                });
                setBigPhoto($('ul.photo-pagination li>a>img:first'));
            } else {
                // product preview
                $('div.product-preview-cart div.photo div.photo-carousel').html(data.find('div.photo div.photo-carousel').html());
                $('div.product-preview-cart div.basic ul.photo-pagination').html(data.find('div.basic ul.photo-pagination').html());
                $(".product-preview-cart .photo-carousel").data('cycle.opts','');
                $(".product-preview-cart .photo-carousel").each(function() {
                    return initializePhotoCarousel.call(this);
                });
            }
            setBigPhoto($('ul.photo-pagination li>a>img:first'));
        } else if ($(link).data('type') == 'photo') {
            // change size list
            $('div.size-list').html(data.find('div.size-list').html());
            // change textile-list
            $('div.slider.textile-selector div.slider-carousel').html($(data).find('div.slider.textile-selector div.slider-carousel').html());
            // image box
            // search all link-images, if image links to another product, add class sub-load
            $(link).parent().parent().find('li a').each(function(){
                if ($(this).data('item') != $(link).data('item')) $(this).addClass('sub-load');
            });
            $(link).removeClass('sub-load');
        }
        $('div.photo-pagination.-card').niceScroll({cursorcolor:'#5e87c3'}).resize();

    }
    function getProductData(id,link)
    {
        $.post('/subload/',{id:id,preview:isPreviewOpened})
            .done(function(data){
                updateProductData(data,link);
            });
    }
    initProductSubLoad();

}).call(this);
function setBigPhoto(smalImg)
{
    if ($(smalImg).attr('big-img') != undefined){
        $(smalImg).parents('ul').find('li.-active').removeClass('-active');
        $('div.product-cart div.photo-carousel1').find('img.-active').removeClass('-active');
        $(smalImg).parent().parent().addClass('-active');
        var img = $('div.product-cart div.photo-carousel1').find('img#'+$(smalImg).attr('big-img'));
        img.addClass('-active');
    }
}
(function() {
    var addGetParam;

    addGetParam = function(key, value, search) {
        var c, isSortInGet, kvp, x;
        c = void 0;
        isSortInGet = void 0;
        kvp = void 0;
        x = void 0;
        kvp = void 0;
        x = void 0;
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
        kvp = search.substr(1).split("&");
        kvp = kvp.filter(function(n) {
            return n !== "";
        });
        isSortInGet = false;
        x = void 0;
        c = 0;
        while (c < kvp.length) {
            x = kvp[c].split("=");
            if (x[0] === key) {
                x[1] = value;
                kvp[c] = x.join("=");
                isSortInGet = true;
                break;
            }
            c++;
        }
        if (!isSortInGet) {
            kvp.push(key + "=" + value);
        }
        return "?" + kvp.join("&");
    };

    deleteGetParam = function(key, search) {
        var c, kvp, x;
        c = 0;
        kvp = void 0;
        x = void 0;
        key = encodeURIComponent(key);
        kvp = search.substr(1).split("&");
        kvp = kvp.filter(function(n) {
            return n !== "";
        });
        while (c < kvp.length) {
            x = kvp[c].split("=");
            if (x[0] === key) {
                kvp.splice(c, 1)
                break;
            }
            c++;
        }
        return kvp.length > 0 ? "?" + kvp.join("&") : '';
    };


    $(document).ready(function() {
        // close button on floating div
        $('.float-div .close').on('click', function(){
            $('.float-div').css('opacity', 0);
            // set cookie
            var date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // for 1 year
            var expires = "; expires=" + date.toGMTString();
            document.cookie = "hideFloat=1" + expires + "; path=/";

            return false;
        });

        $('select[name="order_by"]').bind("change", function() {
            return document.location.href = addGetParam("sort", $($(this).find('option:selected')[0]).attr('value'),document.location.search);
        });
        $('div.product-cart div.photo-carousel1').find('div.image-wrapper').each(function(){
           $(this).zoom({url:$(this).find('img').attr('big-img')});
        });


        $('ul.photo-pagination li>a>img').each(function(){
            $(this).unbind('click');
            $(this).on('click',function(){
                return setBigPhoto(this);
            });
        });
        setBigPhoto($('ul.photo-pagination li>a>img:first'));
        // atelier
        if ($("#example-basic").length > 0) {
            $("#example-basic").steps({
                headerTag: "h3",
                bodyTag: "section",
                transitionEffect: "fade",
                autoFocus: true,
                enableFinishButton: false,
                loadingTemplate: '<span class="spinner"></span> #text#',
                labels: {
                    next: 'Далее',
                    finish: 'Завершить',
                    current: ''
                },
                startIndex: 1,
                onTop: true,
                onStepChanging: function (event, currentIndex, newIndex) {  return changeStep(currentIndex,newIndex);},
                onStepChanged: function (event, currentIndex, newIndex) {  return modelDescriptionInit(currentIndex,
                    newIndex);}
            });
        }


        function changeStep(currentIndex,newIndex) {
            var newId = newIndex;
            var oldId = currentIndex;
            if (newId == 0) return false;
            else if (newId == 4) $('div.wizard>div.actions').hide();
            else $('div.wizard>div.actions').show();

            // collect selected data for current step
            switch (oldId)
            {
                case 1:
                {
                    var data = {
                        size: $('section.current input:radio[name="size"]:checked').data('id'),
                        forRoom: $('section.current input:radio[name="forRoom"]:checked').data('id')
                    };
                    break;
                }
                case 2:
                {
                    var data = {
                        textile: $('section.current input:radio[name="textile"]:checked').data('id'),
                        material: $('section.current input:radio[name="material"]:checked').data('id')
                    };
                    var pagination = [];
                    if ($('section.current input:radio[name="textile"]:checked').length > 0 &&
                        $('section.current div.pagination').length > 0) {
                        var temp = {
                            textileCheckedPage: $('section.current div.pagination span.item.-active').text()
                        };
                        pagination.push(temp);
                        $.extend(data,pagination[0]);
                    }

                    break;
                }
                case 3:
                {
                    var data = {
                        model: $('section.current input:radio[name="model"]:checked').data('id')
                    };
                    var pagination = [];
                    if ($('section.current input:radio[name="model"]:checked').length > 0 &&
                        $('section.current div.pagination').length > 0) {
                        var temp = {
                            modelCheckedPage: $('section.current div.pagination span.item.-active').text()
                        };
                        pagination.push(temp);
                        $.extend(data,pagination[0]);
                    }
                    break;
                }
            }
            $.post(
                '/atelier/step/'+oldId + 'x' + newId+'/',
                {data:data}
            ).done(function(data){
                    if (data.length <= 0) return false;
                    $($('section.atelier')[newId-1]).html(data);
                    if (newId == 4) {
                        if ($($('section.atelier')[newId-1]).find('.photo-carousel').length > 0) {
                            var owner = $(".photo-carousel").parent().parent();
                            $(".photo-carousel").cycle({
                                log: false,
                                pagerEvent: "click.cycle mouseover",
                                fx: "fade",
                                speed: 100,
                                timeout: 0,
                                pauseOnHover: true,
                                paused: true,
                                pager: owner.find(".photo-pagination"),
                                pagerTemplate: "",
                                pagerActiveClass: "-active",
                                slides: ".photo-slide",
                                slideClass: "photo-slide",
                                slideActiveClass: "-active"
                            });
                        }
                    }
                    initAtelierImagePreview();
                });
            if (newId == 3) modelDescriptionInit(3,null);
            return true;
        }

        function setModelDescription(checked,radioButton)
        {
            if (checked)
                var descriptionDiv = $($('section div.step-content div.block.-models-list').find('input:radio:checked')).parents('div.block.-models-list').find('~');
            else
                var descriptionDiv = $($('section div.step-content div.block.-models-list').find('input:radio')[0]).parents('div.block.-models-list').find('~');

            descriptionDiv.find('>p.model-name').html($(radioButton).data('name'));
            descriptionDiv.find('>p.model-description').html($(radioButton).data('description'));
            if ($(radioButton).data('name').length > 0)
                descriptionDiv.find('>p.model-name').show();
            else
                descriptionDiv.find('>p.model-name').hide();
        }

        function modelDescriptionInit(currentIndex,newIndex)
        {
            if (currentIndex != 3) return true;

            $('section.current').delegate('div.block.-models-list input:radio','click',function(){
                setModelDescription(false, this);
            });
            if ($('section.current div.block.-models-list input:radio:checked').length > 0)
                setModelDescription(true,$('section.current div.block.-models-list input:radio:checked'));
            else
                $('section.current div.block.-models-list input:radio:first').click();

            return true;
        }

        function setPaginationLinkEventHandler()
        {
            $('section').delegate('div.pagination a', 'click', function(){
                var that = this;
                var params = $(this).parents('.links').find('#getParams').val();
                $.ajax(
                    $(that).attr('href'),
                    {
                        type: 'POST',
                        data : {params: params}
                    }
                ).done(function (data) {
                        if (!data.length) return false;

                        $('section.current div.step-content').replaceWith($(data));
                        initAtelierImagePreview();
                    });
                return false;
            });
        }
        if (document.location.href.indexOf('atelier') != -1)
            setPaginationLinkEventHandler();

        /**
         * Init image preview in atelier steps
         */
        function initAtelierImagePreview()
        {
                $('div.step-content div.grid-option').on('mouseenter', 'label', function(){
                    var imageDiv = $('#atelierImageHover');
                    var sourceImgSrc = $(this).find('img').attr('src');
                    var destImageSrc = sourceImgSrc.replace('90x90', '460x460');
                    $('<img>').attr('src',destImageSrc).appendTo(imageDiv);

                    if ($(this).parent().position().left > $(window).width()/2) {
                        imageDiv.addClass('-left');
                        imageDiv.removeClass('-right');
                    }
                    else {
                        imageDiv.addClass('-right');
                        imageDiv.removeClass('-left');
                    }
                    imageDiv.addClass('-hover');
                });
            $('div.step-content div.grid-option').on('mouseleave', 'label', function(){
                $('#atelierImageHover').removeClass('-hover').html('');
            })
        }

        // atelier

        $('section.-promo').delegate('a#showMore','click', function(){
            event.preventDefault();
            var listHeight = 535;
            if ($(this).data('on') == 0) {
                var height = 42; // compensation for headline div
                $('section.-promo div.offers div.list').each(function(){
                    height += parseInt($(this).height()) + parseInt($(this).css('margin-bottom'));
                });
                $('section.-promo div.offers').animate(
                    {
                        height: height
                    },
                    'medium'
                );
                $(this).data('on',1);
                $(this).text('Меньше предложений');
            } else {
                $('section.-promo div.offers').animate(
                    {
                        height: listHeight
                    },
                    'medium'
                );
                $(this).data('on',0);
                $(this).text('Больше предложений');
            }

            return false;
        });

        /**
         * Add current selected checkbox value to selected list
         *
         * @param element
         */
        function checkFilterHiddenValues(element)
        {
            var hidden = $(element).parents('div.filter-section').find("input[type=\"hidden\"]").not('#getParams');
            var arHidden = $(hidden).val().split(',');
            if ($(element).prop('checked')) {

                arHidden.push($(element).data('value'));
                arHidden = array_unique(arHidden);
                arHidden = arHidden.filter(Number);
                $(hidden).val(arHidden.join(','));
            } else {
                var arTemp = Array();
                for (var el in arHidden) {
                    if (arHidden[el] != $(element).data('value')) arTemp.push(arHidden[el]);
                }
                $(hidden).val(arTemp.join(','));
            }
        }


        $('#product-filter div.filter-section').delegate('input:checkbox','change', function(){
        //$('#product-filter :checkbox').change(function(){

            $('div.product-list div.product-list-overlay').toggleClass('-visible');
            checkFilterHiddenValues(this);
            var getParams, i, res;
            res = "";
            var filterForm = $(this).parents('form');
            $(filterForm).find('div.filter-section').each(function() {
                var checkedVals, hidden;
                hidden = $(this).find("input[type=\"hidden\"]").not('#getParams');
                checkedVals = $(hidden).val().split(',');
                checkedVals=checkedVals.filter(Number);

                if (checkedVals.length > 0) {
                    checkedVals = array_unique(checkedVals);
                    hidden.val(checkedVals.join(","));
                    var search = res != undefined ?res:"";
                    res = addGetParam(hidden.prop("name"), checkedVals.join(","),search);
                }
            });
            getParams = document.location.search.substr(1).split("&");
            i = 0;
            while (i < getParams.length) {
                val = getParams[i].split("=");
                if (val[0] === "sort") {
                    $("#filterSortField").val(val[1]);
                }
                i++;
            }
            /*if ($("#filterSortField").val().length <= 0) {
                $("#filterSortField").remove();
            }*/
            //document.location.href = document.location.origin + document.location.pathname + res;
            var url = document.location.origin + document.location.pathname + res;
            history.pushState({data: 'filter#',url: url}, null, url);
            filterAjaxCall(url);
        });

        function filterAjaxCall(url)
        {
            $.ajax({
                url: url
            }).done(function(data){
                if (data) {
                    data = JSON.parse(data);
                    $('h1.title span.tip span.products-count').text(data.count);
                    $('section.column2 div.product-list div.list').html(data.html);
                    // initialize photo carousel for item photos
                    $(".photo-carousel").not('.-loaded').each(function() {
                        $(this).addClass('-loaded');
                        return initializePhotoCarousel.call(this);
                    });
                    // initialize product preview
                    var list = $(".product-item").not('.-loaded').find('.product-preview');
                    list.each(function() {
                        $(this).parents('div.product-item').addClass('-loaded');
                        return $(this).attr("data-fancybox-group", "product-list").attr("rel", "product-list");
                    });
                    initializeProductPreview(list);
                }
                $('div.product-list div.product-list-overlay').toggleClass('-visible');
            });
        }

        /**
         * Look for filter values in GET params and check appropriate checkboxes in catalog filter
         */
        function checkFields()
        {
            if (document.location.search.length > 0) {
                var type, popupType, values;
                var getParams = document.location.search.substr(1).split("&");
                var i = 0;
                $('#product-filter :checkbox:checked').prop('checked', false);
                if (getParams.length > 0) {
                    while (i < getParams.length) {
                        var key = getParams[i].split('=');
                        if (key.length > 0) {
                            type = key[0].replace('rel_','').replace('_id',''); // convert rel_textile_id to textile
                            if (type.length > 0) {
                                values = decodeURIComponent(key[1]).split(',');
                                if (values.length == 1) {
                                    type += '-' + values; // get textile-13
                                    popupType = '-popup-' + values; // get textile-popup-13
                                    if ($('#'+type).length > 0) {
                                        $('#'+type).prop('checked', true);
                                    }
                                    if ($('#'+popupType).length > 0) {
                                        $('#'+popupType).prop('checked', true);
                                    }
                                } else if (values.length > 1) {
                                    var x = 0;
                                    while (x < values.length) {
                                        if (values[x].length > 0) {
                                            if ($('#'+ type + '-' + values[x]).length > 0) {
                                                $('#'+type + '-' + values[x]).prop('checked', true);
                                            }
                                            if ($('#'+type + '-popup-' + values[x]).length > 0) {
                                                $('#'+type + '-popup-' + values[x]).prop('checked', true);
                                            }
                                        }
                                        x++;
                                    }
                                }
                            }
                        }
                        i++;
                    }
                }
            }
        }

        /**
         * According to current GET filter params, fill hidden fields
         * Used in window.popstate event
         */
        function fillHiddenFields()
        {
            var value;
            var getParams = document.location.search.substr(1).split("&");
            var i = 0;
            $('#product-filter :hidden').val('');
            if (getParams.length > 0) {
                while (i < getParams.length) {
                    var key = getParams[i].split('=');
                    if (key.length > 0) {
                        value = decodeURIComponent(key[1]);
                        $('#product-filter input[name="' + key[0] + '"]').val(value);
                    }
                    i++;
                }
            }
        }

        /**
         * When user goes back in browser at catalog page we need to update products due to filter selection on previous page,
         * so we fill hidden fields due to GET params and making ajax call.
         */
        $(window).on("popstate", function() {
            if (history.state != null && history.state.url.length > 0 && history.state.data == 'filter#') {
                $('div.product-list div.product-list-overlay').toggleClass('-visible');
                fillHiddenFields();
                filterAjaxCall(history.state.url);
                checkFields();
            } else {
                document.location.reload();
            }
        });

        $('span.clear-filter a').click(function(){
            if ($(this).data('name').length > 0) {
                if ($(this).parents('.filter-section').length > 0) {
                    $(this).parents('.filter-section').find(':checkbox:checked').prop('checked', false);
                    $(this).parents('.filter-section').find(':hidden').val('');
                }
                $('div.product-list div.product-list-overlay').toggleClass('-visible');
                var url = document.location.origin + document.location.pathname + deleteGetParam($(this).data('name'),document.location.search);
                history.pushState({data: 'filter#',url: url}, null, url);
                filterAjaxCall(url);
            }

            return false;
        });

        $(function() {});
        return $(".product-filter").productFilter({
            submitHook: function(filter) {
                /*var getParams, i, res, resGetParam;
                resGetParam = new Array();
                res = "";
                var filterForm = $(this).parents('form');
                $(filterForm).each(function() {
                    var checkedVals, hidden;
                    hidden = $(this).find("input[type=\"hidden\"]").not('#getParams');
                    checkedVals = $(hidden).val().split(',');
                    checkedVals=checkedVals.filter(Number);

                    if (checkedVals.length > 0) {
                        checkedVals = array_unique(checkedVals);
                        hidden.val(checkedVals.join(","));
                        var search = res != undefined ?res:"";
                        res = addGetParam(hidden.prop("name"), checkedVals.join(","),search);
                    } else {
                        hidden.remove();
                    }
                });
                getParams = document.location.search.substr(1).split("&");
                i = 0;
                while (i < getParams.length) {
                    val = getParams[i].split("=");
                    if (val[0] === "sort") {
                        $("#filterSortField").val(val[1]);
                    }
                    i++;
                }
                if ($("#filterSortField").val().length <= 0) {
                    $("#filterSortField").remove();
                }
                //document.location.href = document.location.origin + document.location.pathname + res;
                var url = document.location.origin + document.location.pathname + res;
                $.ajax({
                    url: url
                }).done(function(data){
                    console.log(data);
                });

                return false;*/
            },
            checkBoxSelect: function(filter, element){
                /*var hidden = $(element).parents('div.filter-section').find("input[type=\"hidden\"]").not('#getParams');
                var arHidden = $(hidden).val().split(',');
                if ($(element).prop('checked')) {

                    arHidden.push($(element).data('value'));
                    arHidden = array_unique(arHidden);
                    arHidden = arHidden.filter(Number);
                    $(hidden).val(arHidden.join(','));
                } else {
                    var arTemp = Array();
                    for (var el in arHidden) {
                        if (arHidden[el] != $(element).data('value')) arTemp.push(arHidden[el]);
                    }
                    $(hidden).val(arTemp.join(','));
                }*/
            }
        });



    });

}).call(this);
(function() {


}).call(this);
(function() {
    $.widget("anta.productFilter", {
        _create: function() {
            this.options.sections = this.options.sections || this.element.find("form#product-filter div.filter-section");
            this._initialize();
            this._disable();
            return $(window).load((function(_this) {
                return function() {
                    _this._enable();
                    return _this._makeOperable();
                };
            })(this));
        },
        _initialize: function() {
            return this.ui = {
                sections: this.element.find(".filter-section"),
                submit: this.element.find(".filter-actions .do-apply"),
                checkboxes: this.element.find("input:checkbox")
            };
        },
        _makeOperable: function() {
            this._gridSelectorOnline();
            this.element.delegate('input:checkbox', "click", (function(_this) {
                return function() {
                    if (!_this.options.checkBoxSelect) {
                        return true;
                    }
                    return _this.options.checkBoxSelect(_this,this);
                };
            })(this));
            return this.ui.submit.bind("click", (function(_this) {
                return function() {
                    if (!_this.options.submitHook) {
                        return true;
                    }
                    return _this.options.submitHook(_this);
                };
            })(this));
        },
        _gridSelectorOnline: function() {
            return this.ui.sections.each(function() {
                var $selector, $trigger, _close;
                $trigger = $(this).find(".all");
                $selector = $(this).find(".grid-selector");
                if (!$trigger.length) {
                    return;
                }
                if (!$selector.length) {
                    return $trigger.hide();
                }
                _close = function(event) {
                    return $selector.removeClass("-visible").hide();
                };
                $selector.css({
                    top: $trigger.offset().top - $selector.outerHeight() / 2 + $trigger.height() / 2 + "px",
                    left: $trigger.offset().left + $trigger.width() + 40 + "px"
                });
                $selector.bind("clickoutside", _close);
                $selector.find(".box-close").bind("click", _close);
                return $trigger.bind("click", function() {
                    $selector.addClass("-visible").toggle();
                    return false;
                });
            });
        },
        _disable: function(strict) {
            if (strict == null) {
                strict = false;
            }
            this.element.find("input").prop("disabled", true);
            this.element.find(".filter-section .all").css({
                visibility: "hidden"
            });
            return this.element.find(".filter-actions .do-apply").hide();
        },
        _enable: function(strict) {
            if (strict == null) {
                strict = false;
            }
            this.element.find("input").prop("disabled", false);
            this.element.find('#getParams').prop("disabled", 'disabled');
            this.element.find(".filter-section .all").css({
                visibility: "visible"
            });
            return this.element.find(".filter-actions .do-apply").show();
        },
        value: function(event) {
            return this.element.find("input:checked");
        },
        updateSelectedItems:function(section){
                var checkedVals, hidden;
                hidden = $(section).find("input[type=\"hidden\"]").not('#getParams');
                checkedVals = $(hidden).val().split(',');
                checkedVals=checkedVals.filter(Number);
                $(section).find(":checkbox").each(function() {
                    if ($.inArray($(this).data('value').toString(),checkedVals) != -1) $(this).prop('checked',true);
                 });
        }
    });

}).call(this);
(function() {


}).call(this);

(function() {
    $(function() {
        var $list, initializeCarousel, initializeSliderCarousel;
        initializePhotoCarousel = function() {
            var $owner;
            $owner = $(this).parent().parent();
            return $(this).cycle({
                log: false,
                pagerEvent: "click.cycle click",
                fx: "fade",
                speed: 100,
                timeout: 0,
                pauseOnHover: true,
                paused: true,
                pager: $owner.find(".photo-pagination"),
                pagerTemplate: "",
                pagerActiveClass: "-active",
                slides: ".photo-slide",
                slideClass: "photo-slide",
                slideActiveClass: "-active"
            });
        };
        initializeCarousel = function() {
            var $owner;
            $owner = $(this).parent();
            return $(this).cycle({
                log: false,
                pagerEvent: "click.cycle",
                fx: "fade",
                speed: 500,
                timeout: 5000,
                manualSpeed: 500,
                pauseOnHover: true,
                pager: $owner.find(".carousel-pagination"),
                pagerTemplate: "<li class='carousel-pagination-item'></li>",
                pagerActiveClass: "-active",
                prev: $owner.find(".carousel-prev"),
                next: $owner.find(".carousel-next"),
                slides: ".carousel-slide",
                slideClass: "carousel-slide",
                slideActiveClass: "-active"
            });
        };
        initializeSliderCarousel = function() {
            var $owner;
            $owner = $(this).parent();
            return $(this).cycle({
                log: false,
                fx: "scrollHorz",
                speed: 500,
                timeout: 0,
                manualSpeed: 500,
                pauseOnHover: true,
                paused: true,
                prev: $owner.find(".pagination .prev"),
                next: $owner.find(".pagination .next"),
                slides: ".slider-slide",
                slideClass: "slider-slide",
                slideActiveClass: "-active"
            });
        };
        initializeProductPreview = function($list) {
            var executeDialog, group;
            group = $list.map(function(index, item) {
                return {
                    href: $(item).data("url")
                };
            });
            executeDialog = function(event) {
                var url;
                url = $(this).data('url');
                $.fancybox.open(url, {
                    type: "ajax",
                    ajax: {
                        dataType: "html",
                        headers: {
                            "X-fancyBox": true
                        }
                    },
                    live: true,
                    padding: 30,
                    minWidth: 640,
                    maxWidth: 640,
//          minHeight: 580,
                    width: 640,
                    arrows: true,
                    loop: true,
                    autoSize: true,
                    autoResize: true,
                    autoCenter: true,
                    margin: [20, 60, 20, 60],
                    closeClick: false,
                    openEffect: 'fade',
                    closeEffect: 'elastic',
                    nextEffect: 'none',
                    prevEffect: 'none',
                    afterLoad: function(upcoming, current) {
                        setTimeout(function() {
                            $(".product-preview-cart .photo-carousel").each(function() {
                                return initializePhotoCarousel.call(this);
                            });
                            return $(".product-preview-cart .slider-carousel").each(function() {
                                return initializeSliderCarousel.call(this);
                            });
                            $('div.photo-pagination.-popup').niceScroll({cursorcolor:'#5e87c3'});
                        }, 200);
                        window.isPreviewOpened = true;
                        return true;
                    },
                    beforeClose: function(){
                        window.isPreviewOpened = false;
                        return true;
                    }
                });
                return false;
            };
            return $list.bind("click", executeDialog);
        };
        $('.selectbox').select2({
            minimumResultsForSearch: -1
        });
        $(".photo-carousel").each(function() {
            return initializePhotoCarousel.call(this);
        });
        $(".carousel").each(function() {
            return initializeCarousel.call(this);
        });
        $(".slider-carousel").each(function() {
            return initializeSliderCarousel.call(this);
        });
        $list = $(".product-item .product-preview");
        $list.each(function() {
            return $(this).attr("data-fancybox-group", "product-list").attr("rel", "product-list");
        });
        initializeProductPreview($list);
        $(".numberbox").numberbox({
            min: 1,
            max: 99
        });
        $(".numberbox").inputmask({
            mask: "99",
            greedy: false,
            placeholder: ""
        });
        if ($("#sign-in-popup").length) {
            $("#sign-in").fancybox({
                width: 400,
                minWidth: 400,
                maxWidth: 400,
                height: 380,
                minHeight: 380,
                maxHeight: 380,
                autoSize: true,
                autoResize: true,
                autoCenter: true,
                closeClick: false,
                openEffect: "fade",
                closeEffect: "elastic"
            });
            if ($('a.after-register-do-sign-in').length) {
                $(".after-register-do-sign-in").fancybox({
                    width: 400,
                    minWidth: 400,
                    maxWidth: 400,
                    height: 380,
                    minHeight: 380,
                    maxHeight: 380,
                    autoSize: true,
                    autoResize: true,
                    autoCenter: true,
                    closeClick: false,
                    openEffect: "fade",
                    closeEffect: "elastic"
                });
            }
        }
        if ($("#call-me-popup").length) {
            return $("#call-me").fancybox({
                width: 400,
                minWidth: 400,
                maxWidth: 400,
                height: 400,
                minHeight: 380,
                maxHeight: 400,
                autoSize: false,
                autoResize: true,
                autoCenter: true,
                closeClick: false,
                openEffect: "fade",
                closeEffect: "elastic"
            });
        }
    });

}).call(this);
(function() {
    $.widget("anta.numberbox", {
        _create: function() {
            this.options.cartTotalData = this.options.cartTotalData || $(this.element).parents('table').find('tfoot span.price');
            this.options.productTotalData = this.options.productTotalData || $(this.element).parents('td').next().find('span.price');
            this.options.prodPriceCell = this.options.prodPriceCell || $(this.element).parents('td').siblings('.price-cell').find('span.price');
            return this._createUpDownButtons();
        },
        _createUpDownButtons: function() {
            var $down, $element, $holder, $up;
            $element = $(this.element).clone();
            $holder = $("<div class=\"numberbox-holder\"/>");
            $up = $("<i class=\"numberbox-up\"></i>");
            $down = $("<i class=\"numberbox-down\"></i>");
            var href = $(this.element).data('href');
            $holder.append($down);
            $holder.append($element);
            $holder.append($up);
            $(this.element).replaceWith($holder);
            $down.bind("click", (function(_this) {
                return function() {
                    var value;
                    value = parseInt($element.val());
                    if (value <= _this.options.min) {
                        return;
                    }
                    $element.val(value - 1)
                    var res = $.ajax({
                        url: '/'+href+'/set/000020000x000010000/ajax'.replace('000010000',$element.val()).replace('000020000',$element.attr('data-id').replace('product_','')),
                        async: false
                    }).responseText;
                    _this._updatePrices(res, $element);
                    setBagChanges(res);

                    return true;
                };
            })(this));
            return $up.bind("click", (function(_this) {
                return function() {
                    var value;
                    value = parseInt($element.val());
                    if (value + 1 >= _this.options.max) {
                        return;
                    }
                    $element.val(value + 1);
                    var res = $.ajax({
                        url: '/'+href+'/set/000020000x000010000/ajax'.replace('000010000',$element.val()).replace('000020000',$element.attr('data-id').replace('product_','')),
                        async: false
                    }).responseText;
                    _this._updatePrices(res, $element);
                    setBagChanges(res);

                    return true;
                };
            })(this));
        },
        _updatePrices: function(res, element) {
            var data = JSON.parse(res);
            this.options.cartTotalData.html(data.sumFormated + '<span class="ruble -cart-total">Р</span>');
            this.options.productTotalData.html(parseInt(parseInt(this.options.prodPriceCell.html().split(" ").join("")) * element.val()).makeMoney()+'<span class=ruble>Р</span>');
        }
    });

}).call(this);

Object.defineProperty(Number.prototype, "makeMoney", {
    value: function() {
        var counter=1;var res = Array();
        var str = parseInt(this).toString();
        for (var q=0;q<str.length;++q){
            res.push(str[str.length-1-q]);
            if (counter%3==0)
                res.push(" ");
            ++counter;
        }
        var temp = Array();
        for (var t=res.length;t>=0;--t)
            temp.push(res[t]);

        return temp.join("").trim();
    }
});
function array_unique(arr)
{
    return $.grep(arr, function(v, k){
        return $.inArray(v ,arr) === k;
    });
}
(function() {


}).call(this);
