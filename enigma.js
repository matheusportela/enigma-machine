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
 * - Enigma simulator step by step
 *     http://www.enigmaco.de/enigma/enigma.swf
 */

// All valid letters for this simulator
var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

var Plugboard = function() {
    this.plugs = {};
    Plugboard.prototype.addPlugs.apply(this, arguments);
};

Plugboard.prototype.addPlug = function(letter1, letter2) {
    this.plugs[letter1] = letter2;
    this.plugs[letter2] = letter1;
};

Plugboard.prototype.addPlugs = function() {
    for (var i = 0; i < arguments.length; i++) {
        var letters = arguments[i];
        this.addPlug(letters.charAt(0), letters.charAt(1));
    }
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
    this.innerRingPosition = 0;

    if (wiringTable)
        this.setWiringTable(wiringTable);
};

Rotor.prototype.setInitialPosition = function(initialPosition) {
    var letterCode = initialPosition.charCodeAt(0) - 'A'.charCodeAt(0);
    var nextRotor = this.nextRotor;
    this.nextRotor = null;

    for (var i = 0; i < letterCode; i++)
        this.step();

    this.nextRotor = nextRotor;
};

Rotor.prototype.setInnerPosition = function(innerRingPosition) {
    var numberOfSteps = innerRingPosition.charCodeAt(0) -
        'A'.charCodeAt(0);

    for (var i = 0; i < 26 - numberOfSteps; i++) {
        this.stepWires();
        this.updateInverseWires();
        this.innerRingPosition += 1;
    }
};

Rotor.prototype.setNextRotor = function(rotor) {
    this.nextRotor = rotor;
};

Rotor.prototype.setTurnoverLetter = function(letter) {
    this.turnoverCountdown = letter.charCodeAt(0) - 'A'.charCodeAt(0);

    if (this.turnoverCountdown === 0)
        this.turnoverCountdown = 26;
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
    var letterCode = letter.charCodeAt(0) - 'A'.charCodeAt(0);

    if (inverse) {
        offsetLetterCode = (letterCode + this.innerRingPosition) % LETTERS.length;
        if (offsetLetterCode < 0) offsetLetterCode += 26;

        return this.inverseWires[String.fromCharCode('A'.charCodeAt(0) + offsetLetterCode)];
    } else {
        outputLetterCode = this.wires[letter].charCodeAt(0) - 'A'.charCodeAt(0);

        offsetLetterCode = (outputLetterCode - this.innerRingPosition) % LETTERS.length;
        if (offsetLetterCode < 0) offsetLetterCode += 26;

        return String.fromCharCode('A'.charCodeAt(0) + offsetLetterCode);
    }
};

Rotor.prototype.step = function() {
    this.stepWires();
    this.updateInverseWires();
    this.turnover();
    this.innerRingPosition += 1;
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
    this.turnoverCountdown -= 1;

    if (this.turnoverCountdown === 0) {
        if (this.nextRotor)
            this.nextRotor.step();
        this.turnoverCountdown = 26;
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

    for (var i = 0; i < LETTERS.length; i++)
        this.reflectionTable[LETTERS[i]] = LETTERS[i];
};

Reflector.prototype.setReflectionTable = function(reflectionTable) {
    newReflectionTable = {};

    for (var i = 0; i < LETTERS.length; i++) {
        input = LETTERS[i];
        output = reflectionTable[i];
        newReflectionTable[input] = output;
    }

    this.reflectionTable = newReflectionTable;
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
    this.debug = false;
    this.plugboard = null;
    this.rotors = null;
    this.reflector = null;
};

Machine.prototype.log = function(message) {
    if (this.debug)
        console.log(message);
};

Machine.prototype.setDebug = function(debug) {
    this.debug = debug;
};

Machine.prototype.setPlugboard = function(plugboard) {
    this.plugboard = plugboard;

    this.log('Machine plugboard table');
    this.log(this.plugboard.plugs);
    this.log('');
};

Machine.prototype.setRotors = function(leftRotor, middleRotor, rightRotor) {
    this.rotors = [rightRotor, middleRotor, leftRotor];
    this.rotors[0].setNextRotor(this.rotors[1]);
    this.rotors[1].setNextRotor(this.rotors[2]);

    this.log('Machine rotors table');

    for (var i = 0; i < this.rotors.length; i++) {
        this.log('Rotor ' + i + ' table');
        this.log(this.rotors[i].wires);
        this.log('');
    }
};

Machine.prototype.setReflector = function(reflector) {
    this.reflector = reflector;

    this.log('Machine reflector table');
    this.log(this.reflector.reflectionTable);
    this.log('');
};

Machine.prototype.encode = function(letter) {
    // Double stepping anomaly
    // Rotors turns over the rotor on their right as well. This is not noticed
    // in rotor 0 because it always steps anyway.
    if (this.rotors[1].turnoverCountdown == 1 &&
        this.rotors[2].turnoverCountdown == 1) {
        this.rotors[1].step();
    }

    // Update rotor position after encoding
    this.rotors[0].step();

    this.log('Machine encoding');

    this.log('letter: ' + letter);

    var plugboardDirect = this.plugboard.encode(letter);
    this.log('plugboardDirect: ' + letter + ' -> ' + plugboardDirect);

    var rotorsDirect = this.encodeWithRotors(plugboardDirect);

    var reflectorInverse = this.reflector.encode(rotorsDirect);
    this.log('reflectorInverse: ' + rotorsDirect + ' -> ' + reflectorInverse);

    var rotorsInverse = this.encodeInverseWithRotors(reflectorInverse);

    var plugboardInverse = this.plugboard.encode(rotorsInverse);
    this.log('plugboardInverse: ' + rotorsInverse + ' -> ' + plugboardInverse);

    this.log('');

    return plugboardInverse;
};

Machine.prototype.encodeWithRotors = function(letter) {
    for (var i = 0; i < this.rotors.length; i++) {
        output = this.rotors[i].encode(letter);
        this.log('rotor ' + i + ' direct: ' + letter + ' -> ' + output);

        letter = output;
    }

    return output;
};

Machine.prototype.encodeInverseWithRotors = function(letter) {
    for (var i = this.rotors.length - 1; i >= 0; i--) {
        output = this.rotors[i].encode(letter, true);
        this.log('rotor ' + i + ' inverse: ' + letter + ' -> ' + output);

        letter = output;
    }

    return output;
};

Machine.prototype.encodeLetters = function(letters) {
    var result = '';

    for (var i = 0; i < letters.length; i++)
        result += this.encode(letters[i]);

    return result;
};

// Compatibility between Node.js and browsers
if (typeof module !== 'undefined') {
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
}