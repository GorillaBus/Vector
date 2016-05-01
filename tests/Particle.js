var sinon = require('sinon');
var assert = require('chai').assert;

var Vector = require('../src/lib/Vector');
var Particle = require('../src/lib/Particle');

suite('Particle', function() {

    var sut,
    expectedProperties,
    round;

    setup(function() {
        sut = Object.create(Particle);
        round = function (num) {
            return Math.round(num*100)/100;
        }
    });

    suite('General', function() {

        test('must be a JavaScript Object with \'create\' function', function() {
            assert.isObject(sut);
            assert.isFunction(sut.create)
        });

        test('must create a Particle with default settings when no argument passed', function() {
            var particle = sut.create();
            assert.isObject(particle);
        });

        test('must create a Particle with given settings', function() {
            var particleSettings = {
                x: 200,
                y: 300,
                speed: 34.13,
                direction: 3.14,
                gravity: 0.1
            }
            var particle = sut.create(particleSettings);
            assert.isObject(particle);
            assert.equal(particle.position.getX(), particleSettings.x);
            assert.equal(particle.position.getY(), particleSettings.y);
            assert.equal(round(particle.velocity.getLength()), particleSettings.speed);
            assert.equal(round(particle.velocity.getAngle()), particleSettings.direction);
            assert.equal(particle.gravity.getX(), 0);            
            assert.equal(particle.gravity.getY(), particleSettings.gravity);     
        }); 

        test('new particle must have default functions', function() {
            var particle = sut.create();
            assert.isFunction(particle.accelerate);
            assert.isFunction(particle.update);
            assert.isFunction(particle.create);
        });

    });

    suite('Particle properties', function() {

        test('new particle must have default vectors', function() {
            var particle = sut.create();
            assert.property(particle, 'position');
            assert.isObject(particle.position);
            assert.isNumber(particle.position.getX());
            assert.isNumber(particle.position.getX());
            assert.property(particle, 'velocity');
            assert.isObject(particle.velocity);            
            assert.isNumber(particle.velocity.getX());
            assert.isNumber(particle.velocity.getX());
            assert.property(particle, 'gravity');
            assert.isObject(particle.gravity);             
            assert.isNumber(particle.gravity.getX());
            assert.isNumber(particle.gravity.getX());
        });



        test('must add to velocity vector on accelerate', function() {
            var particle = sut.create();
            var vector = Vector.create({
                x: 1,
                y: 1
            });
            assert.equal(particle.velocity.getX(), 0);
            particle.accelerate(vector);
            assert.equal(particle.velocity.getX(), 1);
            particle.accelerate(vector);
            assert.equal(particle.velocity.getX(), 2);           
        });

        test('must add position vector on update and call accelerate', function() {
            var particleSettings = {
                x: 200,
                y: 300,
                speed: 2,
                direction: 3.14
            };
            var particle = sut.create(particleSettings);
            particle.update();
            assert.equal(round(particle.position.getX()), 198);
            particle.update();
            assert.equal(round(particle.position.getX()), 196);
            particle.update();
            assert.equal(round(particle.position.getX()), 194);
        });
      
    });

    
});
