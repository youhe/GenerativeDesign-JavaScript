var base = {
  devDir: './src/',
  pubDir: './public/',
};

var dir = {
  ts: base.devDir + 'ts/',
  js: base.pubDir + '/',
};

var tsPath = {
  // outputFileName:[
  //   dir.ts + 'hoge/hoge.ts',
  //   dir.ts + 'fuga/fuga.ts'
  // ],
  'P_1_0_01//js/app':[
    dir.ts + 'P_1_0_01/app.ts'
  ],
};

module.exports = {
  watch: {
    sass: dir.sass,
    css: dir.css,
    html: dir.html,
    ts: dir.ts,
  },
  typeScript: {
    path: tsPath,
    ts: dir.ts,
    js: dir.js,
  },
  browserSync: {
    html: dir.html,
    proxy: 'localhost:8067'
  }
};
