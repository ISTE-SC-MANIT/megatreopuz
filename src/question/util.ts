import crypto from "crypto";
const myRandomString = "YouPossiblyCannotGuessThisSalt";

export function hashAnswer(answer: string) {
    const hash = crypto.createHmac("sha512", myRandomString);
    hash.push(answer);
    return hash.digest("hex");
}

export function verifyAnswer(hash: string, answer: string) {
    const answerHash = hashAnswer(answer);
    return hash === answer;
}
