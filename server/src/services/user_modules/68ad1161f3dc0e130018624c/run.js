
      let params = {};
      try {
        params = JSON.parse(process.argv[2] || '{}');
      } catch (e) {
        console.error('Error parsing params from command line:', e.message);
      }
      
      // User's code starts here
      const { name } = params;

if (!name) {
    throw new Error('Name is required in params.');
}

const greeting = `Hello World ${name}, bye`;
console.log(greeting);

params.result = name;
    