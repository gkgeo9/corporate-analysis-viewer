<script>
  import { db } from '$lib/firebase';
  import { collection, addDoc } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  
  let files;
  let message = '';
  let messageType = '';
  let uploading = false;
  let isDragging = false;
  
  async function handleUpload() {
    if (!files || files.length === 0) {
      message = 'Please select a file';
      messageType = 'error';
      return;
    }
    
    uploading = true;
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
        
        message = 'Upload successful! Redirecting...';
        messageType = 'success';
        setTimeout(() => goto('/'), 1500);
      } catch (error) {
        message = 'Error: ' + error.message;
        messageType = 'error';
      } finally {
        uploading = false;
      }
    };
    
    reader.readAsText(file);
  }
  
  function handleDragOver(event) {
    event.preventDefault();
    isDragging = true;
  }
  
  function handleDragLeave(event) {
    event.preventDefault();
    isDragging = false;
  }
  
  function handleDrop(event) {
    event.preventDefault();
    isDragging = false;
    files = event.dataTransfer.files;
  }
</script>

<div class="container mx-auto max-w-4xl">
  <div class="mb-6">
    <a href="/" class="btn-secondary inline-flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Dashboard
    </a>
  </div>
  
  <div class="glass rounded-2xl p-8">
    <h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
      Upload Analysis
    </h1>
    
    <div 
      class="border-2 border-dashed rounded-xl p-12 text-center {isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'} transition-colors"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
    >
      <input 
        type="file" 
        accept=".json" 
        bind:files 
        class="hidden" 
        id="file-upload"
        on:change={() => message = ''}
      />
      
      <label for="file-upload" class="cursor-pointer">
        <div class="flex flex-col items-center">
          {#if files && files[0]}
            <svg class="w-16 h-16 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-xl font-semibold text-white mb-2">{files[0].name}</p>
            <p class="text-gray-400">Ready to upload</p>
          {:else}
            <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-xl font-semibold text-white mb-2">Drop your JSON file here</p>
            <p class="text-gray-400 mb-4">or click to browse</p>
            <span class="btn-secondary">Choose File</span>
          {/if}
        </div>
      </label>
    </div>
    
    {#if files && files[0]}
      <div class="mt-8 flex justify-center">
        <button 
          on:click={handleUpload} 
          class="btn-primary flex items-center gap-2"
          disabled={uploading}
        >
          {#if uploading}
            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Upload Analysis
          {/if}
        </button>
      </div>
    {/if}
    
    {#if message}
      <div class="mt-6 p-4 rounded-lg {messageType === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}">
        <p class="{messageType === 'success' ? 'text-green-400' : 'text-red-400'} text-center">
          {message}
        </p>
      </div>
    {/if}
    
    <div class="mt-8 text-center text-gray-400 text-sm">
      <p>Supported format: JSON files</p>
      <p>File name should start with ticker symbol (e.g., AAPL_analysis.json)</p>
    </div>
  </div>
</div>