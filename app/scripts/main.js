/*!
 *
 *  justinvarghesejohn.com
 *  Copyright 2015 Justin Varghese John
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
var audioCtx;

(function() {
    'use strict';
    console.log("%cconnecting things", "color: #7b5294; text-size: x-large;");

    var $canvas; // $canvas jquery object we're drawing to
    var ctx; // $canvas drawing context
    var analyser;
    var fdata = null;
    var tdata = null;
    var w, h;
    var animation;

    // requestAnim shim layer by Paul Irish
    // var lastTime = 0;
    // var vendors = ['ms', 'moz', 'webkit', 'o'];
    // for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    //     window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    //     window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    // }

    // if (!window.requestAnimationFrame)
    //     window.requestAnimationFrame = function(callback, element) {
    //         var currTime = new Date().getTime();
    //         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    //         var id = window.setTimeout(function() {
    //                 callback(currTime + timeToCall);
    //             },
    //             timeToCall);
    //         lastTime = currTime + timeToCall;
    //         return id;
    //     };

    // if (!window.cancelAnimationFrame)
    //     window.cancelAnimationFrame = function(id) {
    //         clearTimeout(id);
    //     };
    // window.requestAnimFrame = (function() {
    //     return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    //         function( /* function */ callback, /* DOMElement */ element) {
    //             window.setTimeout(callback, 1000 / 60);
    //         };
    // })();

    // Fires when the page first loads
    $(document).ready(function() {
        // please note, that IE11 now returns undefined again for window.chrome
        var isChromium = window.chrome,
            vendorName = window.navigator.vendor;
        if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc.") {
            initializeCanvas();
            initializeWebAudio();
            //animate();

            $(".fab.play-button").on("click", function() {
                if ($(this).hasClass('play-button')) {
                    $('#music').trigger('play');
                    $(this).find('.more-icon').removeClass('icon-headphones').addClass('icon-pause2')
                    $(this).removeClass('play-button').addClass('pause-button');
                    animation = window.requestAnimationFrame(animate);
                    // animate();
                } else {
                    $('#music').trigger('pause');
                    $(this).find('.more-icon').removeClass('icon-pause2').addClass('icon-headphones')
                    $(this).removeClass('pause-button').addClass('play-button');
                    window.cancelAnimationFrame(animation);
                }
            });
        } else {
            $('.fab').hide();
        }


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
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();

        // var audio = new Audio();
        // audio.src = 'https://dl.dropboxusercontent.com/u/443853/Dark%20Water.mp3';
        // audio.id = 'music';
        // audio.controls = false;
        // audio.autoplay = false;
        // $('.g-wide--full.bottom').append(audio);
        var audio = document.querySelector('audio');
        console.log(audio);
        var source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);

        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 1;

        analyser.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 1;
        //console.log(analyser.frequencyBinCount); // fftSize/2 = 32 data points
        // Get the new frequency data
        if (fdata == null || tdata == null) {
            fdata = tdata = new Uint8Array(analyser.frequencyBinCount);
        }
    }


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
        var barWidth = ($canvas.width() / bufferLength);
        var barHeight;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            barHeight = fdata[i];
            //console.log(fdata[i]);
            //console.log(barHeight);
            ctx.fillStyle = 'rgb(60,180,100)';
            //ctx.fillStyle = 'rgb(70,' + (barHeight + 120) + ',' + (barHeight/4 + 80);
            ctx.fillRect(x, $canvas.height() - barHeight, barWidth, barHeight);

            x += barWidth;
        }

        requestAnimationFrame(animate);

    };

})();