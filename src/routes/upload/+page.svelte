<script>
    import { db } from '$lib/firebase';
    import { collection, addDoc } from 'firebase/firestore';
    import { goto } from '$app/navigation';
    
    let files;
    let message = '';
    
    async function handleUpload() {
      if (!files || files.length === 0) {
        message = 'Please select a file';
        return;
      }
      
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          const ticker = file.name.split('_')[0];
          const timestamp = new Date().toISOString();
          
          await addDoc(collection(db, 'analyses'), {
            ticker,
            timestamp,
            fileName: file.name,
            data: jsonData
          });
          
          message = 'Upload successful!';
          setTimeout(() => goto('/'), 1500);
        } catch (error) {
          message = 'Error: ' + error.message;
        }
      };
      
      reader.readAsText(file);
    }
  </script>
  
  <h1>Upload Analysis</h1>
  
  <a href="/">Back to List</a>
  
  <div>
    <input type="file" accept=".json" bind:files />
    <button on:click={handleUpload}>Upload</button>
  </div>
  
  {#if message}
    <p>{message}</p>
  {/if}