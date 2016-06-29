/**
 * Created by Awar on 2016-06-26.
 */
'use strict';

var app = {
    init: function() {
        this.memoGame();
    },
    memoGame: function() {

        // passing options of the game - commented variants will let you try out different options quickly

        var options = {
            "tiles_in_a_row": 5,
            "tiles_in_a_column": 6,
            "preferred_tile_size": 200,
            "space_between_tiles": 10,
            "background": "bg/treeson_blue.jpg",
            // "background": "",
            "tiles_images_source_type": "server", // "local as another option"
            "tiles_images_source": "http://www.warzecha.org/ola/memory/images/",
            "tiles_images_json": "http://www.warzecha.org/ola/memory/enumpic.php" // my own source serving JSON - if you choose local, leave empty or do not use it at all
            // "tiles_images_source_type": "local",
            // "tiles_images_source": "images/"
        };

        // setting the gameboard

        var gameboard = $('[data-game]');
        setGameboard();

        // in DOM - based on options

        function setGameboard() {
            if ((options.tiles_in_a_column * options.tiles_in_a_row) % 2 > 0) {
                // the number of tiles cannot be odd, so we need to deal with this here
                for (var i = 0; i < (options.tiles_in_a_column * (options.tiles_in_a_row - 1)); i++) {
                    gameboard.append('<div class="tile"></div>');
                    $('.tile').css({
                        'width': options.preferred_tile_size + 'px',
                        'max-width': "calc(100% / " + options.tiles_in_a_row + " - 2 * " + options.space_between_tiles + "px )",
                        'flex-basis': "calc(100% / " + options.tiles_in_a_row + " - 2 * " + options.space_between_tiles + "px )",
                        'margin': options.space_between_tiles + 'px'
                    })
                }
            } else {
                for (var i = 0; i < (options.tiles_in_a_column * options.tiles_in_a_row); i++) {
                    gameboard.append('<div class="tile"></div>');
                    $('.tile').css({
                        'width': options.preferred_tile_size + 'px',
                        'max-width': "calc(100% / " + options.tiles_in_a_row + " - 2 * " + options.space_between_tiles + "px )",
                        'flex-basis': "calc(100% / " + options.tiles_in_a_row + " - 2 * " + options.space_between_tiles + "px )",
                        'margin': options.space_between_tiles + 'px'
                    })
                }
            }
        }

        if (options.background !== "") {
            gameboard.css('background-image', 'url("' + options.background + '")');
        }

        // getting the right images & randomizing them

        var gameSetup = {};

        var randomizedTiles = [];
        $('.tile').each(function(index, el) {
            randomizedTiles.push($(this));
        });
        shuffleArray(randomizedTiles);

        if (options.tiles_images_source_type === "local") {
            $.ajax({
                url: options.tiles_images_source,
                success: function(data) {
                    var images = [];
                    $(data).find("a").attr("href", function(i, val) {
                        if (val.match(/\.(jpe?g|png|gif)$/)) {
                            images.push(val.replace("/images/", "") + "");
                        }
                    });

                    var randomizedImages = [];
                    $.each(images, function(key, val) {
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
        } else {
            $.ajax({
                type: 'GET',
                url: options.tiles_images_json,
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

        // randomizating algorithm - Durstenfeld shuffle

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

        $(document).on("ajaxStop", function() {

            $('.tile').on('click', function() {
                if ($(this).hasClass('inactive') || $(this).hasClass('invisible')) {
                    return false;
                } else {
                    $(this).addClass('flipped');
                    $(this).css('background-image', 'url("' + options.tiles_images_source + gameSetup[$(this).attr('id')][1] + '")');

                    if ($('.tile-first').length) {
                        if ($(this).css('background-image') === $('.tile-first').css('background-image')) {

                            $(this).addClass('tile-second').addClass('right');
                            $('.tile-first').addClass('right');

                            setTimeout(function() {
                                disable();
                            }, 800);

                        } else {
                            $(this).addClass('tile-second').addClass('wrong');
                            $('.tile-first').addClass('wrong');

                            setTimeout(function() {
                                flipBack();
                            }, 800);
                        }
                    } else {
                        $(this).addClass('tile-first');
                    }
                }
            });

        });

        // callback for disabling right tiles

        function disable() {
            if (options.background !== "") {
                $('.tile-first, .tile-second').removeClass().addClass('tile').addClass('invisible');
            } else {
                $('.tile-first, .tile-second').removeClass().addClass('tile').addClass('inactive');
            }
        }

        // callback for flipping back wrong tiles

        function flipBack() {
            $('.tile-first, .tile-second').removeClass().addClass('tile').css('background-image', "");
        }
    }
};

$(document).ready(function() {
    app.init();
});
