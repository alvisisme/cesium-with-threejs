const fsExtra = require('fs-extra')
const gulp = require('gulp')
const Promise = require('bluebird')

// Copies relevant parts of client JS libraries to `public/ThirdParty` for local development
gulp.task('postInstall', function () {
  const thirdPartyDirectory = 'src/thirdparty'
  fsExtra.removeSync(thirdPartyDirectory)

  console.log('post install......')
  var webSiteLibs = [
    {
      name: 'Cesium',
      glob: [
        'node_modules/cesium/Source/**'
      ],
      subDir: true
    }, {
      name: 'Three',
      glob: [
        'node_modules/three/src/**'
      ],
      subDir: true
    }
  ]

  var promises = []
  webSiteLibs.forEach(function (module) {
    var dest = thirdPartyDirectory
    if (module.subDir) {
      dest += '/' + module.name
    }

    var options = {
      nodir: true,
      base: module.base
    }
    console.log(dest)
    promises.push(streamToPromise(gulp.src(module.glob, options).pipe(gulp.dest(dest))))
  })

  return Promise.all(promises)
})

function streamToPromise (stream) {
  return new Promise(function (resolve, reject) {
    stream.on('finish', resolve)
    stream.on('end', reject)
  })
}
