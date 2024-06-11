import * as assert from 'assert';
import * as fs from 'fs';
import path from 'path';
// import * as vscode from 'vscode';
// import * as myExtension from '../../extension';


/* FUNCTIONS DECLARATION */ 
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`${value} is not defined`)
    }
}

/**
 * Loops through all files in the out/test/samples directory that have names beginning with prefixName,  
 * and check if their contents match the provided regexp
 * @param prefixName 
 * @param regexp 
 */
function assertLanguageinFiles(prefixName, regexp) {
	// Initialize an array to store the contents of each file
	let fileContentsArray: string[] = [];

	// const testFolder = 'samples';
	const testFolder = path.join(__dirname,"../../src/test/samples");
	fs.readdir(testFolder, (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
			return;
		}
	
		// Filter files starting with 'string'
		const filteredFiles = files.filter(file => file.startsWith('sql'));
		
		// Read each file and store its content in the array
		filteredFiles.forEach(file => {
			const filePath = path.join(testFolder, file);
			try {
				const content = fs.readFileSync(filePath, 'utf8');
				fileContentsArray.push(content);
				console.log(content)
			} catch (err) {
				console.error(`Error reading file ${filePath}:`, err);
			}
		});

		fileContentsArray.forEach(content =>{
			// const matches = content.match(/\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]+?\b(FROM|INTO|SET|WHERE)\b[\s\S]*;/i);	
			const matches = content.match(regexp);	
			assertIsDefined(matches);			
		})
	
	});
}



/* TESTS START FROM HERE */ 
test('Parsing SQL queries test', () => {

	var regexp = /\b(SELECT|INSERT|UPDATE|DELETE)\b[\s\S]+?\b(FROM|INTO|SET|WHERE)\b[\s\S]*;/i;
	assertLanguageinFiles('sql',regexp);

});
