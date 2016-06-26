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
 * - Technical details on the Enigma machine
 *     http://users.telenet.be/d.rijmenants/en/enigmatech.htm
 * - Enigma cipher machine simulator 7.0.6
 *     http://users.telenet.be/d.rijmenants/Enigma%20Sim%20Manual.pdf
 */

// All valid letters for this simulator
var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

var Rotor = function(wiringTable) {
    this.wires = {};
    this.inverseWires = {};
    this.nextRotor = null;
    this.turnoverCountdown = 26;

    if (wiringTable)
        this.setWiringTable(wiringTable);
};

Rotor.prototype.setInitialPosition = function(initialPosition) {
    var nextRotor = this.nextRotor;
    this.nextRotor = null;

    for (var i = 0; i < initialPosition; i++)
        this.step();

    this.nextRotor = nextRotor;
};

Rotor.prototype.setNextRotor = function(rotor) {
    this.nextRotor = rotor;
};

Rotor.prototype.setTurnoverLetter = function(letter) {
    var initialCode = 'A'.charCodeAt(0);
    var letterCode = letter.charCodeAt(0);
    this.turnoverCountdown = letterCode - initialCode;
};

Rotor.prototype.addWire = function(letter1, letter2) {
    this.wires[letter1] = letter2;
};

Rotor.prototype.setWiringTable = function(wiringTable) {
    for (var i = 0; i < LETTERS.length; i++) {
        this.wires[LETTERS[i]] = wiringTable[i];
        this.inverseWires[wiringTable[i]] = LETTERS[i];
    }
};

Rotor.prototype.encode = function(letter, inverse) {
    if (inverse)
        return this.inverseWires[letter];
    return this.wires[letter];
};

Rotor.prototype.step = function() {
    this.stepWires();
    this.updateInverseWires();
    this.turnover();
};

Rotor.prototype.stepWires = function() {
    var newWires = {};
    var currentLetter;
    var nextLetter;

    for (var i = 0; i < LETTERS.length; i++) {
        currentLetter = LETTERS[i];
        nextLetter = LETTERS[(i + 1) % LETTERS.length];
        newWires[currentLetter] = this.wires[nextLetter];
    }

    this.wires = newWires;
};

Rotor.prototype.updateInverseWires = function() {
    for (var i = 0; i < LETTERS.length; i++) {
        letter = LETTERS[i];
        encodedLetter = this.wires[letter];
        this.inverseWires[encodedLetter] = letter;
    }
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

var RotorI = function() {
    var rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
    rotor.setTurnoverLetter('R');
    return rotor;
};

var RotorII = function() {
    var rotor = new Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE');
    rotor.setTurnoverLetter('F');
    return rotor;
};

var RotorIII = function() {
    var rotor = new Rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO');
    rotor.setTurnoverLetter('W');
    return rotor;
};

var RotorIV = function() {
    var rotor = new Rotor('ESOVPZJAYQUIRHXLNFTGKDCMWB');
    rotor.setTurnoverLetter('K');
    return rotor;
};

var RotorV = function() {
    var rotor = new Rotor('VZBRGITYUPSDNHLXAWMJQOFECK');
    rotor.setTurnoverLetter('A');
    return rotor;
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

Reflector.prototype.setReflectionTable = function(reflectionTable) {
    for (var i = 0; i < LETTERS; i++) {
        letter1 = LETTERS[i];
        letter2 = reflectionTable[i];
        this.reflectionTable[letter1] = letter2;
    }
};

Reflector.prototype.encode = function(letter) {
    return this.reflectionTable[letter];
};

var ReflectorB = function() {
    var reflector = new Reflector();
    reflector.setReflectionTable('YRUHQSLDPXNGOKMIEBFZCWVJAT');
    return reflector;
};

var ReflectorC = function() {
    var reflector = new Reflector();
    reflector.setReflectionTable('FVPJIAOYEDRZXWGCTKUQSBNMHL');
    return reflector;
};

var Machine = function() {
    this.plugboard = null;
    this.rotors = null;
    this.reflector = null;
};

Machine.prototype.setPlugboard = function(plugboard) {
    this.plugboard = plugboard;
};

Machine.prototype.setRotors = function(rotor0, rotor1, rotor2) {
    this.rotors = [rotor0, rotor1, rotor2];
    this.rotors[0].setNextRotor(this.rotors[1]);
    this.rotors[1].setNextRotor(this.rotors[2]);
};

Machine.prototype.setReflector = function(reflector) {
    this.reflector = reflector;
};

Machine.prototype.encode = function(letter) {
    // Update rotor position after encoding
    this.rotors[0].step();

    var plugboardDirect = this.plugboard.encode(letter);
    var rotorsDirect = this.encodeWithRotors(plugboardDirect);
    var reflectorInverse = this.reflector.encode(rotorsDirect);
    var rotorsInverse = this.encodeInverseWithRotors(reflectorInverse);
    var plugboardInverse = this.plugboard.encode(rotorsInverse);

    return plugboardInverse;
};

Machine.prototype.encodeWithRotors = function(letter) {
    for (var i = 0; i < this.rotors.length; i++) {
        output = this.rotors[i].encode(letter);
        letter = output;
    }

    return output;
};

Machine.prototype.encodeInverseWithRotors = function(letter) {
    for (var i = this.rotors.length - 1; i >= 0; i--) {
        output = this.rotors[i].encode(letter, true);
        letter = output;
    }

    return output;
};

module.exports = {
    LETTERS: LETTERS,
    Plugboard: Plugboard,
    Rotor: Rotor,
    RotorI: RotorI,
    RotorII: RotorII,
    RotorIII: RotorIII,
    RotorIV: RotorIV,
    RotorV: RotorV,
    Reflector: Reflector,
    ReflectorB: ReflectorB,
    ReflectorC: ReflectorC,
    Machine: Machine
};