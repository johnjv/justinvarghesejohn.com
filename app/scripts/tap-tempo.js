var TapTempo = (function() {
	function TapTempo() {
		this.taps = [];
		this.isRecording = false;
	}

	TapTempo.prototype.recordTime = function() {
		var date = new Date();
		var time = date.getTime();
		console.log(time);
		this.taps.push(time);
		this.isRecording = true;
	};

	TapTempo.prototype.getBpm = function() {
		var deltas = this.getDeltas();
		return this.calculateBpm(deltas);
	};

	TapTempo.prototype.clearTimes = function() {
		this.taps = [];
		this.isRecording = false;
	};

	TapTempo.prototype.getDeltas = function() {
		var deltas = [];
		for(var i = 0; i < this.taps.length - 1; i++) {
			var delta = this.taps[i+1] - this.taps[i];
			deltas.push(delta);
		}
		return deltas;
	};

	TapTempo.prototype.calculateBpm = function(deltas) {
		var sum = 0;
		var average;
		for(var delta in deltas) {
			sum += deltas[delta];
		}
		average = sum / deltas.length;

		return (60000 / average);
	};

	TapTempo.prototype.isRecording = function() {
		return this.isRecording;
	};

	return TapTempo;

})();


var timer = {
  reset: function() {
  	console.log('reset');
    this.stop();
    this.start();
  },

  start: function() {
    this.stop();
    var self = this;
    this.timeoutID = window.setTimeout( function() {
    	self.stop();
    	tapTempo.clearTimes();
    }, 3000);
  },

  stop: function() {
    if(typeof this.timeoutID == "number") {
      window.clearTimeout(this.timeoutID);
      delete this.timeoutID;
    }
  }
};

document.querySelector('.tapper').addEventListener('touchstart', handleTap ,false);
document.querySelector('.tapper').addEventListener('click', handleTap ,false);

var tapTempo = new TapTempo();

function handleTap(event) {
	event.preventDefault();
	console.log(event);
	tapTempo.recordTime();
	timer.reset();
	updateView();
}

function updateView() {
	if(tapTempo.taps.length > 2) {
		var bpm = Math.round(tapTempo.getBpm());
		$('#bpm').text(bpm);
	} 
	else if(tapTempo.taps.length == 0) {
		$('#bpm').text('---');
	}
	else {
		$('#bpm').text('tap once more');
	}
}

function visualizeTap() {
	
}