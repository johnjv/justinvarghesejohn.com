/*!
 *
 *  justinvarghesejohn.com
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function() {
        'use strict';
        console.log("%cconnecting things", "color: #7b5294; text-size: x-large;");

        var $canvas; // $canvas jquery object we're drawing to
        var ctx; // $canvas drawing context
        var audioctx;
        var analyser;
        var fdata = null;
        var tdata = null;
        var visualizations = [];
        var v = 'c';
        var lines;
        var numLines = 32; // how many lines to draw
        var speed = 8;
        var w, h;

        // requestAnim shim layer by Paul Irish
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function( /* function */ callback, /* DOMElement */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        // Fires when the page first loads
        $(document).ready(function() {
            initializeCanvas();
            initializeWebAudio();
            initialize();
            animate();

            $(".fab.play-button").on("click", function() {
              if($(this).hasClass('play-button')) {
                document.getElementById('music').play();
                $(this).find('.more-icon').removeClass('icon-headphones').addClass('icon-pause2')
                $(this).removeClass('play-button').addClass('pause-button');
              }
              else {
                document.getElementById('music').pause();
                $(this).find('.more-icon').removeClass('icon-pause2').addClass('icon-headphones')
                $(this).removeClass('pause-button').addClass('play-button');
              } 
            });


        });

        var initializeCanvas = function() {
            $canvas = $("#canvas");
            ctx = $canvas.get(0).getContext("2d");
            w = $canvas.parent().width();
            h = $canvas.parent().height();
            // Resize the $canvas to fill the entire page
            // $canvas.attr('width', w);
            // $canvas.attr('height', h);
        }

        var initializeWebAudio = function() {
            if ('webkitAudioContext' in window) {
                audioctx = new webkitAudioContext();
                analyser = audioctx.createAnalyser();
            }
            var audio = new Audio();
            audio.src = 'https://dl.dropboxusercontent.com/u/443853/Dark%20Water.mp3';
            audio.type = "audio/ogg"
            audio.id = 'music';
            audio.controls = false;
            audio.autoplay = false;
            $('.g-wide--full.bottom').append(audio);

            var source = audioctx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioctx.destination);

            analyser.fftSize = 256;
            console.log(analyser.frequencyBinCount); // fftSize/2 = 32 data points
            // Get the new frequency data
            if (fdata == null || tdata == null) {
                fdata = tdata = new Uint8Array(analyser.frequencyBinCount);
            }
        }

        var initialize = function() {
            lines = [];


            for (var x = 0; x < numLines; x++) {

                // top x position
                // randomly chosen across the width of the screen (plus 50px off to the sides)
                // var tx = (Math.random() * (w+100)) - 50;
                var tx = (Math.random() * (w));

                // top y position
                var ty = -20;

                // bottom x position
                // randomly chosen plus or minus 250px of the top position
                var bx = tx + (Math.random() * 250);

                // bottom y position
                // random 180px to 680px from top of screen
                var by = 80 + (Math.random() * 500);

                // speed at which the bottom of the line moves
                // random between 0.01 and [speed]
                var lineSpeed = (Math.random() * (speed - 0.01)) + 0.01;

                // wrap up all the parameters for this line in a single object
                var line = {
                    tx: tx,
                    bx: bx,
                    ty: ty,
                    by: by,
                    speed: lineSpeed,
                    opacity: .2,
                    direction: Math.random() > .5 ? 1 : -1 //random moving left (-1) or right (1)
                };

                // put the new line into our lines array
                lines.push(line);
            }

        };


        // This runs over an over, moving the line
        // positions and drawing them to the screen.
        var animate = function() {

            analyser.getByteFrequencyData(fdata);
            analyser.getByteTimeDomainData(tdata);
            var bufferLength = analyser.frequencyBinCount;

            // clear the screen from the previous step of the animation
            ctx.clearRect(0, 0, $canvas.width(), $canvas.height());

            // TIME DOMAIN WAVEFORM
            // ctx.strokeStyle = 'rgb(119,79,186)';
            // ctx.lineWidth = 10;
            // ctx.beginPath();

            // var sliceWidth = w * 1.0 / bufferLength;
            // var x = 0;

            // for (var i = 0; i < bufferLength; i++) {

            //     var v = fdata[i] / 128.0;
            //     var y = v * $canvas.height() / 4;

            //     if (i === 0) {
            //         ctx.moveTo(x, y);
            //     } else {
            //         ctx.lineTo(x, y);
            //     }

            //     x += sliceWidth;
            // }
            // ctx.lineTo($canvas.width(), $canvas.height() / 4);
            // ctx.stroke();

            // BAR GRAPH
            var barWidth = ($(canvas).width() / bufferLength);
            var barHeight;
            var x = 0;
            for (var i = 0; i < bufferLength; i++) {
                barHeight = fdata[i] / 2;
                ctx.fillStyle = 'rgb(60,' + (barHeight + 100) + ',' + (barHeight/4 + 70);
                ctx.fillRect(x, $(canvas).height()  - (barHeight * 1.5), barWidth, barHeight);

                x += barWidth + 1;
            }
        //have the browser run this animation just before each screen refresh
        requestAnimationFrame(animate);
    };

})();