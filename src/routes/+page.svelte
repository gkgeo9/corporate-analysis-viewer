<script>
  import { db } from '$lib/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { onMount } from 'svelte';
  
  let analyses = [];
  
  onMount(async () => {
    const querySnapshot = await getDocs(collection(db, 'analyses'));
    analyses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ticker: doc.data().ticker,
      timestamp: doc.data().timestamp
    }));
  });
</script>

<h1>Analysis Files</h1>

<a href="/upload">Upload New Analysis</a>

<ul>
{#each analyses as analysis}
  <li>
    <a href="/analysis/{analysis.id}">{analysis.ticker} - {analysis.timestamp}</a>
  </li>
{/each}
</ul>