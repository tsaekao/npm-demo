////// Integration-style tests using public RTV.js interface

import {expect} from 'chai';

import rtv from '../src/rtv';

import impl from '../src/lib/impl';
import RtvSuccess from '../src/lib/RtvSuccess';
import RtvError from '../src/lib/RtvError';

describe('integration', function() {
  describe('todos', function() {
    let todo;
    let shapes;

    beforeEach(function() {
      todo = {
        title: 'Make Christmas Oatmeal',
        due: new Date('12/25/2018'),
        priority: 1,
        notes: [
          {
            text: 'Ingredients: Cranberries, apples, cinnamon, walnuts, raisins, maple syrup.',
            updated: new Date('09/20/2018')
          },
          {
            text: 'Make 4 cups to have enough to share!',
            updated: new Date('09/21/2018')
          }
        ]
      };

      shapes = {
        get todo() {
          return {
            title: rtv.t.STRING,
            due: rtv.t.DATE,
            priority: [rtv.t.INT, {oneOf: [1, 2, 3, 4]}],
            notes: [[this.note]]
          };
        },
        get note() {
          return {
            text: rtv.t.STRING,
            updated: rtv.t.DATE
          };
        }
      };
    });

    it('should validate', function() {
      const result = rtv.check(todo, shapes.todo);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should fail if a note is missing "updated"', function() {
      delete todo.notes[1].updated;

      const todoShape = shapes.todo;
      const result = rtv.check(todo, todoShape);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.value).to.equal(todo);
      expect(result.typeset).to.equal(todoShape);
      expect(result.cause).to.eql(impl.fullyQualify(shapes.note.updated));
      expect(result.path).to.eql(['notes', '1', 'updated']);
    });
  });
});
