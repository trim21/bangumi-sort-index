const {
  author,
  description,
  dependencies,
  name,
  repository,
  version,
} = require('../package.json');

module.exports = {
  name: name,
  'name:zh': '排序首页条目',
  namespace: 'https://trim21.me/',
  description,
  version: version,
  author: author,
  source: repository.url,
  supportURL: repository.url + '/issues',
  license: 'MIT',
  include: String.raw`/^https://(bangumi\.tv|bgm\.tv|chii\.in)/[^/]*/`,
  require: [
    `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  'run-at': 'document-end',
  grant: 'GM_addStyle',
};
