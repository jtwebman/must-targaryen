# Firebase Targaryen Must Assertions

Currently [Targaryen](https://github.com/goldibex/targaryen) only has
[Chia](http://chaijs.com/) and [Jasimin](http://jasmine.github.io/) hooks but
I enjoy using [Must.js](https://github.com/moll/js-must). So I made this little
library to help out anyone else that enjoys using must but also uses Firebase.

## Installation

```bash
npm install must-targaryen --save-dev
```

## Usage

```javascript
var expect = require('must');
var mustTargaryen = require('must-targaryen');
mustTargaryen(expect);

describe('my tests', function() {
  it('test', function() {

    mustTargaryen.setFirebaseRules({ rules: {
      '.read': 'auth != null'
    }});

    mustTargaryen.setFirebaseData({
      users: {}
    });

    expect(mustTargaryen.users.unauthenticated).cannot.read.path('/users');
  });
});
```

## Release Notes
3.0.0 RC0 - 2016-12-10
- Switched to Targaryen 3.0.0-rc.0 Next version support

1.0 - 2015-11-03
- First release supporting Targaryen 2.0+
