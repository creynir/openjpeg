module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: [
      'dist',
      'build',
      'bin'
    ],
    version: {
      // options: {},
      defaults: {
        src: ['wrapping/js/openjp2/header.js']
      }
    },
    run: {
      options: {
        // Task-specific options go here.
      },
      cmakegen: {
        cmd: 'cmake',
        args: [
          '-DCMAKE_TOOLCHAIN_FILE=/Users/jdrago/emsdk/emscripten/1.37.35/cmake/Modules/Platform/Emscripten.cmake',
          '-DCMAKE_BUILD_TYPE=Release',
          '-DBUILD_CODEC=OFF',
          '-DBUILD_JS=ON',
          '-DBUILD_SHARED_LIBS=OFF',
          '-GUnix Makefiles',
          '.'
        ]
      },
      cmakedot: {
        cmd: 'cmake',
        args: [
          '.'
        ]
      },
      make: {
        cmd: 'make',
        args: [
        ]
      },
      emccbuild: {
        cmd: './emccbuild.sh'
      }
    },
    concat: {
      distOpenJPEGFixedMemoryBrowser: {
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> ' +
          '| (c) 2016 Chris Hafey | https://github.com/chafey/openjpeg */\n'
        },
        src : ['build/openJPEG-FixedMemory-browser.js'],
        dest: 'dist/openJPEG-FixedMemory-browser.js'
      },
      distOpenJPEGDynamicMemoryBrowser: {
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> ' +
          '| (c) 2016 Chris Hafey | https://github.com/chafey/openjpeg */\n'
        },
        src : ['build/openJPEG-DynamicMemory-browser.js'],
        dest: 'dist/openJPEG-DynamicMemory-browser.js'
      },
      distOpenJPEGFixedMemoryCommonJS: {
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> ' +
          '| (c) 2016 Chris Hafey | https://github.com/chafey/openjpeg */\n'
        },
        src : ['build/openJPEG-FixedMemory-commonJS.js'],
        dest: 'dist/openJPEG-FixedMemory-commonJS.js'
      },
      distOpenJPEGDynamicMemoryCommonJS: {
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> ' +
          '| (c) 2016 Chris Hafey | https://github.com/chafey/openjpeg */\n'
        },
        src : ['build/openJPEG-DynamicMemory-commonJS.js'],
        dest: 'dist/openJPEG-DynamicMemory-commonJS.js'
      }

    },

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('buildAll', ['clean','run:cmakegen','run:cmakedot','run:make', 'version', 'run:emccbuild', 'concat']);
  grunt.registerTask('default', ['buildAll']);
};

// Release process:
//  1) Update version number in package.json
//  2) do a build (needed to update dist versions with correct build number)
//      grunt
//  3) commit changes
//      git commit -am "Changes...."
//  4) tag the commit
//      git tag -a 0.1.0 -m "Version 0.1.0"
//  5) push to github
//      git push origin master --tags
//  6) Update npm
//      npm publish
