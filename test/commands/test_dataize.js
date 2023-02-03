/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Yegor Bugayenko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs');
const assert = require('assert');
const path = require('path');
const {runSync} = require('../helpers');

describe('dataize', function() {
  it('runs a single executable .JAR and dataizes an object', function(done) {
    home = path.resolve('temp/test-run/simple');
    fs.rmSync(home, {recursive: true, force: true});
    fs.mkdirSync(path.resolve(home, 'src'), {recursive: true});
    fs.writeFileSync(
      path.resolve(home, 'src/simple.eo'),
      [
        '+package foo.bar',
        '+alias org.eolang.io.stdout',
        '+alias org.eolang.txt.sprintf',
        '+alias org.eolang.collections.list',
        '',
        '[args...] > app',
        '  seq > @',
        '    reduced.',
        '      list',
        '        * 0 1 2 3 4 5 6 7 8 9 10 0 1 2 3 4 5 6 7 8 9 10 0 1 2 3 4 5 6 7 8 9 10',
        '      TRUE',
        '      [a x]',
        '        TRUE > @',
        '    stdout',
        '      sprintf "Hello, %s!" (args.at 0)',
      ].join('\n')
    );
    const stdout = runSync([
      'dataize', 'foo.bar.app', 'Jeff',
      '--verbose',
      '--stack=64M',
      '--clean',
      '-s', path.resolve(home, 'src'),
      '-t', path.resolve(home, 'target'),
    ]);
    assert(stdout.includes('Hello, Jeff!'), stdout);
    assert(stdout.includes(`The directory ${path.resolve(home, 'target')} deleted`), stdout);
    assert(!fs.existsSync(path.resolve('../../mvnw/target')));
    done();
  });
});
