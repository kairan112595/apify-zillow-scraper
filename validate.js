const fs = require('fs');
const path = require('path');

function validateProject() {
    console.log('🔍 Validating Apify Zillow Scraper project structure...\n');
    
    const requiredFiles = [
        '.actor/actor.json',
        'src/main.js',
        'src/test.js',
        'package.json',
        'input_schema.json',
        'Dockerfile',
        'README.md',
        '.gitignore'
    ];
    
    const requiredDirs = [
        '.actor',
        'src',
        'examples'
    ];
    
    let allValid = true;
    
    // Check directories
    console.log('📁 Checking directories:');
    requiredDirs.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            console.log(`✅ ${dir}/`);
        } else {
            console.log(`❌ ${dir}/ - Missing or not a directory`);
            allValid = false;
        }
    });
    
    console.log('\n📄 Checking files:');
    requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const stats = fs.statSync(filePath);
            console.log(`✅ ${file} (${stats.size} bytes)`);
        } else {
            console.log(`❌ ${file} - Missing`);
            allValid = false;
        }
    });
    
    // Validate package.json
    console.log('\n🔧 Validating package.json:');
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        const requiredDeps = ['apify', 'playwright', 'cheerio', 'axios'];
        
        requiredDeps.forEach(dep => {
            if (packageJson.dependencies && packageJson.dependencies[dep]) {
                console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
            } else {
                console.log(`❌ Missing dependency: ${dep}`);
                allValid = false;
            }
        });
    } catch (error) {
        console.log(`❌ Invalid package.json: ${error.message}`);
        allValid = false;
    }
    
    // Validate input schema
    console.log('\n⚙️ Validating input schema:');
    try {
        const inputSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'input_schema.json'), 'utf8'));
        if (inputSchema.properties && inputSchema.properties.searchLocation) {
            console.log('✅ Input schema structure is valid');
        } else {
            console.log('❌ Input schema missing required properties');
            allValid = false;
        }
    } catch (error) {
        console.log(`❌ Invalid input schema: ${error.message}`);
        allValid = false;
    }
    
    // Validate actor.json
    console.log('\n🎭 Validating actor configuration:');
    try {
        const actorJson = JSON.parse(fs.readFileSync(path.join(__dirname, '.actor/actor.json'), 'utf8'));
        if (actorJson.actorSpecification && actorJson.name && actorJson.input) {
            console.log('✅ Actor configuration is valid');
        } else {
            console.log('❌ Actor configuration missing required fields');
            allValid = false;
        }
    } catch (error) {
        console.log(`❌ Invalid actor configuration: ${error.message}`);
        allValid = false;
    }
    
    console.log('\n' + '='.repeat(50));
    
    if (allValid) {
        console.log('🎉 Project validation PASSED!');
        console.log('\n📋 Next steps:');
        console.log('1. Upload this project to Apify Console');
        console.log('2. Build the actor');
        console.log('3. Test with a sample input');
        console.log('4. Start scraping pending/under contract properties!');
        console.log('\n📚 See DEPLOYMENT.md for detailed instructions');
    } else {
        console.log('❌ Project validation FAILED!');
        console.log('Please fix the issues above before deploying to Apify.');
    }
    
    return allValid;
}

// Run validation if script is executed directly
if (require.main === module) {
    validateProject();
}

module.exports = { validateProject };
