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
});

var Plugboard = function() {
    this.plugs = {};
};

Plugboard.prototype.addPlug = function(letter1, letter2) {
    this.plugs[letter1] = letter2;
    this.plugs[letter2] = letter1;
};

Plugboard.prototype.encode = function(letter) {
    if (letter in this.plugs)
        return this.plugs[letter];
    return letter;
};

module.exports = Plugboard;