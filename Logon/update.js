const fs = require('fs');
let content = fs.readFileSync('google.html', 'utf8');

// Replace the subtitle
content = content.replace(
  'with your Google Account. This account will be available to other Google apps in the browser.', 
  '<h1 class="vAV9bf" style="margin-top: 5px; font-size: inherit; font-weight: inherit;">Sign into Toolify</h1>'
);

// Remove gmail occurrences
content = content.replace(/cheetah\.2919@gmail\.com/g, '');

fs.writeFileSync('google.html', content);
console.log('google.html updated successfully');
