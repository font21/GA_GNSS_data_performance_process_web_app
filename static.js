/* ==========================================================
#															#
#	Define global variables by using var at creation		#
#															#
========================================================== */

	var mergedPayload = "Nothing added to the mergedPayload varibale.";
	var sentenceArray = [];

/* ==========================================================
#															#
#	Define Functions										#
#															#
========================================================== */

function keysReduce (nmeakey, nmeaInputArray){
	// Merge Key-Value pairs as defined above
	//  returns [{talkerId: '$GN', sentenceType: 'GGA', utcFromDevice: '...}]
		return nmeakey.reduce((obj, key, index) => (
			{ ...obj, [key]: nmeaInputArray[index] }
		), {})	
};

function sentenceParserFunction (sentenceArray) {
	// output array
	const parsedArray = []
	// initial array block
	console.log('initial', sentenceArray)

	// Foor loop to itterate through the array
	for (let indexi = 0; indexi < sentenceArray.length ; indexi++) {
		if (sentenceArray[indexi]) {
			// each item in sentenceArray
				console.log('1 line', sentenceArray[indexi])

			// For each item in the Array: slice out the talker and sentence type (1st item)
				let talkerId = sentenceArray[indexi][0].slice(0, 3);
				let sentenceType = sentenceArray[indexi][0].slice(3);

			// and stick them at the front of sentenceArray
				sentenceArray[indexi].shift()
				sentenceArray[indexi].unshift(talkerId,sentenceType);
				console.log('1 line updated', sentenceArray[indexi])

			// Define Keys to be paired
				const nmeaKeyNames={		
				CFG : ["talkerId","sentenceType","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","checksum"],
				GGA : ["talkerId","sentenceType","utcFromDevice","latitude","latitudeDirection","longitude","longitudeDirection","gpsQuality","satellitesInUse","dilutionOfPrecision","antennaAltitude","antennaAltitudeUnit","geoidalSeparation","geoidalSeparationUnit","ageOfData","Reference station ID","checksum"],	
				GST : ["talkerId","sentenceType","TcOfAssociatedGgaFix","StandardDeviationMetersOfSemiMajor","StandardDeviationMetersOfSemiMinor","OrientationOfSemiMajorAxisOfErrorEllipse","StandardDeviationMetersOfLatitudeError","StandardDeviationMetersOfLongitudeError","StandardDeviationMetersOfAltitudeError","checksum"],	
				VTG : ["talkerId","sentenceType","CourseOverGroundDegreesTrue","T","CourseOverGroundDegreesMagnetic","M","SpeedOverGroundKnots","N","SpeedOverGroundKmh","K","FaaModeIndicator","checksum"],	
				ZDA : ["talkerId","sentenceType","utc","Day","Month","Year","LocalZone","LocalZoneMinutes","checksum"]
				}

			// check nmeaKeyNames for sentenceType, If match call keysReduce to combine 2 array into an object. Push the combined object into output array.
			if (nmeaKeyNames[sentenceArray[indexi][1]]) {
				// GGA needs change on data for latitude and longtide directions.
				if (nmeaKeyNames[sentenceArray[indexi][1]] === 'GGA') {
					if(sentenceArray[indexi].latitudeDirection === 'S') {
						sentenceArray[indexi].latitude = '-'+ sentenceArray[indexi].latitude
					}
					if(sentenceArray[indexi].longitudeDirection === 'W') {
						sentenceArray[indexi].longitude = '-'+ sentenceArray[indexi].longitude
					}
				}
				// push merged object into output array
				parsedArray.push(keysReduce (nmeaKeyNames[sentenceArray[indexi][1]], sentenceArray[indexi]))
				console.log('pushed to parsedArray : ', parsedArray[parsedArray.length - 1])
			}
		}
	}
	// Final output array.
	console.log('final', parsedArray)
};

/* ==========================================================
#															#
#	End Defined functions and Begin Page Load				#
#															#
========================================================== */

const input = document.querySelector('input[type="file"]')

input.addEventListener('change', function (e) {
	const reader = new FileReader()
	reader.onload = function () {
		let lines = reader.result.split('\n').map(function (line) {
			return line.match(/([$0-9.-\w])+/g)
		})
		sentenceParserFunction(lines);
		let div = document.createElement('div');			
		div.innerHTML = mergedPayload;
		document.body.append(div);
	}
	reader.readAsText(input.files[0])
}, false)