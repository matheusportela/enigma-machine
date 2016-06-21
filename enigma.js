/* Enigma machine emulator.
 * Author: Matheus Vieira Portela
 * GitHub: https://github.com/matheusportela/
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