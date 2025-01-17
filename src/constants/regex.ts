/*
 * name validation
 * accepted: letters & spaces, minimum 3 chars, maximum 15 chars
 */
export const name: RegExp = /[a-zA-Z\ ]{3,15}/;

/*
 * email validation
 */
export const email: RegExp = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;

/*
 * password validation, should contain:
 * (?=.*\d): at least one digit
 * (?=.*[a-z]): at least one lower case
 * (?=.*[A-Z]): at least one uppercase case
 * [0-9a-zA-Z]{6,}: at least 8 from the mentioned characters
 */
export const password: RegExp =
  /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()\-+=.,?])^.{8,30}$/;

/*
 * code validation
 * accepted: six digits
 */
export const code: RegExp = /(\d{6})/;
