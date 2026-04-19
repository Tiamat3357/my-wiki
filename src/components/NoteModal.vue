<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const title = ref(props.initialData ? props.initialData.title : '')
const content = ref(props.initialData ? props.initialData.content : '')

const handleSave = () => {
  if (title.value.trim() && content.value.trim()) {
    const noteDate = props.initialData ? props.initialData.date : new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

    emit('save', {
      title: title.value,
      content: content.value,
      date: noteDate
    })
  } else {
    alert('กรุณาพิมพ์หัวข้อและเนื้อหาให้ครบนะครับ!')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">

    <div class="bg-white rounded-2xl w-full max-w-5xl p-8 shadow-xl mx-4 flex flex-col h-[90vh]">

      <div class="flex justify-between items-center mb-4">
        <h2 v-if="!initialData" class="text-2xl font-bold text-slate-800">
          ✨ สร้างโน้ตใหม่
        </h2>
        <div v-else class="text-slate-400 text-sm font-medium">
          บันทึกเมื่อ: {{ initialData.date }}
        </div>

        <button @click="$emit('close')" class="text-slate-400 hover:text-red-500 text-2xl font-bold ml-auto">&times;</button>
      </div>

      <input
        v-model="title"
        type="text"
        placeholder="หัวข้อโน้ต..."
        class="w-full text-3xl font-bold py-2 mb-4 text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent transition-colors"
      />

      <textarea
        v-model="content"
        placeholder="พิมพ์เนื้อหา หรือแปะโค้ดตรงนี้เลย..."
        class="w-full py-2 text-slate-700 focus:outline-none resize-none font-mono text-base flex-grow bg-transparent"
      ></textarea>

      <div class="flex justify-end gap-3 mt-auto">
        <button @click="$emit('close')" class="px-6 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">ปิด</button>
        <button @click="handleSave" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">บันทึก</button>
      </div>

    </div>
  </div>
</template>
