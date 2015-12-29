
video.hasData(function() {
	/*IMPORTANT dont for get to set flags

	var dtmFlag = false OR true
	var debugFlag = true; 
		Will turn on debug mode and will log all the events to the console
	
	var dtmFlag = false;
	var debugFlag = false;
		Will send event hits directly to GA with the ga('send','event'...) method
	
	var dtmFlag = true;
	var debugFlag = false;
		Will push the events data to the dataLayer

	*/
	var dtmFlag = false;
	var debugFlag = false;
	

	var alltime = 0;
	var oldTime = 0;

	function trackEvents(category, action, label, value) {
		label = label || '';
		value = value || 0;

		if (!debugFlag) {
			if (!dtmFlag) {
				ga('send', 'event', category, action, label, value);
			} else if (dtmFlag) {
				dataLayer.push({
					'event': 'wistiaChange',
					'eventCategory': category,
					'eventAction': action,
					'eventLabel': label,
					'eventValue': value,
				});
			};
		} else {
			console.log(
				'WISTIA DEBUG = ' + debugFlag +
				'\n name: ' + video.name() +
				'\n action: ' + action +
				'\n category: ' + category +
				'\n label: ' + label +
				'\n value:' + value +
				'\n time: ' + video.time() +
				'\n clean time: ' + cleanTime() +
				'\n segment: ' + segementSection(cleanTime())
			);
		};
	};

	//UTILITIES

	function segementSection(time) {
		var segmentLength = video.duration() / 3;
		var beginning = segmentLength
		var middle = segmentLength * 2
		var end = segmentLength * 3
		if (time <= beginning) {
			return 'beginning'
		} else if (time <= middle && time > beginning) {
			return 'middle'
		} else if (time > middle) {
			return 'end'
		}
	};



	function cleanTime() {
		return Math.round(video.time())
	};

	function percentViewed() {
		return Math.round(cleanTime() / video.duration() * 100) + "%"
	};


	video.bind('play', function() {
		if (video.time() == 0 || video.time() >= video.duration()) {
			trackEvents('video: ' + video.name(), 'start', 'start', 1)
		} else {
			trackEvents('video: ' + video.name(), 'play', segementSection(cleanTime()), 1)
		};
	});

	video.bind('pause', function() {
		trackEvents('video: ' + video.name(), 'pause', segementSection(cleanTime()), 1)
	});


	video.bind("end", function() {
		trackEvents('video: ' + video.name(), 'end', 'end', 3)
	});

	video.bind("secondchange", function(s) {

		var timeDif = s - oldTime;
		var timeflag = true;

		if (timeDif > 1) {
			trackEvents('video: ' + video.name(), 'skip ahead', timeDif, 1)
			timeflag = false;
		} else if (timeDif < 0) {
			trackEvents('video: ' + video.name(), 'skip backwards', timeDif, 1)
			timeflag = false;
		};

		if (alltime % 5 == 0 && alltime != 0) {
			trackEvents('video: ' + video.name(), 'viewed', alltime, 1)
		};

		if (timeflag) {
			alltime++;
		};

		oldTime = s;

	});



});