var bleno = require('bleno');

var name = 'raspberrypi';
var serviceUuids = ['000000010000100080002f97f3b2dcd5'];
var data = new Buffer("ABCDEFG");

var readRequestHandler = function readRequest(offset, callback) {
    console.log("readRequest is recieved");

    var result = bleno.Characteristic.RESULT_SUCCESS;
    callback(result, data);
}

var writeRequestHandler = function writeRequestHandler(data, offset, withoutResponse, callback) {
    console.log("wirteRequest is recieved");
    console.log(data.toString('UTF-8'));
    
    if(!withoutResponse){
	var result = bleno.Characteristic.RESULT_SUCCESS;
	callback(result);
    }
}

var primaryService = new bleno.PrimaryService({
    uuid: '000000010000100080002f97f3b2dcd5',
    characteristics: [
        new bleno.Characteristic({
            uuid: '12345678901234567890123456789012',
            properties: ['write', 'read'],
            //value: data,
	    onReadRequest: readRequestHandler,
	    onWriteRequest: writeRequestHandler
        })
    ]
});

bleno.on('stateChange', function(state) {
    console.log('stateChange: '+state);
    if (state === 'poweredOn') {
        bleno.startAdvertising(name, serviceUuids, function(error){
            if (error) console.error(error);
        });
    } else {
        bleno.stopAdvertising();
    }
});
bleno.on('advertisingStart', function(error){
    if (!error) {
        console.log('start advertising...');
        bleno.setServices([primaryService]);
    } else {
        console.error(error);
    }
});

