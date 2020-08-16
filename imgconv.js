require('./JuRw')
const fs = require('fs')
const cp = require('child_process')

// usage: node imgconv.js <rawprogram0.xml> <IMAGE> <outputFile>

var programs = new XML(fs.readFileSync('./rawprogram0.xml', {encoding: 'binary'})).getByTagName('program');

var n = programs.length;

function spawnSync(a, b, c){
	console.log('Command: ', a, b);
	return cp.spawnSync(a, b, c);
}

for(var i=0;i<n;++i){
	var prog = programs[i];
	var out = spawnSync('dd', [
			'if=' + 10586.63.0115.3063.RTF.Retail.FFU',
			'of=/cygdrive/c/tmp/tmp.img',
			'bs=' + prog.SECTOR_SIZE_IN_BYTES,
			'count=' + prog.num_partition_sectors,
			'skip=' + prog.file_sector_offset,
			'seek=' + prog.start_sector,
			'conv=notrunc']);
	console.log(out.stdout.toString('binary'));
	console.log(out.stderr.toString('binary'));
}
