<script>
  import { page } from '$app/stores';
  import { db } from '$lib/firebase';
  import { doc, getDoc } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { createSafariClass } from '$lib/utils/browserDetect';
  
  let analysis = null;
  let loading = true;
  let viewMode = 'formatted'; // 'formatted' or 'json'
  let glassClass = 'glass';
  
  onMount(async () => {
    glassClass = createSafariClass();
    
    try {
      const docRef = doc(db, 'corporate-analysis', $page.params.id);
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
  
  function formatValue(value) {
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value);
    }
    return value;
  }
  
  function getTitle(key) {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
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
    <div class="{glassClass} rounded-2xl p-8">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    </div>
  {:else if analysis}
    <div class="{glassClass} rounded-2xl p-8">
      <div class="mb-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {analysis.ticker} Analysis
            </h1>
            <p class="text-gray-400">
              <span class="font-medium">Uploaded:</span> {formatDate(analysis.timestamp)}
            </p>
            <p class="text-gray-400">
              <span class="font-medium">File:</span> {analysis.fileName}
            </p>
          </div>
          <div class="flex gap-3">
            <div class="bg-black/20 rounded-lg p-1 flex">
              <button 
                class="px-4 py-2 rounded-md transition-all {viewMode === 'formatted' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400 hover:text-white'}"
                on:click={() => viewMode = 'formatted'}
              >
                Formatted
              </button>
              <button 
                class="px-4 py-2 rounded-md transition-all {viewMode === 'json' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400 hover:text-white'}"
                on:click={() => viewMode = 'json'}
              >
                JSON
              </button>
            </div>
            <button class="btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
      
      {#if viewMode === 'json'}
        <div class="space-y-6">
          <div class="{glassClass} rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">Analysis Data (JSON)</h2>
            <div class="overflow-hidden rounded-lg">
              <pre class="bg-black/30 p-6 overflow-x-auto text-sm text-gray-300">
{JSON.stringify(analysis.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      {:else}
        <div class="space-y-6">
          {#if analysis.data && typeof analysis.data === 'object'}
            {#each Object.entries(analysis.data) as [key, value]}
              <div class="{glassClass} rounded-xl p-6">
                <h2 class="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {getTitle(key)}
                </h2>
                
                {#if key === 'operational_reality' && typeof value === 'object'}
                  {#each Object.entries(value) as [subKey, subValue]}
                    <div class="mb-6">
                      <h3 class="text-lg font-semibold text-blue-300 mb-3">{getTitle(subKey)}</h3>
                      {#if Array.isArray(subValue)}
                        <ul class="space-y-2">
                          {#each subValue as item}
                            <li class="flex items-start gap-2">
                              <span class="text-blue-400 mt-1">•</span>
                              <span class="text-gray-300">{item}</span>
                            </li>
                          {/each}
                        </ul>
                      {:else if typeof subValue === 'string'}
                        <p class="text-gray-300 leading-relaxed">{subValue}</p>
                      {/if}
                    </div>
                  {/each}
                  
                {:else if key === 'hidden_truths' && Array.isArray(value)}
                  {#each value as truth, index}
                    <div class="mb-8 last:mb-0 bg-black/20 p-6 rounded-lg">
                      <h3 class="text-xl font-semibold text-red-400 mb-4">Hidden Truth #{index + 1}</h3>
                      <p class="text-gray-200 mb-4 font-medium">{truth.secret}</p>
                      
                      {#if truth.evidence_chain}
                        <div class="mb-4">
                          <h4 class="text-sm font-semibold text-purple-300 mb-2">Evidence Chain:</h4>
                          <ul class="space-y-2">
                            {#each truth.evidence_chain as evidence}
                              <li class="text-sm text-gray-400 italic border-l-2 border-purple-500/30 pl-3">
                                "{evidence}"
                              </li>
                            {/each}
                          </ul>
                        </div>
                      {/if}
                      
                      {#if truth.buried_details}
                        <div class="mb-4">
                          <h4 class="text-sm font-semibold text-orange-300 mb-2">Buried Details:</h4>
                          <ul class="space-y-2">
                            {#each truth.buried_details as detail}
                              <li class="text-sm text-gray-300 flex items-start gap-2">
                                <span class="text-orange-400 mt-1">▶</span>
                                {detail}
                              </li>
                            {/each}
                          </ul>
                        </div>
                      {/if}
                      
                      {#if truth.missing_elements}
                        <div>
                          <h4 class="text-sm font-semibold text-yellow-300 mb-2">Missing Elements:</h4>
                          <ul class="space-y-2">
                            {#each truth.missing_elements as element}
                              <li class="text-sm text-gray-300 flex items-start gap-2">
                                <span class="text-yellow-400 mt-1">⚠</span>
                                {element}
                              </li>
                            {/each}
                          </ul>
                        </div>
                      {/if}
                    </div>
                  {/each}
                  
                {:else if key === 'market_blindspots' && typeof value === 'object'}
                  <div class="grid md:grid-cols-3 gap-6">
                    {#each Object.entries(value) as [subKey, subValue]}
                      <div class="bg-black/20 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-yellow-300 mb-3">{getTitle(subKey)}</h3>
                        {#if Array.isArray(subValue)}
                          <ul class="space-y-2">
                            {#each subValue as item}
                              <li class="text-sm text-gray-300 flex items-start gap-2">
                                <span class="text-yellow-400 mt-1">!</span>
                                {item}
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </div>
                    {/each}
                  </div>
                  
                {:else if key === 'future_impact' && typeof value === 'object'}
                  {#each Object.entries(value) as [subKey, subValue]}
                    <div class="mb-6">
                      <h3 class="text-lg font-semibold text-green-300 mb-3">{getTitle(subKey)}</h3>
                      {#if Array.isArray(subValue)}
                        <div class="grid md:grid-cols-2 gap-4">
                          {#each subValue as item}
                            <div class="bg-black/10 p-3 rounded-lg flex items-start gap-2">
                              <span class="text-green-400 mt-1">→</span>
                              <span class="text-gray-300 text-sm">{item}</span>
                            </div>
                          {/each}
                        </div>
                      {:else if typeof subValue === 'string'}
                        <p class="text-gray-300 leading-relaxed">{subValue}</p>
                      {/if}
                    </div>
                  {/each}
                  
                {:else if key === 'forensic_connections' && Array.isArray(value)}
                  <div class="space-y-6">
                    {#each value as connection}
                      <div class="bg-gradient-to-r from-black/30 to-black/10 p-5 rounded-lg">
                        <h4 class="text-sm font-semibold text-cyan-300 mb-2">Connection #{value.indexOf(connection) + 1}</h4>
                        {#each Object.entries(connection) as [connKey, connValue]}
                          <p class="mb-2">
                            <span class="text-gray-400 font-medium">{getTitle(connKey)}:</span>
                            <span class="text-gray-200 ml-2">{connValue}</span>
                          </p>
                        {/each}
                      </div>
                    {/each}
                  </div>
                  
                {:else if key === 'investment_thesis_revision' && typeof value === 'object'}
                  <div class="space-y-4">
                    {#each Object.entries(value) as [subKey, subValue]}
                      <div class="bg-black/10 p-4 rounded-lg">
                        <h3 class="text-md font-semibold text-purple-300 mb-2">{getTitle(subKey)}</h3>
                        <p class="text-gray-300">{subValue}</p>
                      </div>
                    {/each}
                  </div>
                  
                {:else if typeof value === 'string'}
                  <p class="text-gray-300 leading-relaxed">{value}</p>
                {:else if Array.isArray(value)}
                  <ul class="space-y-2">
                    {#each value as item}
                      <li class="text-gray-300 flex items-start gap-2">
                        <span class="text-blue-400 mt-1">•</span>
                        {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
                      </li>
                    {/each}
                  </ul>
                {:else if typeof value === 'object' && value !== null}
                  <div class="bg-black/20 p-4 rounded-lg">
                    <pre class="text-sm text-gray-300 whitespace-pre-wrap">
{JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                {/if}
              </div>
            {/each}
          {:else}
            <div class="glass rounded-xl p-6">
              <p class="text-gray-300">No structured data available for this analysis.</p>
            </div>
          {/if}
        </div>
      {/if}
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