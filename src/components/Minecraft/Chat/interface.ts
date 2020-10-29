export interface IChatService {

    /**
     * @returns information array if inappropriate, null if appropriate
     * @param message the message
     */
    swearCheck(message: string): string[];

    /**
     * @returns information array if contains a link, null if not
     * @param message the message
     */
    linkCheck(message: string): string[];

    // /**
    //  * @returns information array if contains blocked command, null if not
    //  * @param message the message
    //  */
    //
    // Bungee servers should handle this, so every command doesn't have to be sent through the chat filter
    //
    // commandCheck(message: string): string[];

    /*
    Bungee servers should keep track of message frequency

    spamCheck(message: string): boolean;
    */

    /**
     * @returns information array if contains blocked character, null if not
     * @param message the message
     */
    characterCheck(message: string): string[];
}