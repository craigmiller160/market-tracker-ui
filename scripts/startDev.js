const spawn = require('cross-spawn');

spawn('vite', process.argv.slice(2), {
	stdio: 'inherit'
});

spawn('tsc', ['--noEmit', '--watch'], {
	stdio: 'inherit'
});
