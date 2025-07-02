// updateReleases.js

const fs = require('fs');
const readline = require('readline');

const RELEASE_FILE = 'releases.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise(resolve => rl.question(question, resolve));

// Basic version format checker (e.g., 1.0.0)
const isValidVersion = (v) => /^\d+\.\d+\.\d+$/.test(v);

(async () => {
  try {
    let version;
    while (true) {
      version = await ask("Enter version (e.g., 1.0.0): ");
      if (isValidVersion(version)) break;
      console.log("❌ Invalid version format. Use format like 1.0.0");
    }

    let requiredUpdateInput;
    while (true) {
      requiredUpdateInput = await ask("Is this a mandatory update? (yes/no): ");
      if (["yes", "no"].includes(requiredUpdateInput.toLowerCase())) break;
      console.log("❌ Please enter 'yes' or 'no'");
    }

    const notes = await ask("Enter release notes: ");
    const downloadUrl = await ask("Enter download URL: ");
    const requiredUpdate = requiredUpdateInput.toLowerCase() === 'yes';

    // Build new release object
    const newRelease = {
      version,
      requiredUpdate,
      notes,
      downloadUrl,
      createdAt: new Date().toISOString()
    };

    // Read existing releases
    let releases = [];
    if (fs.existsSync(RELEASE_FILE)) {
      const fileData = fs.readFileSync(RELEASE_FILE);
      releases = JSON.parse(fileData);
    }

    // Add new release to the top of the list
    releases.unshift(newRelease);

    // Write back to file
    fs.writeFileSync(RELEASE_FILE, JSON.stringify(releases, null, 2));
    console.log(`✅ Release v${version} saved successfully to ${RELEASE_FILE}`);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    rl.close();
  }
})();
