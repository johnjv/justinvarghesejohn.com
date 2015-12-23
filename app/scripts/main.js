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

    var $canvas; // $canvas jquery object we're drawing to
    var ctx; // $canvas drawing context
    var analyser;
    var fdata = null;
    var tdata = null;
    var analyser2;
    var fdata2 = null;
    var tdata2 = null;
    var w, h;
    var animation;
    var CANVAS_HEIGHT, CANVAS_WIDTH;


    // Fires when the page first loads
    $(document).ready(function() {

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {

            initializeCanvas();
            initializeWebAudio();
            //animate();

            $('#fab').on('click', function(event) {
                if ($(this).hasClass('play-button')) {
                    $('#bass').trigger('play');
                    $('#tabla').trigger('play');
                    $(this).find('.more-icon').removeClass('icon-headphones').addClass('icon-pause2')
                    $(this).removeClass('play-button').addClass('pause-button');
                    animation = window.requestAnimationFrame(animate);
                    // animate();
                } else {
                    $('#bass').trigger('pause');
                    $('#tabla').trigger('pause');
                    $(this).find('.more-icon').removeClass('icon-pause2').addClass('icon-headphones')
                    $(this).removeClass('pause-button').addClass('play-button');
                    window.cancelAnimationFrame(animation);
                    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
            });
        } else {
            $('#fab').hide();
        }


        window.onresize = function(event) {
            CANVAS_HEIGHT = $canvas.height();
            CANVAS_WIDTH = $canvas.width();
        }


    });

    var initializeCanvas = function() {
        $canvas = $('#canvas');
        ctx = $canvas.get(0).getContext('2d');
        w = $canvas.parent().width();
        h = $canvas.parent().height();
        CANVAS_HEIGHT = $canvas.height();
        CANVAS_WIDTH = $canvas.width();
        // Resize the $canvas to fill the entire page
        // $canvas.attr('width', w);
        // $canvas.attr('height', h);
    }

    var initializeWebAudio = function() {
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser2 = audioCtx.createAnalyser();

        var audio = new Audio();
        audio.src = 'audio/mantra--bass.ogg';
        audio.id = 'bass';
        audio.controls = false;
        audio.autoplay = false;
        $('main').append(audio);

        var audio2 = new Audio();
        audio2.src = 'audio/sunset.ogg';
        audio2.id = 'tabla';
        audio2.controls = false;
        audio2.autoplay = false;
        $('main').append(audio2);

        var source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        var gainNode = audioCtx.createGain();
        gainNode.gain.value = 1;
        analyser.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.1;

        var source2 = audioCtx.createMediaElementSource(audio2);
        source2.connect(analyser2);
        var gainNode2 = audioCtx.createGain();
        gainNode2.gain.value = 1;
        analyser2.connect(gainNode2);
        gainNode2.connect(audioCtx.destination);
        analyser2.fftSize = 2048;
        analyser2.smoothingTimeConstant = 1;
        //console.log(analyser.frequencyBinCount); // fftSize/2 = 32 data points
        // Get the new frequency data
        if (fdata === null || tdata === null) {
            fdata = tdata = new Uint8Array(analyser.frequencyBinCount);
        }
        if (fdata2 === null || tdata2 === null) {
            fdata2 = tdata2 = new Uint8Array(analyser2.frequencyBinCount);
        }
    }


    // This runs over an over, moving the line
    // positions and drawing them to the screen.
    var animate = function() {

        analyser.getByteFrequencyData(fdata);
        analyser.getByteTimeDomainData(tdata);

        analyser2.getByteFrequencyData(fdata2);
        analyser2.getByteTimeDomainData(tdata2);

        var bufferLength = analyser.frequencyBinCount;
        var bufferLength2 = analyser2.frequencyBinCount;

        // clear the screen from the previous step of the animation
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);



        // BAR GRAPH
        var barWidth = (CANVAS_WIDTH / bufferLength2);
        var barHeight;
        var x = 0;


        for (var i = 0; i < bufferLength2; i++) {
            barHeight = fdata2[i];
            ctx.fillStyle = 'rgb(105,240,174)';
            ctx.fillRect(x, CANVAS_HEIGHT/2 - barHeight+ 50, barWidth+1, barHeight);

            x += barWidth;
        }

        x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = fdata2[i];
            ctx.fillStyle = 'rgb(126,87,194)';
            //ctx.fillStyle = 'rgb(70,' + (barHeight + 120) + ',' + (barHeight/4 + 80);
            ctx.fillRect(x, CANVAS_HEIGHT/2 - barHeight + 100, barWidth+1, barHeight);

            x += barWidth;
        }

        // TIME DOMAIN WAVEFORM
        // ctx.strokeStyle = 'rgb(105,240,174)';
        // ctx.lineWidth = 10;
        // ctx.beginPath();

        // var sliceWidth = w * 1.0 / bufferLength;
        // var x = 0;

        // for (var i = 0; i < bufferLength; i++) {

        //     var v = tdata[i] / 128.0;
        //     var y = v * CANVAS_HEIGHT / 4;

        //     if (i === 0) {
        //         ctx.moveTo(x, y);
        //     } else {
        //         ctx.lineTo(x, y);
        //     }

        //     x += sliceWidth;
        // }
        // ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
        // ctx.stroke();



        // ctx.strokeStyle = 'rgb(126,87,194)';
        // ctx.lineWidth = 1;

        // ctx.beginPath();

        // var sliceWidth = w * 1.0 / bufferLength2;
        // var x = 0;

        // for (var i = 0; i < bufferLength2; i++) {

        //     var v = tdata2[i] / 128.0;

        //     var y = v * CANVAS_HEIGHT / 4;

        //     if (i === 0) {
        //         ctx.moveTo(x, y);
        //     } else {
        //         ctx.lineTo(x, y);
        //     }

        //     x += sliceWidth;
        // }
        // ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);



        // ctx.stroke();

        requestAnimationFrame(animate);

    };

})();
