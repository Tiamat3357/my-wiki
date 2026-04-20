<script setup>
defineProps({
  isClassic: Boolean
})

defineEmits(['toggle-theme'])
</script>

<template>
  <nav
    :class="[
      isClassic
        ? 'bg-[#c0c0c0] border-b-4 border-[#808080] text-[#000080]'
        : 'bg-[#030712]/60 backdrop-blur-lg border-b border-white/10 text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)]',
      'sticky top-0 z-50 flex justify-between items-center px-6 py-4 transition-all duration-500'
    ]"
  >
    <div class="flex items-center gap-3 cursor-pointer">
      <div v-if="!isClassic" class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <span class="text-white font-bold text-lg leading-none mt-[-2px]">W</span>
      </div>

      <h1 :class="isClassic ? 'font-mono text-2xl font-bold tracking-tighter' : 'font-sans text-xl font-extrabold tracking-wide'">
        My Wiki<span v-if="!isClassic" class="text-blue-500">.</span>
      </h1>
    </div>

    <button
      @click="$emit('toggle-theme')"
      :class="[
        isClassic
          ? 'bg-[#c0c0c0] text-black font-bold font-mono px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white'
          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-5 py-2 rounded-full text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 hover:text-white active:scale-95 flex items-center gap-2 group'
      ]"
    >
      <svg v-if="!isClassic" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>

      {{ isClassic ? 'MODERN MODE' : 'Retro Mode' }}
    </button>
  </nav>
</template>
