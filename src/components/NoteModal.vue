<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialData: Object,
  isClassic: Boolean // อย่าลืมรับ prop นี้มาจาก App.vue ด้วยนะ!
})

const emit = defineEmits(['close', 'save'])

const title = ref('')
const content = ref('')

// เช็กว่าถ้าเป็นการกด "แก้ไข" ให้ดึงข้อมูลเดิมมาแสดง
watch(() => props.initialData, (newData) => {
  if (newData) {
    title.value = newData.title
    content.value = newData.content
  } else {
    title.value = ''
    content.value = ''
  }
}, { immediate: true })

const handleSave = () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('เขียนหัวข้อกับเนื้อหาก่อนสิวัยรุ่น!')
    return
  }

  const today = new Date()
  const dateString = today.toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  emit('save', {
    title: title.value,
    content: content.value,
    date: dateString
  })
}
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

    <div
      v-if="!isClassic"
      class="w-full max-w-5xl bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
    >
      <div class="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-white/5">
        <h2 class="text-xl font-bold text-white">{{ initialData ? '📝 อ่านโน้ต' : '✨ สร้างโน้ตใหม่' }}</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6 flex flex-col gap-4 flex-grow">
        <input
          v-model="title"
          type="text"
          placeholder="หัวข้อโน้ต..."
          class="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 font-bold text-lg outline-none transition-all"
        />

        <textarea
          v-model="content"
          placeholder="จดสิ่งที่คุณคิดลงไปที่นี่..."
          class="w-full h-[60vh] bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-xl px-4 py-3 text-slate-300 placeholder-slate-500 font-sans outline-none resize-none transition-all"
        ></textarea>

      </div>

      <div class="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3 bg-slate-900/50">
        <button @click="$emit('close')" class="px-5 py-2.5 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 transition-colors">ยกเลิก</button>
        <button @click="handleSave" class="px-5 py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">บันทึกโน้ต</button>
      </div>
    </div>
<div
      v-else
      class="w-full max-w-5xl bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
    >
      <div class="bg-[#000080] text-white px-3 py-1.5 flex justify-between items-center font-bold">
        <span>{{ initialData ? 'EDIT_NOTE.EXE' : 'NEW_NOTE.EXE' }}</span>
        <button @click="$emit('close')" class="bg-[#c0c0c0] text-black px-2 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">X</button>
      </div>

      <div class="p-4 flex flex-col gap-3">
        <input v-model="title" type="text" placeholder="Title..." class="w-full bg-white border-2 border-t-black border-l-black border-b-white border-r-white px-2 py-1 text-black font-mono outline-none" />
        <textarea v-model="content" placeholder="Content..." class="w-full h-[60vh] bg-white border-2 border-t-black border-l-black border-b-white border-r-white px-3 py-2 text-black font-mono outline-none resize-none"></textarea>
      </div>

      <div class="p-4 flex justify-end gap-2">
        <button @click="$emit('close')" class="bg-[#c0c0c0] text-black font-bold px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">Cancel</button>
        <button @click="handleSave" class="bg-[#c0c0c0] text-black font-bold px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white">Save</button>
      </div>
    </div>

  </div>
</template>
