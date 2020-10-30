import { IChatService } from "./interface";
import * as fs from 'fs';
import * as rd from 'readline';

/* Swear Check */
const swearList: string[] = [];
const spacesList: string[] = [];
const specificList: string[] = [];

const swearReader = rd.createInterface(fs.createReadStream('swears.txt'));
var checking = "";
swearReader.on("line", (line: string) => {
    if (line == 'spaces:') {
        checking = 'spaces';
    } else if (line == 'specific:') {
        checking = 'specific';
    } else if (line == 'swears:') {
        checking = 'swears';
    } else {
        if (checking == 'spaces') {
            spacesList.push(line);
        } else if (checking == 'specific') {
            specificList.push(line);
        } else if (checking == 'swears') {
            swearList.push(line);
        }
    }
});

/* Link Check */
const linkRegex = new RegExp('([a-zA-Z]+[://]+)?([a-zA-Z0-9\-]+(\\.|\\(dot\\)|\\(\\)|\\*))+([a-zA-Z]{2,18})(\\/[a-zA-Z0-9\\/.,?=&_-]+)?', 'g');
const domainRegex = new RegExp('([a-zA-Z-]{1,63})(\\.|\\(dot\\)|\\(\\)|\\*)([a-zA-Z-]{1,63})(\\/[a-zA-Z\\.]*)?$');
const allowedDomains: string[] = ['palace.network', 'thepalacemc.com', 'palnet.us'];

/* Character Check */
const allowedCharacters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "{", "}", "/", "\\", "?", "|", ",", ".", "<", ">", "`", "~", ";", ":", "'", "\"", "√", "˚", "≤", "≥", "™", "£", "¢", "∞", "•", " "];

const ChatService: IChatService = {

    // chat filter information array:
    // ['filter type', 'offending text']

    swearCheck(message: string): string[] {
        message = message.toLowerCase();
        var strippedMessage = "";
        for (var i = 0; i < message.length; i++) {
            var char = message.charAt(i);
            if (char == '.' || char == '-' || char == ',' || char == '/' || char == '_' || char == ';') continue;
            else if (char == '0') char = 'o';
            else if (char == '@') char = 'a';
            else if (char == '$') char = 's';
            else if (char == '(' && message.charAt(i + 1) == ')') {
                char = 'o';
                i++;
            }
            strippedMessage += char;
        }
        var containsSwear: string = null;
        for (var i = 0; i < specificList.length; i++) {
            var word = specificList[i];
            if (strippedMessage.includes(word)) {
                containsSwear = word;
                break;
            }
        }
        if (containsSwear == null) {
            for (var i = 0; i < spacesList.length; i++) {
                var word = spacesList[i];
                if (strippedMessage == word || strippedMessage.startsWith(word + " ") || strippedMessage.endsWith(" " + word) || strippedMessage.includes(" " + word + " ")) {
                    containsSwear = word;
                    break;
                }
            }
            if (containsSwear == null) {
                var noSpaces = "";
                for (var i = 0; i < strippedMessage.length; i++) {
                    var char = strippedMessage.charAt(i);
                    if (char == ' ') continue;
                    noSpaces += char;
                }
                for (var i = 0; i < swearList.length; i++) {
                    var word = swearList[i];
                    if (noSpaces.includes(word)) {
                        containsSwear = word;
                        break;
                    }
                }
            }
        }
        if (containsSwear != null) {
            return ['inappropriate content', containsSwear];
        }
        return null;
    },

    linkCheck(message: string): string[] {
        var matches = message.match(linkRegex);
        if (matches === undefined || matches == null || matches.length == 0) {
            if (message.indexOf(' . ') == -1) {
                return null;
            } else {
                var updated = message.replace(' . ', '.');
                matches = updated.match(linkRegex);
                if (matches === undefined || matches == null || matches.length == 0) {
                    return null;
                }
            }
        }
        var matchedDomains: string[] = [];
        matches.forEach(m => {
            var parts = m.match(domainRegex);
            if (parts !== undefined || parts != null || parts.length >= 4) {
                var domain = parts[1] + parts[2] + parts[3];
                if (!allowedDomains.includes(domain)) {
                    matchedDomains.push(m);
                }
            }
        });
        if (matchedDomains.length == 0) {
            return null;
        }
        var str = "";
        for (var i = 0; i < matchedDomains.length; i++) {
            str += matchedDomains[i];
            if (i < (matchedDomains.length - 1)) {
                str += ", ";
            }
        }
        if (str.length > 200) {
            str = str.substr(0, 200);
        }
        return ['link sharing', str];
    },

    /*
    
    Your message was blocked by our chat filter for "inappropriate content". Please review our "chat guidelines" to make sure you are familiar with what we allow, and don't allow, in chat.
    You have been temporarily muted for 30 seconds. If your message was incorrectly blocked, a staff member will remove the mute.

    */

    characterCheck(message: string): string[] {
        message = message.toLowerCase();
        var invalidCharacters: string = "";

        for (var i = 0; i < message.length; i++) {
            var char = message.charAt(i);
            if (invalidCharacters.indexOf(char) == -1 && !allowedCharacters.includes(char)) {
                if (invalidCharacters.length > 0) {
                    invalidCharacters += ", " + char;
                } else {
                    invalidCharacters += char;
                }
            }
        }

        if (invalidCharacters.length == 0) {
            return null;
        } else {
            return ['blocked character' + (invalidCharacters.length == 1 ? '' : 's'), invalidCharacters];
        }
    }
}

export default ChatService;