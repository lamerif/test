module.exports = {
	writerOpts: {
		transform: (commit, context) => {
			console.log(commit.type)
			if (commit.type === 'feat') {
				commit.type = '  Features'
			}
			return commit
		},
	},
}
