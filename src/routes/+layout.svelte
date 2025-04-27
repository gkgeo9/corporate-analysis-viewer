<script>
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<!-- Background effects -->
	<div class="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
	<div class="fixed inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
	
	<!-- Main content -->
	<div class="relative z-10">
		<nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
			<div class="container mx-auto px-4 py-4 flex items-center justify-between">
				<a href="/" class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					CorpAnalysis
				</a>
				<div class="flex gap-4">
					<a href="/" class="text-white/70 hover:text-white transition-colors">Home</a>
					<a href="/upload" class="text-white/70 hover:text-white transition-colors">Upload</a>
				</div>
			</div>
		</nav>
		
		<main class="pt-24 pb-12 px-4">
			{@render children()}
		</main>
	</div>
</div>