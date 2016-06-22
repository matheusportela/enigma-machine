/* Enigma machine emulator.
 * Author: Matheus Vieira Portela
 * GitHub: https://github.com/matheusportela/
 *
 * This is a simulator for the Enigma machine, one of the most incredible
 * applications of cryptography during World War I and II. German militaries
 * would send encrypted messages through the air using telegraphs about bombing
 * locations with security, considering one would have to know the precise
 * combination of rotor positioning, plugboard configuration, and other pieces
 * in order to decode captured messages.
 *
 * Even though several weaknesses were discovered - specially by the Allies
 * forces - allowing one to break the code, the Enigma encryption algorithm is
 * a fun way to study a little bit of cryptography.
 *
 * Of course, studying the Enigma is also a tribute to Alan Turing.
 *
 * References:
 * - Enigma machine https://en.wikipedia.org/wiki/Enigma_machine
 * - Enigma simulator http://enigma.louisedade.co.uk/howitworks.html
 */
var expect = require('chai').expect;

describe('Plugboard', function() {
    describe('addPlug', function() {
        it('expect add letter to plugs', function() {
            var plugboard = new Plugboard();
            plugboard.addPlug('A', 'B');
            expect(plugboard.plugs['A']).to.be.equal('B');
        });

        it('expect add inverse letter to plugs', function() {
            var plugboard = new Plugboard();
            plugboard.addPlug('A', 'B');
            expect(plugboard.plugs['B']).to.be.equal('A');
        });
    });

    describe('encode', function() {
        it('expect non-plugged letter encode to itself', function() {
            var plugboard = new Plugboard();
            expect(plugboard.encode('A')).to.be.equal('A');
        });

        it('expect plugged letter encode to its plug output', function() {
            var plugboard = new Plugboard();
            plugboard.addPlug('A', 'B');
            expect(plugboard.encode('A')).to.be.equal('B');
        });
    });


    describe('addPlugs', function() {
        it('expect plugged letters encode to their plugs', function() {
            var plugboard = new Plugboard();
            plugboard.addPlugs('ABC', 'DEF');
            expect(plugboard.encode('A')).to.be.equal('D');
            expect(plugboard.encode('B')).to.be.equal('E');
            expect(plugboard.encode('C')).to.be.equal('F');
        });

        it('expect non-plugged letters encode to themselves', function() {
            var plugboard = new Plugboard();
            plugboard.addPlugs('ABC', 'DEF');
            expect(plugboard.encode('G')).to.be.equal('G');
            expect(plugboard.encode('H')).to.be.equal('H');
            expect(plugboard.encode('I')).to.be.equal('I');
        });
    });

    describe('constructor', function() {
        it('expect plugboard be configured through constructor', function() {
            var plugboard = new Plugboard('ABC', 'DEF');
            expect(plugboard.encode('A')).to.be.equal('D');
            expect(plugboard.encode('B')).to.be.equal('E');
            expect(plugboard.encode('C')).to.be.equal('F');
            expect(plugboard.encode('G')).to.be.equal('G');
            expect(plugboard.encode('H')).to.be.equal('H');
            expect(plugboard.encode('I')).to.be.equal('I');
        });

        it('expect plugboard to be reciprocal', function() {
            var plugboard = new Plugboard('ABC', 'DEF');
            expect(plugboard.encode('D')).to.be.equal('A');
            expect(plugboard.encode('E')).to.be.equal('B');
            expect(plugboard.encode('F')).to.be.equal('C');
        });
    });
});

describe('Rotor', function() {
    describe('addWire', function() {
        it('expect add wiring to rotor', function() {
            var rotor = new Rotor();
            rotor.addWire('A', 'B');
            expect(rotor.wires['A']).to.be.equal('B');
        });
    });

    describe('setWireTable', function() {
        it('expect rotor wire table to configure wires', function() {
            var rotor = new Rotor();
            rotor.setWireTable('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            expect(rotor.wires['A']).to.be.equal('E');
            expect(rotor.wires['B']).to.be.equal('K');
            expect(rotor.wires['Z']).to.be.equal('J');
        });
    });

    describe('encode', function() {
        it('expect rotor to encode with wire table', function() {
            var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            expect(rotor.encode('A')).to.be.equal('E');
            expect(rotor.encode('B')).to.be.equal('K');
            expect(rotor.encode('Z')).to.be.equal('J');
        });

        it('expect rotor without step encode output to input', function() {
            var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            expect(rotor.encode('A')).to.be.equal('E');
            expect(rotor.encode('E', inverse = true)).to.be.equal('A');
        });
    });

    describe('constructor', function() {
        it('expect rotor be configured through constructor', function() {
            var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            expect(rotor.wires['A']).to.be.equal('E');
            expect(rotor.wires['B']).to.be.equal('K');
            expect(rotor.wires['Z']).to.be.equal('J');
        });
    });

    describe('step', function() {
        it('expect step change first encoded letter', function() {
            var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            expect(rotor.wires['A']).to.be.equal('E');
            rotor.step();
            expect(rotor.wires['A']).to.be.equal('K');
        });

        it('expect step change last encoded letter', function() {
            var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            expect(rotor.wires['Z']).to.be.equal('J');
            rotor.step();
            expect(rotor.wires['Z']).to.be.equal('E');
        });
    });

    describe('turnover', function() {
        it('expect turnover to be reached after 26 steps', function() {
            var rotor1 = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
            var rotor2 = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            rotor1.nextRotor = rotor2;

            expect(rotor1.wires['A']).to.be.equal('E');
            expect(rotor2.wires['A']).to.be.equal('E');

            for (var i = 0; i < 26; i++)
                rotor1.step();

            expect(rotor1.wires['A']).to.be.equal('E');
            expect(rotor2.wires['A']).to.be.equal('K');
        });

        it('expect turnover without next rotor maintain encoding', function() {
            var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');

            expect(rotor.wires['A']).to.be.equal('E');

            for (var i = 0; i < 26; i++)
                rotor.step();

            expect(rotor.wires['A']).to.be.equal('E');
        });
    });
});

describe('Reflector', function() {
    describe('encode', function() {
        it('expect encode to return the opposite letter', function() {
                var reflector = new Reflector();
                expect(reflector.encode('A')).to.be.equal('Z');
                expect(reflector.encode('Z')).to.be.equal('A');
        });
    });
});

describe('Enigma', function() {
    describe('encode', function() {
        it('expect encode to return a letter different from the given one',
            function() {
                var enigma = new Enigma();
                expect(enigma.encode('A')).to.not.be.equal('A');
        });

        it('expect encode with encoded letter to be the original one',
            function() {
                var enigma1 = new Enigma();
                var input = 'A';
                var output = enigma1.encode(input);

                var enigma2 = new Enigma();
                expect(enigma2.encode(output)).to.be.equal(input);
        });
    });
});

var Plugboard = function(letters1, letters2) {
    this.plugs = {};

    if (letters1 && letters2)
        this.addPlugs(letters1, letters2);
};

Plugboard.prototype.addPlug = function(letter1, letter2) {
    this.plugs[letter1] = letter2;
    this.plugs[letter2] = letter1;
};

Plugboard.prototype.addPlugs = function(letters1, letters2) {
    for (var i = 0; i < letters1.length; i++)
        this.addPlug(letters1[i], letters2[i]);
};

Plugboard.prototype.encode = function(letter) {
    if (letter in this.plugs)
        return this.plugs[letter];
    return letter;
};

var Rotor = function(wireTable) {
    this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.wires = {};
    this.inverseWires = {};
    this.nextRotor = null;
    this.turnoverCountdown = 26;

    if (wireTable)
        this.setWireTable(wireTable);
};

Rotor.prototype.addWire = function(letter1, letter2) {
    this.wires[letter1] = letter2;
};

Rotor.prototype.setWireTable = function(wireTable) {
    for (var i = 0; i < this.letters.length; i++) {
        this.wires[this.letters[i]] = wireTable[i];
        this.inverseWires[wireTable[i]] = this.letters[i];
    }
};

Rotor.prototype.encode = function(letter, inverse) {
    var inverse = typeof inverse !== 'undefined' ? inverse : false;

    if (inverse)
        return this.inverseWires[letter];
    return this.wires[letter];
};

Rotor.prototype.step = function() {
    var new_wires = {};
    var currentLetter;
    var nextLetter;

    for (var i = 0; i < this.letters.length; i++) {
        currentLetter = this.letters[i];
        nextLetter = this.letters[(i + 1) % this.letters.length];
        new_wires[currentLetter] = this.wires[nextLetter];
    }

    this.wires = new_wires;

    this.turnover();
};

Rotor.prototype.turnover = function() {
    if (this.nextRotor) {
        this.turnoverCountdown -= 1;

        if (this.turnoverCountdown === 0) {
            this.nextRotor.step();
            this.turnoverCountdown = 26;
        }
    }
};

var Reflector = function() {
    this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.reflectionTable = {};

    for (var i = 0; i < this.letters.length/2; i++) {
        letter1 = this.letters[i];
        letter2 = this.letters[25 - i];
        this.reflectionTable[letter1] = letter2;
        this.reflectionTable[letter2] = letter1;
    }
};

Reflector.prototype.encode = function(letter) {
    return this.reflectionTable[letter];
};

var Enigma = function() {
    this.plugboard = new Plugboard('A', 'B');
    this.rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
    this.reflector = new Reflector();
};

Enigma.prototype.encode = function(letter) {
    var plugboardInput = this.plugboard.encode(letter);
    var rotorInput = this.rotor.encode(plugboardInput);
    var reflectorOutput = this.reflector.encode(rotorInput);
    var rotorOutput = this.rotor.encode(reflectorOutput, inverse = true);
    var plugboardOutput = this.plugboard.encode(rotorOutput);

    return plugboardOutput;
};