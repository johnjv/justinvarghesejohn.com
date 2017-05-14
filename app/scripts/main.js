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

'use strict';

var audioCtx;

(function() {

    var canvas;
    var ctx;
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
    document.addEventListener('DOMContentLoaded', function() {


        initializeCanvas();
        initializeWebAudio();
        //animate();

        document.querySelector('#fab').addEventListener('click', function(event) {
            if (this.classList.contains('play-button')) {
                document.getElementById('bass').play();
                // document.getElementById('tabla').play();
                this.querySelector('.fa').classList.remove('fa-music');
                this.querySelector('.fa').classList.add('fa-pause');
                this.classList.remove('play-button');
                this.classList.add('pause-button');
                animation = window.requestAnimationFrame(animate);
                // animate();
            } else {
                document.getElementById('bass').pause();
            //   document.getElementById('tabla').pause();
                this.querySelector('.fa').classList.remove('fa-pause');
                this.querySelector('.fa').classList.add('fa-music');
                this.classList.remove('pause-button');
                this.classList.add('play-button');
                window.cancelAnimationFrame(animation);
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        });


        window.onresize = function(event) {
            CANVAS_HEIGHT = canvas.getBoundingClientRect().height;
            CANVAS_WIDTH = canvas.getBoundingClientRect().width;
        }


    });

    var initializeCanvas = function() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        w = window.innerWidth;
        h = window.innerHeight;
        CANVAS_HEIGHT = canvas.getBoundingClientRect().height;
        CANVAS_WIDTH = canvas.getBoundingClientRect().width;
        // Resize the canvas to fill the entire page
        // canvas.attr('width', w);
        // canvas.attr('height', h);
    }

    var initializeWebAudio = function() {
        // audioCtx = new AudioContext() || new webkitAudioContext();
        var AudioContext = window.AudioContext // Default
            // || window.webkitAudioContext // Safari and old versions of Chrome
            || false; 

        if (AudioContext) {
            // Do whatever you want using the Web Audio API
            var audioCtx = new AudioContext;
            analyser = audioCtx.createAnalyser();
            analyser2 = audioCtx.createAnalyser();

            var audio = new Audio();
            audio.src = 'audio/gbus-to-mtv.mp3';
            audio.id = 'bass';
            audio.controls = false;
            audio.autoplay = false;
            document.querySelector('main').appendChild(audio);

            // var audio2 = new Audio();
            // audio2.src = 'audio/mantra--tabla.ogg';
            // audio2.id = 'tabla';
            // audio2.controls = false;
            // audio2.autoplay = false;
            // $('main').append(audio2);

            var source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = 1;
            analyser.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.1;

            // var source2 = audioCtx.createMediaElementSource(audio2);
            // source2.connect(analyser2);
            // var gainNode2 = audioCtx.createGain();
            // gainNode2.gain.value = 1;
            // analyser2.connect(gainNode2);
            // gainNode2.connect(audioCtx.destination);
            // analyser2.fftSize = 2048;
            // analyser2.smoothingTimeConstant = 1;
            //console.log(analyser.frequencyBinCount); // fftSize/2 = 32 data points
            // Get the new frequency data
            if (fdata === null || tdata === null) {
                fdata = tdata = new Uint8Array(analyser.frequencyBinCount);
            }
            // if (fdata2 === null || tdata2 === null) {
            //     fdata2 = tdata2 = new Uint8Array(analyser2.frequencyBinCount);
            // }
            // ...
        } else {
            // Web Audio API is not supported
            document.getElementById('fab').classList.add('hide');
        }
    }


    // This runs over an over, moving the line
    // positions and drawing them to the screen.
    var animate = function() {

        analyser.getByteFrequencyData(fdata);
        analyser.getByteTimeDomainData(tdata);

        // analyser2.getByteFrequencyData(fdata2);
        // analyser2.getByteTimeDomainData(tdata2);

        var bufferLength = analyser.frequencyBinCount;
        var bufferLength2 = analyser2.frequencyBinCount;

        // clear the screen from the previous step of the animation
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);



        // BAR GRAPH
        var barWidth = (CANVAS_WIDTH / bufferLength2);
        var barHeight;
        var x = 0;


        for (var i = 0; i < bufferLength2; i++) {
            barHeight = fdata[i];
            ctx.fillStyle = 'rgb(105,240,174)';
            ctx.fillRect(x, CANVAS_HEIGHT/2 - barHeight+ 50, barWidth+1, barHeight);

            x += barWidth;
        }

        x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = fdata[i];
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
