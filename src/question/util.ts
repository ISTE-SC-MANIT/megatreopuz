import crypto from "crypto";

export function hashAnswer(answer: string) {
    const hash = crypto.createHmac("sha512", process.env.SALT);
    hash.update(answer);
    return hash.digest("hex");
}

export function verifyAnswer(hash: string, answer: string) {
    const answerHash = hashAnswer(answer);
    return hash === answerHash;
}
