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
