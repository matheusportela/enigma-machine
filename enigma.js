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
    });
});

var Plugboard = function(letters1, letters2) {
    this.plugs = {};

    if (letters1 != undefined && letters2 != undefined)
        this.addPlugs(letters1, letters2);
};

Plugboard.prototype.addPlug = function(letter1, letter2) {
    this.plugs[letter1] = letter2;
    this.plugs[letter2] = letter1;
};

Plugboard.prototype.addPlugs = function(letters1, letters2) {
    for (var i = 0; i < letters1.length; i++)
        this.plugs[letters1[i]] = letters2[i];
};

Plugboard.prototype.encode = function(letter) {
    if (letter in this.plugs)
        return this.plugs[letter];
    return letter;
};

module.exports = Plugboard;