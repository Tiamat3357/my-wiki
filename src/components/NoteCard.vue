<script setup>
const props = defineProps({
  title: String,
  date: String,
  content: String,
  isClassic: Boolean
})

const emit = defineEmits(['delete', 'edit'])
</script>

<template>
  <div v-if="!isClassic" @click="$emit('edit')" class="bg-white p-6 rounded-xl border border-slate-200 border-t-4 border-t-teal-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-200 cursor-pointer group relative flex flex-col h-72 overflow-hidden">

    <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button @click.stop="$emit('delete')" class="text-slate-300 hover:text-red-500 bg-white rounded-full p-2 shadow-sm border border-slate-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="flex-shrink-0">
      <h3 class="text-lg font-bold text-slate-800 mb-1 pr-8 truncate leading-relaxed pt-1">{{ title }}</h3>
      <p class="text-[10px] text-slate-400 mb-4">{{ date }}</p>
    </div>

    <div class="bg-slate-50 text-slate-700 p-4 rounded-xl relative flex-grow overflow-hidden border border-slate-100">
      <pre class="text-xs font-sans whitespace-pre-wrap break-words leading-relaxed h-full overflow-hidden">{{ content }}</pre>
      <div class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
    </div>
  </div>

  <div v-else @click="$emit('edit')" class="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black cursor-pointer flex flex-col h-72 p-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">

    <div class="bg-[#000080] text-white flex justify-between items-center px-1 mb-1 shrink-0">
      <h3 class="font-bold text-sm truncate leading-normal pt-1 pb-1">📄 {{ title }}</h3>
      <button @click.stop="$emit('delete')" class="bg-[#c0c0c0] text-black font-bold text-xs px-2 border-2 border-t-white border-l-white border-b-black border-r-black">X</button>
    </div>

    <div class="bg-white border-2 border-t-black border-l-black border-b-white border-r-white flex-grow p-2 overflow-hidden flex flex-col text-black">
      <pre class="text-xs font-sans whitespace-pre-wrap break-words h-full overflow-hidden">{{ content }}</pre>
    </div>
  </div>
</template>
