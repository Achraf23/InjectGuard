import * as assert from 'assert';
import * as fs from 'fs';
import path from 'path';
// import * as vscode from 'vscode';
// import * as myExtension from '../../extension';


/* FUNCTIONS DECLARATION */ 
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
	assert.notEqual(value,null);
    if (value === undefined || value === null) {
        throw new Error(`${value} is not defined`)
    }
}

/**
 * Loops through all files in the src/test/samples directory that have names beginning with prefixName,  
 * and check if their contents match the provided regexp
 * @param prefixName 
 * @param regexp 
 */
function assertLanguageinFiles(prefixName, regexp) {
	// Initialize an array to store the contents of each file
	let fileContentsArray: string[] = [];

	const testFolder = path.join(__dirname,"../../src/test/samples");

	const files = fs.readdirSync(testFolder)
    .filter((file) => file.startsWith(prefixName));

	for(let file of files ){
		const filePath = path.join(testFolder, file);
		const content = fs.readFileSync(filePath, 'utf8');
		try{
			// check if each file matches given regexp
			assertIsDefined(content.match(regexp));
		}catch(err){
			console.log("ERROR");
			return false;
		}
	}

	return true;
}



/* TESTS START FROM HERE */ 
test('Parsing files containing SQL queries', () => {
	var regexp = /\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]+?\b(FROM|INTO|SET|WHERE)\b[\s\S]*;/i;
	assert.strictEqual(assertLanguageinFiles('ok-sql',regexp),true);
});

test('Parsing files without SQL queries', () => {
	var regexp = /\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]+?\b(FROM|INTO|SET|WHERE)\b[\s\S]*;/i;
	assert.notStrictEqual(assertLanguageinFiles('ko-sql',regexp),true);
});

