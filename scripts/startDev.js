const spawn = require('cross-spawn');

spawn('vite', [], {
	stdio: 'inherit'
});

spawn('tsc', ['--watch'], {
	stdio: 'inherit'
});
