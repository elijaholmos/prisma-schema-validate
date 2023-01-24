const { getInput } = require('@actions/core');
const { error } = require('@actions/core');
const { info } = require('@actions/core');
const { spawn } = require('node:child_process');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const resolvePrismaVersion = async function () {
	// check input version first
	const version = getInput('version');
	if (!!version) {
		info(`Found Prisma version ${version} in action configuration`);
		return version;
	}

	// check package.json
	const { GITHUB_WORKSPACE } = process.env;
	if (!GITHUB_WORKSPACE) {
		throw new Error(`No workspace is found.
            If you're intended to let elijaholmos/prisma-schema-validate read preferred Prisma version from the package.json file,
            please run the actions/checkout before elijaholmos/prisma-schema-validate.
            Otherwise, please specify the Prisma version in the action configuration.`);
	}

	// resolve & return package.json version
	const { dependencies, devDependencies } = JSON.parse(
		await readFile(join(GITHUB_WORKSPACE, 'package.json'), 'utf8')
	);
	if (!!dependencies?.prisma) {
		info(`Found Prisma version ${dependencies.prisma} in package.json dependencies`);
		return dependencies.prisma;
	}
	if (!!devDependencies?.prisma) {
		info(`Found Prisma version ${devDependencies.prisma} in package.json devDependencies`);
		return devDependencies.prisma;
	}

	info('No Prisma version found in package.json, using "latest"');
	return 'latest';
};

const installPrisma = async function ({ version = resolvePrismaVersion() } = {}) {
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
