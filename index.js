const { getInput } = require('@actions/core');
const { error } = require('@actions/core');
const { info } = require('@actions/core');
const { spawn } = require('node:child_process');

const installPrisma = async function (version = getInput('version')) {
	const cp = spawn('npm', ['install', `prisma@${version}`], {
		stdio: 'inherit',
	});

	const exitCode = await new Promise((resolve, reject) => {
		cp.on('error', reject);
		cp.on('close', resolve);
	});

	return exitCode;
};

const main = async function () {
	info('Installing Prisma...');
	await installPrisma();
	info('Prisma installed!');

	const cp = spawn('npx', ['prisma', 'validate'], {
		stdio: 'inherit',
	});

	cp.on('message', info);
	const exitCode = await new Promise((resolve, reject) => {
		cp.on('error', reject);
		cp.on('close', resolve);
	});

	return exitCode;
};

module.exports = main;

if (require.main === module) {
	main()
		.then(process.exit)
		.catch((err) => {
			error(err);
			process.exit(1);
		});
}
