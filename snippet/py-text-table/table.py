#!/usr/bin/env python
# encoding: utf-8
#
# Copyright (c) 2016 Dean Jackson <deanishe@deanishe.net>
#
# MIT Licence. See http://opensource.org/licenses/MIT
#
# Created on 2016-12-19
#

"""Text table.

Pretty-print tabular data in the terminal. Smart alignment of numbers.
"""

from __future__ import print_function, absolute_import

import re


def unicodify(obj):
    if isinstance(obj, unicode):
        return obj
    if isinstance(obj, str):
        return obj.decode('utf-8')
    return unicode(obj)


class Table(object):

    def __init__(self, titles=None):
        self.centred_titles = True
        self.rows = []
        self._titlerows = []
        self._size = 0
        if titles:
            self.add_row(titles, True)

    def add_row(self, row, title=False):
        self.rows.append(row)
        if title:
            self._titlerows.append(True)
        else:
            self._titlerows.append(False)

    def __unicode__(self):
        # Calculate column parameters
        ncols = max([len(r) for r in self.rows])
        widths = [0] * ncols  # width of each column
        formats = [None] * ncols  # format string for each column
        # calculate column widths
        for r in self.rows:
            for i, n in enumerate([len(unicodify(c)) for c in r]):
                widths[i] = max([widths[i], n])

        # Widget
        hr = [(u'-' * w) for w in widths]
        hr = u'---'.join(hr)

        # Get row data formatted to length
        lines = []
        for y, r in enumerate(self.rows):
            title = self._titlerows[y]
            objs = list(r)
            while len(objs) < ncols:  # Ensure row is long enough
                objs.append(u'')

            # Format each cell
            data = []
            for i, o in enumerate(objs):
                u = unicodify(o)
                w = widths[i]

                # Column formatting
                # left-align by default
                fmt = u'{{:{}s}}'.format(w)
                if title and self.centred_titles:  # centre-align titles
                    fmt = u'{{:^{}s}}'.format(w)

                elif u.strip():  # Use or determine default for this column
                    if formats[i]:
                        fmt = formats[i]
                    elif re.match(r'[$€£]?\s*[0-9,.% ]+', u):  # number
                            fmt = u'{{:>{}s}}'.format(w)
                    # Save as default for this column
                    formats[i] = fmt

                u = fmt.format(u)
                data.append(u)

            # Combine cells into text for row
            u = u' | '.join(data)
            lines.append(u)
            if title:
                lines.append(hr)

        return u'\n'.join([s.rstrip() for s in lines])

    def __str__(self):
        return self.__unicode__().encode('utf-8')


if __name__ == '__main__':
    data = [
        ('Dave Smith', 22, 'carpenter'),
        ('Ronald McDonald', 7, 'schoolboy'),
        ('Davy Jones', 57, 'boxer'),
        ('Reggie Becker', 83),
        ('Ricky Bobby', 28, 'racing driver', 'fraud'),
        ('Spanish Harlan', 22, 'DJ', '100', '$30'),
        ('Fast Howie', 42, 'gunfighter', '27 kills', 'dolla dolla'),
    ]
    if False:
        t = Table(titles=['Name', 'Current Age', 'Occupation'])
        for row in data:
            t.add_row(row)
        print(t)
        print('========================')

    t2 = Table(titles=['Name', 'Current Age', 'Occupation'])
    for row in data:
        t2.add_row(row)

    # t2.centred_titles = False
    print(t2)
