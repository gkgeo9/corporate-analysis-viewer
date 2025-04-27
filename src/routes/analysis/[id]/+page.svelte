<script>
    import { page } from '$app/stores';
    import { db } from '$lib/firebase';
    import { doc, getDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';
    
    let analysis = null;
    
    onMount(async () => {
      const docRef = doc(db, 'analyses', $page.params.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        analysis = docSnap.data();
      }
    });
  </script>
  
  <a href="/">Back</a>
  
  {#if analysis}
    <h1>{analysis.ticker} Analysis</h1>
    <p>Uploaded: {analysis.timestamp}</p>
    <pre>{JSON.stringify(analysis.data, null, 2)}</pre>
  {:else}
    <p>Loading...</p>
  {/if}