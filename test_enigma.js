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
            plugboard.addPlugs('AD', 'BE', 'CF');
            assert.equal(plugboard.encode('A'), 'D');
            assert.equal(plugboard.encode('B'), 'E');
            assert.equal(plugboard.encode('C'), 'F');
        });

        it('expect non-plugged letters encode to themselves', function() {
            var plugboard = new enigma.Plugboard();
            plugboard.addPlugs('AD', 'BE', 'CF');
            assert.equal(plugboard.encode('G'), 'G');
            assert.equal(plugboard.encode('H'), 'H');
            assert.equal(plugboard.encode('I'), 'I');
        });
    });

    describe('constructor', function() {
        it('expect plugboard be configured through constructor', function() {
            var plugboard = new enigma.Plugboard('AD', 'BE', 'CF');
            assert.equal(plugboard.encode('A'), 'D');
            assert.equal(plugboard.encode('B'), 'E');
            assert.equal(plugboard.encode('C'), 'F');
            assert.equal(plugboard.encode('G'), 'G');
            assert.equal(plugboard.encode('H'), 'H');
            assert.equal(plugboard.encode('I'), 'I');
        });

        it('expect plugboard to be reciprocal', function() {
            var plugboard = new enigma.Plugboard('AD', 'BE', 'CF');
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

    describe('setWiringTable', function() {
        it('expect rotor wire table to configure wires', function() {
            var rotor = new enigma.Rotor();
            rotor.setWiringTable('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
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
            assert.equal(rotor.encode('E', true), 'A');
        });

        it('expect encode with initial position to correspond to the letter',
            function() {
                var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
                rotor.setInitialPosition('B');
                assert.equal(rotor.encode('A'), 'K');
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

        it('expect step change first inverse encoded letter', function() {
            var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            assert.equal(rotor.encode('E', true), 'A');
            rotor.step();
            assert.equal(rotor.encode('K', true), 'A');
        });
    });

    describe('turnover', function() {
        it('expect turnover to be reached after 26 steps', function() {
            var rotor1 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            var rotor2 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            rotor1.setNextRotor(rotor2);

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

        it('expect rotor configure turnover letter',
            function() {
                var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
                rotor.setTurnoverLetter('R'); // 17º letter of the alphabet
                assert.equal(rotor.turnoverCountdown, 17);
        });

        it('expect turnover with configured turnover letter to be reached ' +
            'after 17 steps', function() {
            var rotor1 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            var rotor2 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            rotor1.setTurnoverLetter('R');
            rotor1.setNextRotor(rotor2);

            assert.equal(rotor2.wires['A'], 'E');

            for (var i = 0; i < 16; i++)
                rotor1.step();

            assert.equal(rotor2.wires['A'], 'E');

            rotor1.step();

            assert.equal(rotor2.wires['A'], 'K');
        });

        it('expect encode with initial position not turnover', function() {
            var rotor1 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            var rotor2 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            rotor1.setNextRotor(rotor2);
            rotor1.setTurnoverLetter('B');
            rotor1.setInitialPosition('B');

            assert.equal(rotor2.wires['A'], 'E');
        });

        it('expect encode with initial position turnover after step',
            function() {
                var rotor1 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
                var rotor2 = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

                rotor1.setNextRotor(rotor2);
                rotor1.setTurnoverLetter('B');
                rotor1.setInitialPosition('A');
                rotor1.step();
                assert.equal(rotor2.encode('A'), 'K');
        });

        it('expect turnover countdown be always greater than zero',
            function() {
                var rotor = new enigma.Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
                rotor.setTurnoverLetter('A');
                assert.equal(rotor.turnoverCountdown, 26);
        });
    });
});

describe('Rotor Models', function() {
    var assertWiringTable = function(rotorPrototype, wiringTable) {
        var rotor = new rotorPrototype();
        var rotorWiringTable = Object.assign({}, rotor.wires);

        rotor.setWiringTable(wiringTable);

        for (var i = 0; i < enigma.LETTERS.length; i++) {
            assert.equal(
                rotorWiringTable[enigma.LETTERS[i]],
                rotor.wires[enigma.LETTERS[i]]
            );
        }
    };

    var assertTurnoverLetter = function(rotorPrototype, turnoverLetter) {
        var rotor = new rotorPrototype();
        var turnoverCountdown = rotor.turnoverCountdown;

        rotor.setTurnoverLetter(turnoverLetter);

        assert.equal(turnoverCountdown, rotor.turnoverCountdown);
    };

    describe('Rotor I', function() {
        it('expect wiring table be correctly defined', function() {
            assertWiringTable(enigma.RotorI, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ');
        });

        it('expect turnover letter be correctly defined', function() {
            assertTurnoverLetter(enigma.RotorI, 'R');
        });
    });

    describe('Rotor II', function() {
        it('expect wiring table be correctly defined', function() {
            assertWiringTable(enigma.RotorII, 'AJDKSIRUXBLHWTMCQGZNPYFVOE');
        });

        it('expect turnover letter be correctly defined', function() {
            assertTurnoverLetter(enigma.RotorII, 'F');
        });
    });

    describe('Rotor III', function() {
        it('expect wiring table be correctly defined', function() {
            assertWiringTable(enigma.RotorIII, 'BDFHJLCPRTXVZNYEIWGAKMUSQO');
        });

        it('expect turnover letter be correctly defined', function() {
            assertTurnoverLetter(enigma.RotorIII, 'W');
        });
    });

    describe('Rotor IV', function() {
        it('expect wiring table be correctly defined', function() {
            assertWiringTable(enigma.RotorIV, 'ESOVPZJAYQUIRHXLNFTGKDCMWB');
        });

        it('expect turnover letter be correctly defined', function() {
            assertTurnoverLetter(enigma.RotorIV, 'K');
        });
    });

    describe('Rotor V', function() {
        it('expect wiring table be correctly defined', function() {
            assertWiringTable(enigma.RotorV, 'VZBRGITYUPSDNHLXAWMJQOFECK');
        });

        it('expect turnover letter be correctly defined', function() {
            assertTurnoverLetter(enigma.RotorV, 'A');
        });
    });
});

describe('Reflector', function() {
    describe('setReflectionTable', function() {
        it('expect reflection table to be correctly configured', function() {
            var reflectionTable = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'
            var reflector = new enigma.Reflector();
            reflector.setReflectionTable(reflectionTable);

            for (var i = 0; i < enigma.LETTERS.length; i++) {
                letter = enigma.LETTERS[i];
                output = reflector.encode(letter);
                expected = reflectionTable[i];

                assert.equal(output, expected);
            }
        });

        it('expect reflection table be symmetric', function() {
            var reflector = new enigma.Reflector();
            reflector.setReflectionTable('YRUHQSLDPXNGOKMIEBFZCWVJAT');

            for (var i = 0; i < enigma.LETTERS.length; i++) {
                letter1 = enigma.LETTERS[i];
                outputDirect = reflector.reflectionTable[letter1];
                outputInverse = reflector.reflectionTable[outputDirect];

                assert.equal(letter1, outputInverse);
            }
        });
    });

    describe('encode', function() {
        it('expect encode to use reflection table', function() {
                var reflector = new enigma.Reflector();
                assert.equal(reflector.encode('A'),
                    reflector.reflectionTable['A']);
                assert.equal(reflector.encode('Z'),
                    reflector.reflectionTable['Z']);
        });
    });
});

describe('Reflector Models', function() {
    var assertReflectionTable = function(reflectorPrototype, reflectionTable) {
        var reflector = new reflectorPrototype();
        var reflectorReflectionTable = Object.assign({},
            reflector.reflectionTable);

        reflector.setReflectionTable(reflectionTable);

        for (var i = 0; i < enigma.LETTERS.length; i++) {
            assert.equal(
                reflectorReflectionTable[enigma.LETTERS[i]],
                reflector.reflectionTable[enigma.LETTERS[i]]
            );
        }
    };

    describe('Reflector B', function() {
        it('expect reflection table be correctly defined', function() {
            assertReflectionTable(enigma.ReflectorB,
                'YRUHQSLDPXNGOKMIEBFZCWVJAT');
        });
    });

    describe('Reflector C', function() {
        it('expect reflection table be correctly defined', function() {
            assertReflectionTable(enigma.ReflectorC,
                'FVPJIAOYEDRZXWGCTKUQSBNMHL');
        });
    });
});

describe('Machine', function() {
    describe('constructor', function() {
        it('expect three rotors encoding letter', function() {
            var machine = new enigma.Machine();
            machine.setPlugboard(new enigma.Plugboard('AB'));
            machine.setRotors(new enigma.RotorI(), new enigma.RotorII(),
                new enigma.RotorIII());
            machine.setReflector(new enigma.ReflectorB());

            assert.equal(machine.rotors.length, 3);
        });

        it('expect rotors connected for turnover', function() {
            var machine = new enigma.Machine();
            machine.setPlugboard(new enigma.Plugboard('AB'));
            machine.setRotors(new enigma.RotorI(), new enigma.RotorII(),
                new enigma.RotorIII());
            machine.setReflector(new enigma.ReflectorB());

            assert.equal(machine.rotors[0].nextRotor, machine.rotors[1]);
            assert.equal(machine.rotors[1].nextRotor, machine.rotors[2]);
        });
    });

    describe('encode', function() {
        it('expect encode to return a letter different from the given one',
            function() {
                var machine = new enigma.Machine();
                machine.setPlugboard(new enigma.Plugboard('AB'));
                machine.setRotors(new enigma.RotorI(), new enigma.RotorII(),
                    new enigma.RotorIII());
                machine.setReflector(new enigma.ReflectorB());

                assert.notEqual(machine.encode('A'), 'A');
        });

        it('expect encode with encoded letter to be the original one',
            function() {
                var machine_encode = new enigma.Machine();
                machine_encode.setPlugboard(new enigma.Plugboard('AB'));
                machine_encode.setRotors(new enigma.RotorI(),
                    new enigma.RotorII(), new enigma.RotorIII());
                machine_encode.setReflector(new enigma.ReflectorB());

                var machine_decode = new enigma.Machine();
                machine_decode.setPlugboard(new enigma.Plugboard('AB'));
                machine_decode.setRotors(new enigma.RotorI(),
                    new enigma.RotorII(), new enigma.RotorIII());
                machine_decode.setReflector(new enigma.ReflectorB());

                var input = 'A';
                var output = machine_encode.encode(input);

                assert.equal(machine_decode.encode(output), input);
        });

        it('expect rotor 0 turnover and increase rotor 1 by one step after ' +
            '26 encodes', function() {
            var machine = new enigma.Machine();
            machine.setPlugboard(new enigma.Plugboard('AB'));
            machine.setRotors(new enigma.RotorI(), new enigma.RotorII(),
                new enigma.RotorIII());
            machine.setReflector(new enigma.ReflectorB());

            var initialCountdown = machine.rotors[1].turnoverCountdown;

            for (var i = 0; i < 26; i++)
                machine.encode('A');

            var finalCountdown = machine.rotors[1].turnoverCountdown;

            assert.equal(finalCountdown, initialCountdown - 1);
        });

        it('expect double stepping anomaly exists', function() {
            var rotor0 = new enigma.RotorI();
            rotor0.setInitialPosition('Q');

            var rotor1 = new enigma.RotorII();
            rotor1.setInitialPosition('D');

            var rotor2 = new enigma.RotorIII();
            rotor2.setInitialPosition('V');

            var machine = new enigma.Machine();
            machine.setRotors(rotor0, rotor1, rotor2);
            machine.setPlugboard(new enigma.Plugboard('AB'));
            machine.setReflector(new enigma.ReflectorB());

            // Assert first step
            var rotor1WiringTable = Object.assign({}, rotor1.wires);
            machine.encode('A');

            for (var i = 0; i < enigma.LETTERS.length; i++) {
                assert.notEqual(
                    rotor1WiringTable[enigma.LETTERS[i]],
                    rotor1.wires[enigma.LETTERS[i]]
                );
            }

            // Assert second step
            rotor1WiringTable = Object.assign({}, rotor1.wires);
            machine.encode('A');

            for (i = 0; i < enigma.LETTERS.length; i++) {
                assert.notEqual(
                    rotor1WiringTable[enigma.LETTERS[i]],
                    rotor1.wires[enigma.LETTERS[i]]
                );
            }
        });
    });

    describe('encodeWithRotors', function() {
        it('expect encoding pass through all rotors', function() {
            var machine = new enigma.Machine();
            machine.setPlugboard(new enigma.Plugboard('AB'));
            machine.setRotors(new enigma.RotorI(), new enigma.RotorII(),
                new enigma.RotorIII());
            machine.setReflector(new enigma.ReflectorB());

            var expectedOutput = machine.rotors[2].encode(
                machine.rotors[1].encode(
                    machine.rotors[0].encode('A')));
            assert.equal(machine.encodeWithRotors('A'), expectedOutput);
        });
    });

    describe('encodeInverseWithRotors', function() {
        it('expect encoding inverse pass through all rotors', function() {
            var machine = new enigma.Machine();
            machine.setPlugboard(new enigma.Plugboard('AB'));
            machine.setRotors(new enigma.RotorI(), new enigma.RotorII(),
                new enigma.RotorIII());
            machine.setReflector(new enigma.ReflectorB());

            var expectedOutput = machine.rotors[0].encode(
                machine.rotors[1].encode(
                    machine.rotors[2].encode('A', true),
                    true),
                true);
            assert.equal(machine.encodeInverseWithRotors('A'), expectedOutput);
        });
    });

    describe('test machine against other implementation', function() {
        // Reference:
        // https://www.youtube.com/watch?v=4L6KtS0t75w
        it('expect output be equal', function() {
            var machine = new enigma.Machine();
            machine.setPlugboard(new enigma.Plugboard('QE', 'GN'));
            machine.setRotors(new enigma.RotorV(), new enigma.RotorII(),
                new enigma.RotorI());
            machine.setReflector(new enigma.ReflectorB());

            console.log('0: ' + machine.rotors[0].turnoverCountdown);
            console.log('1: ' + machine.rotors[1].turnoverCountdown);
            console.log('2: ' + machine.rotors[2].turnoverCountdown);

            var input = 'HELLO';
            var output = '';
            var expect = 'DJNPI';

            for (var i = 0; i < input.length; i++) {
                output += machine.encode(input[i]);
                console.log('0: ' + machine.rotors[0].turnoverCountdown);
                console.log('1: ' + machine.rotors[1].turnoverCountdown);
                console.log('2: ' + machine.rotors[2].turnoverCountdown);
            }

            assert.equal(output, expect);
        });
    });
});