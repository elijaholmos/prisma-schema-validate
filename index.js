const { info } = require('@actions/core');
const { spawn } = require('node:child_process');

const installPrisma = async function () {
	const cp = spawn('npm', ['install', 'prisma'], {
		stdio: 'inherit',
	});

	const exitCode =
		(await new Promise()) <
		number >
		((resolve, reject) => {
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
};

module.exports = main;

if (require.main === module) {
	main().catch((err) => {
		console.log(err);
		process.exit(1);
	});
}
