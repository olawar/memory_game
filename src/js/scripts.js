/**
 * Created by Awar on 2016-06-26.
 */
'use strict';

var app = {
    init: function() {
        this.memoGame();
    },
    memoGame: function() {

        // passing options of the game

        var options = {
            "tiles_in_a_row": 5,
            "tiles_in_a_column": 5,
            "preferred_tile_size": 200,
            "space_between_tiles": 10,
            "tiles_images_source": "server", // "local as another option"
            "tiles_images_address": "http://www.warzecha.org/ola/memory/enumpic.php"
        };

        setGameboard();

        // setting the gameboard

        // in DOM - based on options

        function setGameboard() {
            if ((options.tiles_in_a_column * options.tiles_in_a_row) % 2 > 0) {
                // the number of tiles cannot be odd, so we need to deal with this here
                for (var i = 0; i < (options.tiles_in_a_column * (options.tiles_in_a_row - 1)); i++) {
                    $('[data-game]').append('<div class="tile"></div>');
                    $('.tile').css({
                        'width': options.preferred_tile_size + 'px',
                        'max-width': "calc(100% / " + options.tiles_in_a_row + " - 2 * " + options.space_between_tiles + "px )",
                        'margin': options.space_between_tiles + 'px'
                    })
                }
            }

            else {
                for (var i = 0; i < (options.tiles_in_a_column * options.tiles_in_a_row); i++) {
                    $('[data-game]').append('<div class="tile"></div>');
                    $('.tile').css({
                        'width': options.preferred_tile_size + 'px',
                        'max-width': "calc(100% / " + options.tiles_in_a_row + " - 2 * " + options.space_between_tiles + "px )",
                        'margin': options.space_between_tiles + 'px'
                    })
                }
            }
        }

        // getting the right images & randomizing them

        var gameSetup = {};

        var randomizedTiles = [];
        $('.tile').each(function(index, el) {
            randomizedTiles.push($(this));
        });
        shuffleArray(randomizedTiles);

        if (options.tiles_images_source == "local") {
            // transforming images - from local source @TODO

            // $.ajax({
            //     url : options.tiles_images_source,
            //     success: function (data) {
            //         console.log(data);
            //         $(data).find("a").attr("href", function (i, val) {
            //             if( val.match(/\.(jpe?g|png|gif)$/) ) {
            //                 $("body").append( "<img src='" + val +"'>" );
            //             }
            //         });
            //     }
            // });
        }

        else {
            $.ajax({
                type: 'GET',
                url: options.tiles_images_address,
                data: {
                    get_param: 'value'
                },
                dataType: 'json',
                success: function(data) {
                    var randomizedImages = [];
                    $.each(data, function(key, val) {
                        randomizedImages.push(val);
                    });
                    shuffleArray(randomizedImages);

                    for (var i = 0; i < randomizedTiles.length; i = i + 2) {
                        randomizedTiles[i].attr('id', 'tile-' + i);
                        gameSetup['tile-' + i] = [randomizedTiles[i], randomizedImages[0]];

                        randomizedTiles[i + parseInt(1, 10)].attr('id', 'tile-' + i + parseInt(1, 10));
                        gameSetup['tile-' + i + parseInt(1, 10)] = [randomizedTiles[i + parseInt(1, 10)], randomizedImages[0]];

                        randomizedImages.shift();
                    }
                }
            });
        }

        // randomizating algorithm

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        // gameplay - once game setup is ready

        $(document).ajaxStop(function() {

            $('.tile').on('click', function() {
                $(this).addClass('flipped');
                $(this).css('background-image', 'url("http://www.warzecha.org/ola/memory/images/' + gameSetup[$(this).attr('id')][1] + '")');

                if ($('.tile-first').length) {
                    if ($(this).css('background-image') == $('.tile-first').css('background-image')) {

                        $(this).addClass('tile-second').addClass('right');
                        $('.tile-first').addClass('right');

                        setTimeout(function() {
                            $('.tile-first, .tile-second').removeClass().addClass('tile').addClass('inactive');
                        }, 800);

                    } else {
                        $(this).addClass('tile-second').addClass('wrong');
                        $('.tile-first').addClass('wrong');

                        setTimeout(function() {
                            $('.tile-first, .tile-second').removeClass().addClass('tile').css('background-image', "");
                        }, 800);
                    }
                } else {
                    $(this).addClass('tile-first');
                }
            });

        });
    }
};

$(document).ready(function() {
    app.init();
});
