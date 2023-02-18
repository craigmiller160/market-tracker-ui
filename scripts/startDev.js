const spawn = require('cross-spawn');

spawn('vite', [], {
	stdio: 'inherit'
});

spawn('tsc', ['--noEmit', '--watch'], {
	stdio: 'inherit'
});
