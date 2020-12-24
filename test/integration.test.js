////// Integration-style tests using public RTV.js interface

import { expect } from 'chai';

import rtv from '../src/rtv';

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
            text:
              'Ingredients: Cranberries, apples, cinnamon, walnuts, raisins, maple syrup.',
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
});
