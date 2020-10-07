import fs from 'fs'

export function openTestFile(path: string) {
    return fs.readFileSync(path).toString();
}