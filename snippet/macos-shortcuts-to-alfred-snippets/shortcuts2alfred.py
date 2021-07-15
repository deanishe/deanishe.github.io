#!/usr/bin/python
# encoding: utf-8
#
# Copyright (c) 2020 Dean Jackson <deanishe@deanishe.net>
# MIT Licence. See http://opensource.org/licenses/MIT
#
# Created on 2020-06-22
#

"""Convert macOS text shortcuts to Alfred snippets."""

from __future__ import print_function, absolute_import

from collections import namedtuple
import csv
import json
import os
from os.path import expanduser, join, realpath
from subprocess import check_output
import sys


# directory to save snippets to
SNIPPET_DIR = os.getenv('SNIPPET_DIR') or '.'
COLLECTION_NAME = os.getenv('COLLECTION_NAME') or 'macOS'


DBPATH = expanduser('~/Library/KeyboardServices/TextReplacements.db')
QUERY = """
select ZUNIQUENAME, ZSHORTCUT, ZPHRASE
    from ZTEXTREPLACEMENTENTRY
    where ZWASDELETED = 0;
"""


Shortcut = namedtuple('Shortcut', 'uid keyword snippet')


def log(s, *args, **kwargs):
    """Log to STDERR."""
    if args:
        s = s % args
    elif kwargs:
        s = s % kwargs

    print(s, file=sys.stderr)


def load_shortcuts():
    """Read shortcuts from system SQLite database."""
    output = check_output(['/usr/bin/sqlite3', '-csv', DBPATH, QUERY])
    reader = csv.reader(output.split('\n'), delimiter=',', quotechar='"')
    shortcuts = []
    for row in reader:
        if len(row) == 3:
            sc = Shortcut(*[s.decode('utf-8') for s in row])
            if sc.keyword == sc.snippet:  # ignore do-nothing shortcuts
                continue
            shortcuts.append(sc)

    return shortcuts


def shortcut_to_snippet(shortcut):
    """Create Alfred snippet dict from macOS shortcut."""
    return {
        'alfredsnippet': {
            'snippet': shortcut.snippet,
            'uid': shortcut.uid,
            'name': shortcut.keyword,
            'keyword': shortcut.keyword,
        }
    }


def safename(s):
    """Make filesystem-safe name."""
    for c in ('/', ':'):
        s = s.replace(c, '-')
    return s


def export_shortcuts(shortcuts, dirpath):
    """Save macOS shortcuts to directory as Alfred snippets."""
    log('exporting snippets to %r ...', dirpath)
    if not os.path.exists(dirpath):
        os.makedirs(dirpath, 0700)

    # remove existing snippets
    for name in os.listdir(dirpath):
        if name.endswith('.json'):
            os.unlink(os.path.join(dirpath, name))

    for i, sc in enumerate(shortcuts):
        name = u'%s [%s].json' % (safename(sc.keyword), sc.uid)
        path = join(dirpath, name.encode('utf-8'))
        log('[%d/%d] saving snippet %r to %r ...', i+1, len(shortcuts), sc.keyword, path)
        with open(path, 'wb') as fp:
            json.dump(shortcut_to_snippet(sc), fp, indent=2, separators=(',', ': '))


def main():
    """Run script."""
    shortcuts = load_shortcuts()
    log('loaded %d macOS shortcut(s)', len(shortcuts))
    dirpath = realpath(expanduser(join(SNIPPET_DIR, COLLECTION_NAME)))
    export_shortcuts(shortcuts, dirpath)


if __name__ == '__main__':
    main()
