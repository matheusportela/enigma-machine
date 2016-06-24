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

// All valid letters for this simulator
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
    for (var i = 0; i < LETTERS.length; i++) {
        this.wires[LETTERS[i]] = wireTable[i];
        this.inverseWires[wireTable[i]] = LETTERS[i];
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

    for (var i = 0; i < LETTERS.length; i++) {
        currentLetter = LETTERS[i];
        nextLetter = LETTERS[(i + 1) % LETTERS.length];
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
    this.reflectionTable = {};

    for (var i = 0; i < LETTERS.length/2; i++) {
        letter1 = LETTERS[i];
        letter2 = LETTERS[25 - i];
        this.reflectionTable[letter1] = letter2;
        this.reflectionTable[letter2] = letter1;
    }
};

Reflector.prototype.encode = function(letter) {
    return this.reflectionTable[letter];
};

var Machine = function() {
    this.plugboard = new Plugboard('A', 'B');
    this.rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
    this.reflector = new Reflector();
};

Machine.prototype.encode = function(letter) {
    var plugboardInput = this.plugboard.encode(letter);
    var rotorInput = this.rotor.encode(plugboardInput);
    var reflectorOutput = this.reflector.encode(rotorInput);
    var rotorOutput = this.rotor.encode(reflectorOutput, inverse = true);
    var plugboardOutput = this.plugboard.encode(rotorOutput);

    return plugboardOutput;
};

module.exports = {
    Plugboard: Plugboard,
    Rotor: Rotor,
    Reflector: Reflector,
    Machine: Machine
};