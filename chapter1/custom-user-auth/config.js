const config = {
  development: {
    db_url: 'mongodb://localhost/ch01',
    domain: 'localhost'
  },
  test: {
    db_url: 'mongodb://localhost/ch01_test',
    domain: 'localhost'
  },
  production: {
    db_url: process.env.MONGOLAB_URI,
    domain: 'ch01.xscripter.com'
  }
};

const common = {
  github: {
    clientID: process.env.GITHUB_ID || '81b233b3394179bfe2bc',
    clientSecret: process.env.GITHUB_SECRET || 'de0322c0aa32eafaa84440ca6877ac5be9db9ca6',
    callbackURL: '/auth/github/callback'
  }
};

// For all environments, add common properties
for (let commonkey in common) {
  for (let key in config) {
    config[key][commonkey] = common[commonkey];
  }
}

module.exports = function() {
  return config[process.env.NODE_ENV || 'development'];
};
