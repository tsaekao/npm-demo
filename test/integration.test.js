////// Integration-style tests using public RTV.js interface

import { expect } from 'chai';

import * as rtv from '../src/rtv';

import { RtvSuccess } from '../src/lib/RtvSuccess';
import { RtvError } from '../src/lib/RtvError';

describe('Integration', function () {
  describe('Typesets', function () {
    it('should be valid non-fully-qualified typesets', function () {
      rtv.isTypeset([rtv.BOOLEAN, [rtv.STRING], [rtv.INT]], { deep: true });
    });
  });

  describe('Simple TODO items', function () {
    let item;
    let shape;

    beforeEach(function () {
      item = {
        title: 'Make Christmas Oatmeal',
        due: new Date('12/25/2018'),
        priority: 1,
        note: {
          text: 'Make 4 cups to have enough to share!',
          updated: new Date('09/21/2018'),
        },
      };

      shape = {
        title: rtv.STRING,
        created: [rtv.OPTIONAL, rtv.DATE],
        priority: [rtv.INT, { oneOf: [0, 1, 2] }],
        note: [
          rtv.EXPECTED,
          {
            text: rtv.STRING,
            updated: rtv.DATE,
          },
        ],
      };
    });

    it('should validate', function () {
      const result = rtv.check(item, shape);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });
  });

  describe('Advanced TODO items', function () {
    let item;
    let shapes;

    beforeEach(function () {
      item = {
        title: 'Make Christmas Oatmeal',
        due: new Date('12/25/2018'),
        priority: 1,
        notes: [
          {
            text: 'Ingredients: Cranberries, apples, cinnamon, walnuts, raisins, maple syrup.',
            updated: new Date('09/20/2018'),
          },
          {
            text: 'Make 4 cups to have enough to share!',
            updated: new Date('09/21/2018'),
          },
        ],
      };

      shapes = {
        get todo() {
          return {
            title: rtv.STRING,
            due: rtv.DATE,
            priority: [rtv.INT, { oneOf: [1, 2, 3, 4] }],
            notes: [[this.note]],
          };
        },
        get note() {
          return {
            text: rtv.STRING,
            updated: rtv.DATE,
          };
        },
      };
    });

    it('should validate', function () {
      const result = rtv.check(item, shapes.todo);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should fail if a note is missing "updated"', function () {
      delete item.notes[1].updated;

      const todoShape = shapes.todo;
      const result = rtv.check(item, todoShape);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.value).to.equal(item);
      expect(result.typeset).to.equal(todoShape);
      expect(result.mismatch).to.eql(rtv.fullyQualify(shapes.note.updated));
      expect(result.path).to.eql(['notes', '1', 'updated']);
    });
  });

  describe('Dynamic Note class', function () {
    it('creates a class from a shape with setters that verify values', function () {
      const { STRING, DATE } = rtv.types; // some types
      const { EXPECTED } = rtv.qualifiers; // some qualifiers
      const tags = ['car', 'money', 'reminder', 'grocery'];

      const noteShape = {
        // required, non-empty string
        text: STRING,
        // required array (could be empty) of non-empty tags names from the user's
        //  list of "tags"
        tags: [[STRING, { oneOf: tags }]],
        created: DATE, // required Date when the note was created
        updated: [EXPECTED, DATE], // expected date of update (either null, or Date)
      };

      const classGenerator = function (shape) {
        const ctor = function (initialValues) {
          // by definition, a shape descriptor is made-up of its own-enumerable
          //  properties, so we enumerate them
          const props = Object.keys(shape);

          const typesets = {}; // prop -> fully-qualified array typeset
          const values = {}; // prop -> value

          let initializing = true; // true while we apply "initialValues"

          props.forEach((prop) => {
            typesets[prop] = rtv.fullyQualify(shape[prop]);

            Object.defineProperty(this, prop, {
              enumerable: true,
              configurable: true, // could be false to lock this down further
              get() {
                return values[prop];
              },
              set(newValue) {
                const typeset = typesets[prop].concat(); // shallow clone

                if (initializing) {
                  // allow each property to be initially null, or as the typeset specifies
                  //  so we don't end-up with junk data
                  // NOTE: in a fully-qualified typeset, the qualifier is always the
                  //  first element
                  typeset[0] = EXPECTED;
                }

                // we assume there are no interdependencies between nested typesets
                // this verification will throw an RtvError if the "newValue"
                //  violates the property's typeset
                rtv.verify(newValue, typeset);

                values[prop] = newValue;
              },
            });

            if (initialValues && initialValues.hasOwnProperty(prop)) {
              // go through the setter for verification
              this[prop] = initialValues[prop];
            } else {
              // initialize to null
              values[prop] = null;
            }
          });

          initializing = false;
        };

        return ctor;
      };

      const Note = classGenerator(noteShape);
      let note = new Note();

      expect(Object.keys(note)).to.eql(Object.keys(noteShape));
      expect(function () {
        note.text = null;
      }).to.throw(RtvError);

      expect(function () {
        note = new Note({
          text: null,
          tags: [],
        });
      }).not.to.throw();
      expect(note.text).to.equal(null);
      expect(note.tags).to.eql([]);
      expect(function () {
        note.text = 'Awesome';
      }).not.to.throw();
    });
  });

  describe('Reactive Validations', function () {
    it('validates an object with varying property values', function () {
      const { STRING, DATE, SAFE_INT } = rtv.types;
      const { EXPECTED } = rtv.qualifiers;
      const tags = ['car', 'money', 'reminder', 'grocery'];

      const noteShape = {
        text: STRING,
        tags: [[STRING, { oneOf: tags }]],
        tagCount: [
          SAFE_INT,
          (value, match, typeset, context) => {
            if (value !== context.originalValue.tags.length) {
              throw new Error('tags and tagCount mismatch');
            }
          },
        ],
        created: DATE,
        updated: [EXPECTED, DATE],
      };

      const note = {
        text: 'Buy potatoes',
        tags: ['reminder', 'grocery'],
        tagCount: 1,
        created: new Date(Date.now()),
        updated: null,
      };

      const result = rtv.check(note, noteShape);

      expect(result).to.be.an.instanceOf(RtvError);
      expect(result.rootCause).to.be.an.instanceOf(Error);
      expect(result.rootCause.message).to.equal('tags and tagCount mismatch');
    });

    it('validates a NESTED object with varying property values', function () {
      const { STRING, DATE, SAFE_INT } = rtv.types;
      const { EXPECTED } = rtv.qualifiers;
      const tags = ['car', 'money', 'reminder', 'grocery'];

      const noteShape = {
        text: STRING,
        tags: [[STRING, { oneOf: tags }]],
        tagCount: [
          SAFE_INT,
          (value, match, typeset, context) => {
            if (value !== context.parent.tags.length) {
              throw new Error('tags and tagCount mismatch');
            }
          },
        ],
        created: DATE,
        updated: [EXPECTED, DATE],
      };

      const note = {
        text: 'Buy potatoes',
        tags: ['reminder', 'grocery'],
        tagCount: 1,
        created: new Date(Date.now()),
        updated: null,
      };

      let result = rtv.check([note], [[noteShape]]);

      expect(result).to.be.an.instanceOf(RtvError);
      expect(result.rootCause).to.be.an.instanceOf(Error);
      expect(result.rootCause.message).to.equal('tags and tagCount mismatch');

      result = rtv.check(
        {
          notes: [note],
        },
        {
          notes: [[noteShape]],
        }
      );

      expect(result).to.be.an.instanceOf(RtvError);
      expect(result.rootCause).to.be.an.instanceOf(Error);
      expect(result.rootCause.message).to.equal('tags and tagCount mismatch');
    });
  });

  describe('Minimum Viable Value', () => {
    it('reduces deep into nested objects and arrays', () => {
      const tasks = [
        {
          title: 'Implement the feature',
          description: 'A very long description...',
          due: new Date(),
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
            { id: 3, name: 'tag3' },
          ],
          notes: [
            {
              text: 'Note 1',
              author: 'Sam',
              date: new Date(),
              tags: [
                { id: 4, name: 'tag4' },
                { id: 5, name: 'tag5' },
                { id: 6, name: 'tag6' },
              ],
            },
            {
              text: 'Note 2',
              author: 'Susie',
              date: new Date(),
              tags: [
                { id: 7, name: 'tag7' },
                { id: 8, name: 'tag8' },
                { id: 9, name: 'tag9' },
              ],
            },
          ],
        },
        {
          title: 'Add the tests',
          description: 'Long description...',
          due: new Date(),
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
          ],
          notes: [
            {
              text: 'Note 1',
              author: 'Melissa',
              date: new Date(),
              tags: [{ id: 4, name: 'tag4' }],
            },
            {
              text: 'Note 2',
              author: 'Patrick',
              date: new Date(),
              tags: [
                { id: 8, name: 'tag8' },
                { id: 9, name: 'tag9' },
              ],
            },
            {
              text: 'Note 3',
              author: 'Melissa',
              date: new Date(),
              tags: [
                { id: 3, name: 'tag3' },
                { id: 4, name: 'tag4' },
              ],
            },
          ],
        },
      ];

      const result = rtv.verify(tasks, [
        [
          {
            title: rtv.STRING,
            tags: [[{ name: rtv.STRING }]],
            notes: [
              [
                {
                  text: rtv.STRING,
                  tags: [
                    [
                      {
                        id: rtv.SAFE_INT,
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
      ]);

      expect(result.mvv).to.eql([
        {
          title: tasks[0].title,
          tags: [
            { name: tasks[0].tags[0].name },
            { name: tasks[0].tags[1].name },
            { name: tasks[0].tags[2].name },
          ],
          notes: [
            {
              text: tasks[0].notes[0].text,
              tags: [
                { id: tasks[0].notes[0].tags[0].id },
                { id: tasks[0].notes[0].tags[1].id },
                { id: tasks[0].notes[0].tags[2].id },
              ],
            },
            {
              text: tasks[0].notes[1].text,
              tags: [
                { id: tasks[0].notes[1].tags[0].id },
                { id: tasks[0].notes[1].tags[1].id },
                { id: tasks[0].notes[1].tags[2].id },
              ],
            },
          ],
        },
        {
          title: tasks[1].title,
          tags: [
            { name: tasks[1].tags[0].name },
            { name: tasks[1].tags[1].name },
          ],
          notes: [
            {
              text: tasks[1].notes[0].text,
              tags: [{ id: tasks[1].notes[0].tags[0].id }],
            },
            {
              text: tasks[1].notes[1].text,
              tags: [
                { id: tasks[1].notes[1].tags[0].id },
                { id: tasks[1].notes[1].tags[1].id },
              ],
            },
            {
              text: tasks[1].notes[2].text,
              tags: [
                { id: tasks[1].notes[2].tags[0].id },
                { id: tasks[1].notes[2].tags[1].id },
              ],
            },
          ],
        },
      ]);
    });

    it('reduces deep into maps', () => {
      // mapping tasks to notes
      const entries = [
        // first entry
        [
          // KEY (task)
          {
            title: 'Implement the feature',
            description: 'A very long description...',
            due: new Date(),
            tags: [
              { id: 1, name: 'tag1' },
              { id: 2, name: 'tag2' },
              { id: 3, name: 'tag3' },
            ],
          },
          // VALUE (notes)
          [
            {
              text: 'Note 1',
              author: 'Sam',
              date: new Date(),
              tags: [
                { id: 4, name: 'tag4' },
                { id: 5, name: 'tag5' },
                { id: 6, name: 'tag6' },
              ],
            },
            {
              text: 'Note 2',
              author: 'Susie',
              date: new Date(),
              tags: [
                { id: 7, name: 'tag7' },
                { id: 8, name: 'tag8' },
                { id: 9, name: 'tag9' },
              ],
            },
          ],
        ],

        // second entry
        [
          // KEY (task)
          {
            title: 'Add the tests',
            description: 'Long description...',
            due: new Date(),
            tags: [
              { id: 1, name: 'tag1' },
              { id: 2, name: 'tag2' },
            ],
          },
          // VALUE (notes)
          [
            {
              text: 'Note 1',
              author: 'Melissa',
              date: new Date(),
              tags: [{ id: 4, name: 'tag4' }],
            },
            {
              text: 'Note 2',
              author: 'Patrick',
              date: new Date(),
              tags: [
                { id: 8, name: 'tag8' },
                { id: 9, name: 'tag9' },
              ],
            },
            {
              text: 'Note 3',
              author: 'Melissa',
              date: new Date(),
              tags: [
                { id: 3, name: 'tag3' },
                { id: 4, name: 'tag4' },
              ],
            },
          ],
        ],
      ];

      const result = rtv.verify(new Map(entries), [
        rtv.MAP,
        {
          $keys: {
            title: rtv.STRING,
            tags: [[{ name: rtv.STRING }]],
          },
          $values: [
            [
              {
                text: rtv.STRING,
                tags: [
                  [
                    {
                      id: rtv.SAFE_INT,
                    },
                  ],
                ],
              },
            ],
          ],
        },
      ]);

      expect(Array.from(result.mvv.entries())).to.eql([
        // first entry
        [
          // KEY (task)
          {
            title: entries[0][0].title,
            tags: [
              { name: entries[0][0].tags[0].name },
              { name: entries[0][0].tags[1].name },
              { name: entries[0][0].tags[2].name },
            ],
          },

          // VALUE (notes)
          [
            {
              text: entries[0][1][0].text,
              tags: [
                { id: entries[0][1][0].tags[0].id },
                { id: entries[0][1][0].tags[1].id },
                { id: entries[0][1][0].tags[2].id },
              ],
            },
            {
              text: entries[0][1][1].text,
              tags: [
                { id: entries[0][1][1].tags[0].id },
                { id: entries[0][1][1].tags[1].id },
                { id: entries[0][1][1].tags[2].id },
              ],
            },
          ],
        ],

        // second entry
        [
          // KEY (task)
          {
            title: entries[1][0].title,
            tags: [
              { name: entries[1][0].tags[0].name },
              { name: entries[1][0].tags[1].name },
            ],
          },

          // VALUE (notes)
          [
            {
              text: entries[1][1][0].text,
              tags: [{ id: entries[1][1][0].tags[0].id }],
            },
            {
              text: entries[1][1][1].text,
              tags: [
                { id: entries[1][1][1].tags[0].id },
                { id: entries[1][1][1].tags[1].id },
              ],
            },
            {
              text: entries[1][1][2].text,
              tags: [
                { id: entries[1][1][2].tags[0].id },
                { id: entries[1][1][2].tags[1].id },
              ],
            },
          ],
        ],
      ]);
    });
  });
});
