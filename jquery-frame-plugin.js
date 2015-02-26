;
(function($) {

    $.fn.extend({
        addFrame: function(options) {
            options = $.extend( {}, $.funcAddFrame.defaults, options );

            this.each(function() {
                new $.funcAddFrame(this, options);
            });
            return this;
        }
    });

    $.funcAddFrame = function( item, options ) {
        var status, beginX, beginY =0;

        var frame = $("<div>", {id: options.frameId}); // рамка выделения
        var div = $(item);                             // контейнер

        var beginXDiv = div.offset().left;
        var beginYDiv = div.offset().top;
        var endXDiv = beginXDiv + div.width();
        var endYDiv = beginYDiv + div.height();

        var items = getAllObject();

        div.append(frame);


        div.mousedown(function(e){
            if( e.button == 0 ) {
                status = 1;
                beginX = e.clientX;
                beginY = e.clientY;
                frame.css('top',beginY)
                     .css('left',beginX)
                     .css('width', 0)
                     .css('height', 0)
                     .show();
            }
        });


        $(document).mouseup(function(e){
            if( e.button == 0 ) {
                status = 0;
                beginX = frame.offset().left;
                beginY = frame.offset().top;
                var endX =  beginX + frame.width();
                var endY =  beginY + frame.height();
                frame.hide();

                var selectedItem = [], allItem = [];
                $.each(items, function(key, val){
                    allItem.push(val.object)
                    if (val.begin[0] >= beginX  && val.end[0] <= endX &&
                        val.begin[1] >= beginY  && val.end[1] <= endY){
                        selectedItem.push(val.object);
                    }
                })
                return options.callbackFunction(allItem, selectedItem);
            }
        });


        $(document).mousemove(function(e){
            if (status)
            {
                // TODO: объединить поведение на границах и основное перемещение
                // основное перемещение
                if ((e.clientX - beginX) < 0)
                {
                    frame.css('left', e.clientX)
                         .css('width', beginX - e.clientX)
                }
                else
                    frame.css('width', e.clientX - beginX);
                if ((e.clientY - beginY) < 0)
                {
                    frame.css('top', e.clientY)
                         .css('height', beginY - e.clientY)
                }
                else
                    frame.css('height', e.clientY - beginY);

                // границы
                if (e.clientX < beginXDiv) {
                    frame.css('left', beginXDiv)
                         .css('width', beginX - beginXDiv);
                }
                if (e.clientX > endXDiv) {
                    frame.css('width', endXDiv - beginX);
                }

                if (e.clientY < beginYDiv) {
                    frame.css('top', beginYDiv)
                         .css('height', beginY - beginYDiv);
                }
                if (e.clientY > endYDiv)
                    frame.css('height', endYDiv - beginY);
            }
        });

        function getAllObject()
        {
            var items = [];
            $.each(div.children(), function(key, val) {
                val = $(val);
                items.push({
                    'object': val,
                    'begin': [
                        val.offset().left, //x
                        val.offset().top,  //y
                    ],
                    'end': [
                        val.offset().left + val.width(),
                        val.offset().top + val.height(),
                    ]
                })
            });
            return items;
        }
    };

    // дефолтн
    $.funcAddFrame.defaults = {
        'frameId': 'frame',                             // id рамки
        'callbackFunction': function(allItems, selectedItems){},  // callback-функция для выделенных элементов. Параметры: все элементы, выбранные элементы
        'selectType': 'full'                           // TODO: тип выделения (элемент считается выделенным, есали выделен полностью/выделен частично/выделен наполовину/своя функция).
    };

})(jQuery);
