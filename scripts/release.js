import minimist from 'minimist'
import path from 'path'
import enquirer from 'enquirer'
import { execa } from 'execa'
import fs from 'fs'

const args = minimist(process.argv.slice(2))

const { prompt } = enquirer
const run = (bin, args, opts = {}) =>
	execa(bin, args, { stdio: 'inherit', ...opts })

const main = async () => {
	let targetVersion = args._[0]

	if (!targetVersion) {
		const date = new Date()
		const yyyy = date.getUTCFullYear()
		const MM = (date.getUTCMonth() + 1).toString().padStart(2, '0')
		const dd = date.getUTCDate().toString().padStart(2, '0')
		targetVersion = `${yyyy}.${MM}.${dd}`
		const { version } = await prompt({
			type: 'input',
			name: 'version',
			message: 'input version',
			initial: targetVersion,
		})
		if (!version) return
		targetVersion = version
	}
	updateVersions(targetVersion)
}

function updateVersions(version) {
	updatePackage(process.cwd(), version)
}
function updatePackage(pkgRoot, version) {
	const pkgPath = path.resolve(pkgRoot, 'package.json')
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
	pkg.version = version
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
	run(`pnpm`, ['run', 'changelog'])
}

main()
