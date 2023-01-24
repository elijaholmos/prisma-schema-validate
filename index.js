import { info } from '@actions/core';
import { spawn } from 'child_process';

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

export default async function main() {
	info('Installing Prisma...');
	await installPrisma();
	info('Prisma installed!');

	const cp = spawn('npx', ['prisma', 'validate'], {
		stdio: 'inherit',
	});

	cp.on('message', info);
}
