var assert = require('assert');
var enigma = require('./enigma');

describe('Plugboard', function() {
    describe('addPlug', function() {
        it('expect add letter to plugs', function() {
            var plugboard = new enigma.Plugboard();
            plugboard.addPlug('A', 'B');
            assert.equal(plugboard.plugs['A'], 'B');
        });

        it('expect add inverse letter to plugs', function() {
            var plugboard = new enigma.Plugboard();
            plugboard.addPlug('A', 'B');
            assert.equal(plugboard.plugs['B'], 'A');
        });
    });

    describe('encode', function() {
        it('expect non-plugged letter encode to itself', function() {
            var plugboard = new enigma.Plugboard();
            assert.equal(plugboard.encode('A'), 'A');
        });

        it('expect plugged letter encode to its plug output', function() {
            var plugboard = new enigma.Plugboard();
            plugboard.addPlug('A', 'B');
            assert.equal(plugboard.encode('A'), 'B');
        });
    });


    describe('addPlugs', function() {
        it('expect plugged letters encode to their plugs', function() {
            var plugboard = new enigma.Plugboard();
            plugboard.addPlugs('ABC', 'DEF');
            assert.equal(plugboard.encode('A'), 'D');
            assert.equal(plugboard.encode('B'), 'E');
            assert.equal(plugboard.encode('C'), 'F');
        });

        it('expect non-plugged letters encode to themselves', function() {
            var plugboard = new enigma.Plugboard();
            plugboard.addPlugs('ABC', 'DEF');
            assert.equal(plugboard.encode('G'), 'G');
            assert.equal(plugboard.encode('H'), 'H');
            assert.equal(plugboard.encode('I'), 'I');
        });
    });

    describe('constructor', function() {
        it('expect plugboard be configured through constructor', function() {
            var plugboard = new enigma.Plugboard('ABC', 'DEF');
            assert.equal(plugboard.encode('A'), 'D');
            assert.equal(plugboard.encode('B'), 'E');
            assert.equal(plugboard.encode('C'), 'F');
            assert.equal(plugboard.encode('G'), 'G');
            assert.equal(plugboard.encode('H'), 'H');
            assert.equal(plugboard.encode('I'), 'I');
        });

        it('expect plugboard to be reciprocal', function() {
            var plugboard = new enigma.Plugboard('ABC', 'DEF');
            assert.equal(plugboard.encode('D'), 'A');
            assert.equal(plugboard.encode('E'), 'B');
            assert.equal(plugboard.encode('F'), 'C');
        });
    });
});

describe('Rotor', function() {
    describe('addWire', function() {
        it('expect add wiring to rotor', function() {
            var rotor = new enigma.Rotor();
            rotor.addWire('A', 'B');
            assert.equal(rotor.wires['A'], 'B');
        });
    });

    describe('setWireTable', function() {
        it('expect rotor wire table to configure wires', function() {
            var rotor = new enigma.Rotor();
            rotor.setWireTable('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.wires['A'], 'E');
            assert.equal(rotor.wires['B'], 'K');
            assert.equal(rotor.wires['Z'], 'J');
        });
    });

    describe('encode', function() {
        it('expect rotor to encode with wire table', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.encode('A'), 'E');
            assert.equal(rotor.encode('B'), 'K');
            assert.equal(rotor.encode('Z'), 'J');
        });

        it('expect rotor without step encode output to input', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.encode('A'), 'E');
            assert.equal(rotor.encode('E', inverse = true), 'A');
        });
    });

    describe('constructor', function() {
        it('expect rotor be configured through constructor', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.wires['A'], 'E');
            assert.equal(rotor.wires['B'], 'K');
            assert.equal(rotor.wires['Z'], 'J');
        });
    });

    describe('step', function() {
        it('expect step change first encoded letter', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.wires['A'], 'E');
            rotor.step();
            assert.equal(rotor.wires['A'], 'K');
        });

        it('expect step change last encoded letter', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.wires['Z'], 'J');
            rotor.step();
            assert.equal(rotor.wires['Z'], 'E');
        });
    });

    describe('turnover', function() {
        it('expect turnover to be reached after 26 steps', function() {
            var rotor1 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            var rotor2 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            rotor1.nextRotor = rotor2;

            assert.equal(rotor1.wires['A'], 'E');
            assert.equal(rotor2.wires['A'], 'E');

            for (var i = 0; i < 26; i++)
                rotor1.step();

            assert.equal(rotor1.wires['A'], 'E');
            assert.equal(rotor2.wires['A'], 'K');
        });

        it('expect turnover without next rotor maintain encoding', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            assert.equal(rotor.wires['A'], 'E');

            for (var i = 0; i < 26; i++)
                rotor.step();

            assert.equal(rotor.wires['A'], 'E');
        });
    });
});

describe('Reflector', function() {
    describe('encode', function() {
        it('expect encode to return the opposite letter', function() {
                var reflector = new enigma.Reflector();
                assert.equal(reflector.encode('A'), 'Z');
                assert.equal(reflector.encode('Z'), 'A');
        });
    });
});

describe('Machine', function() {
    describe('encode', function() {
        it('expect encode to return a letter different from the given one',
            function() {
                var machine = new enigma.Machine();
                assert.notEqual(machine.encode('A'), 'A');
        });

        it('expect encode with encoded letter to be the original one',
            function() {
                var machine_encode = new enigma.Machine();
                var input = 'A';
                var output = machine_encode.encode(input);

                var machine_decode = new enigma.Machine();
                assert.equal(machine_decode.encode(output), input);
        });
    });
});