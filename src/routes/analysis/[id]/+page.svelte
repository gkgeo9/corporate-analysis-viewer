<script>
  import { page } from '$app/stores';
  import { db } from '$lib/firebase';
  import { doc, getDoc } from 'firebase/firestore';
  import { onMount } from 'svelte';
  
  let analysis = null;
  let loading = true;
  
  onMount(async () => {
    try {
      const docRef = doc(db, 'analyses', $page.params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        analysis = docSnap.data();
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="container mx-auto max-w-6xl">
  <div class="mb-6">
    <a href="/" class="btn-secondary inline-flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Dashboard
    </a>
  </div>
  
  {#if loading}
    <div class="glass rounded-2xl p-8">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    </div>
  {:else if analysis}
    <div class="glass rounded-2xl p-8">
      <div class="mb-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {analysis.ticker} Analysis
            </h1>
            <p class="text-gray-400">
              <span class="font-medium">Uploaded:</span> {new Date(analysis.timestamp).toLocaleString()}
            </p>
            <p class="text-gray-400">
              <span class="font-medium">File:</span> {analysis.fileName}
            </p>
          </div>
          <div class="flex gap-3">
            <button class="btn-secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </button>
            <button class="btn-primary">
              Export
            </button>
          </div>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="glass rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-4">Analysis Data</h2>
          <div class="overflow-hidden rounded-lg">
            <pre class="bg-black/30 p-6 overflow-x-auto text-sm text-gray-300">
{JSON.stringify(analysis.data, null, 2)}
            </pre>
          </div>
        </div>
        
        <!-- Add more analysis sections as needed -->
        {#if analysis.data.summary}
          <div class="glass rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">Summary</h2>
            <p class="text-gray-300">{analysis.data.summary}</p>
          </div>
        {/if}
        
        {#if analysis.data.metrics}
          <div class="glass rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">Key Metrics</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              {#each Object.entries(analysis.data.metrics) as [key, value]}
                <div class="bg-black/20 rounded-lg p-4">
                  <p class="text-sm text-gray-400">{key}</p>
                  <p class="text-lg font-semibold text-white">{value}</p>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="glass rounded-2xl p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-300">Analysis not found</h3>
      <p class="mt-1 text-gray-400">The requested analysis could not be found.</p>
      <div class="mt-6">
        <a href="/" class="btn-primary">
          Return to Dashboard
        </a>
      </div>
    </div>
  {/if}
</div>