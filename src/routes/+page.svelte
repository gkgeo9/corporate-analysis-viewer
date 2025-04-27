<script>
  import { db } from '$lib/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { onMount } from 'svelte';
  
  let analyses = [];
  let loading = true;
  
  onMount(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'corporate-analysis'));
      analyses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ticker: doc.data().ticker,
        timestamp: new Date(doc.data().timestamp).toLocaleString()
      }));
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="container mx-auto max-w-6xl">
  <div class="glass rounded-2xl p-8 mb-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Corporate Analysis Dashboard
      </h1>
      <a href="/upload" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        Upload Analysis
      </a>
    </div>
    
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    {:else if analyses.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-300">No analyses found</h3>
        <p class="mt-1 text-gray-400">Get started by uploading a new analysis.</p>
        <div class="mt-6">
          <a href="/upload" class="btn-primary">
            Upload First Analysis
          </a>
        </div>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each analyses as analysis}
          <a 
            href="/analysis/{analysis.id}" 
            class="glass glass-hover rounded-xl p-6 group"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {analysis.ticker}
                </h3>
                <p class="text-sm text-gray-400">
                  {analysis.timestamp}
                </p>
              </div>
            </div>
            
            <div class="mt-4 flex items-center text-blue-400 group-hover:translate-x-2 transition-transform">
              <span class="text-sm">View Analysis</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>