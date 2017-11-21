const dircompare = require('dir-compare')
const options = {compareSize: false, excludeFilter: '.DS_Store'}
const path1 = './original-images'
const path2 = './src/app/assets/images'
dircompare.compare(path1, path2, options).then(function (res) {
  console.log('equal: ' + res.equal)
  console.log('distinct: ' + res.distinct)
  console.log('left: ' + res.left)
  console.log('right: ' + res.right)
  console.log('differences: ' + res.differences)
  console.log('same: ' + res.same)
  if (!res.same) {
    const format = require('util').format
    res.diffSet.forEach(function (entry) {
      const state = {
        'equal': '==',
        'left': '->',
        'right': '<-',
        'distinct': '<>'
      }[entry.state]
      const name1 = entry.name1 ? entry.name1 : ''
      const name2 = entry.name2 ? entry.name2 : ''

      if (state !== '==') {
        console.log(format('%s(%s)%s%s(%s)', name1, entry.type1, state, name2, entry.type2))
      }
    })
    process.exit(1)
  }
}).catch(function (error) {
  console.error(error)
})
