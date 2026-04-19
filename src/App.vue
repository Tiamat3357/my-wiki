<script setup>
import Navbar from './components/Navbar.vue'
import SearchBar from './components/SearchBar.vue'
import NoteCard from './components/NoteCard.vue'
import NoteModal from './components/NoteModal.vue'
import { ref, onMounted, computed } from 'vue'

// --- 🌟 อาวุธลับ: นำเข้า Firebase ---
import { db } from './firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

const isModalOpen = ref(false)
const notes = ref([])
const editingNoteData = ref(null)
const currentSearchQuery = ref('')
const isClassic = ref(false)

// ชี้เป้าไปที่คอลเลกชันชื่อ "notes" ในฐานข้อมูล Firestore
const notesCollection = collection(db, 'notes')

const toggleTheme = () => {
  isClassic.value = !isClassic.value
}

// --- 📡 1. ฟังก์ชันดึงข้อมูลจาก Cloud (มาแทน LocalStorage) ---
const fetchNotes = async () => {
  try {
    const querySnapshot = await getDocs(notesCollection)
    const loadedNotes = []
    querySnapshot.forEach((doc) => {
      // เอา id จาก Cloud มาแปะติดไว้กับข้อมูลโน้ตด้วย (สำคัญมากตอนสั่งลบ/แก้)
      loadedNotes.push({ id: doc.id, ...doc.data() })
    })
    notes.value = loadedNotes
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล: ", error)
    alert("โหลดข้อมูลไม่ได้ครับ ลองเช็กเน็ตดูนะ!")
  }
}

// โหลดข้อมูลทันทีที่เปิดเว็บ
onMounted(() => {
  fetchNotes()
})

const filteredNotes = computed(() => {
  if (!currentSearchQuery.value) return notes.value
  const lowerQuery = currentSearchQuery.value.toLowerCase()
  return notes.value.filter(note =>
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery)
  )
})

const handleSearch = (query) => {
  currentSearchQuery.value = query
}

const openModalForNew = () => {
  editingNoteData.value = null
  isModalOpen.value = true
}

const openModalForEdit = (noteDataToEdit) => {
  editingNoteData.value = noteDataToEdit
  isModalOpen.value = true
}

// --- 🚀 2. ฟังก์ชันเซฟข้อมูลขึ้น Cloud ---
const handleSaveNote = async (noteData) => {
  try {
    if (editingNoteData.value && editingNoteData.value.id) {
      // แก้ไขของเดิม: ยิงไปอัปเดตที่ Cloud
      const noteRef = doc(db, 'notes', editingNoteData.value.id)
      await updateDoc(noteRef, {
        title: noteData.title,
        content: noteData.content,
        date: noteData.date
      })
    } else {
      // สร้างใหม่: โยนก้อนข้อมูลใหม่เข้า Cloud
      await addDoc(notesCollection, {
        title: noteData.title,
        content: noteData.content,
        date: noteData.date
      })
    }
    // พอเซฟลง Cloud เสร็จ ก็สั่งให้โหลดข้อมูลมาอัปเดตหน้าเว็บใหม่
    await fetchNotes()
    isModalOpen.value = false
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึก: ", error)
    alert("เซฟขึ้น Cloud ไม่สำเร็จครับ!")
  }
}

// --- 💥 3. ฟังก์ชันลบข้อมูลออกจาก Cloud ---
const handleDeleteNote = async (noteDataToDelete) => {
  if(confirm('แน่ใจนะว่าจะลบโน้ตนี้ทิ้ง? บินหายไปจาก Cloud เลยนะ!')) {
    try {
      const noteRef = doc(db, 'notes', noteDataToDelete.id)
      await deleteDoc(noteRef)
      // พอลบเสร็จ ก็โหลดข้อมูลใหม่มาแสดง
      await fetchNotes()
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบ: ", error)
    }
  }
}
</script>

<template>
  <div
    :class="isClassic ? 'bg-[#008080] font-mono' : 'bg-slate-50 font-sans'"
    class="min-h-screen flex flex-col"
    :style="isClassic ? '' : 'background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;'"
  >

    <Navbar :isClassic="isClassic" @toggle-theme="toggleTheme" />



    <main class="flex-grow w-full max-w-6xl mx-auto px-6 pb-12 pt-6">

      <div class="flex justify-end gap-3 mb-4">
        <button @click="exportNotes" class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
          📥 Backup
        </button>

        <label class="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer shadow-sm transition-all active:scale-95">
          📤 Restore
          <input type="file" @change="importNotes" class="hidden" accept=".json" />
        </label>
      </div>

      <SearchBar @search="handleSearch" />


      <div class="mt-8">
        <h2 :class="isClassic ? 'text-white drop-shadow-md' : 'text-slate-700'" class="text-xl font-semibold mb-6 px-2">Knowledge Base</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

          <div
            v-if="!isClassic"
            @click="openModalForNew"
            class="bg-white/80 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition-colors h-72"
          >
            <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl mb-3 shadow-sm hover:scale-105 transition-transform">+</div>
            <span class="text-blue-600 font-medium">สร้างโน้ตใหม่</span>
          </div>

          <div
            v-else
            @click="openModalForNew"
            class="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black cursor-pointer flex flex-col items-center justify-center h-72 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none"
          >
            <div class="bg-[#000080] text-white px-4 py-2 font-bold mb-3 border-2 border-t-black border-l-black border-b-white border-r-white text-xl">NEW NOTE</div>
            <span class="text-black font-bold border-b border-black">สร้างโน้ตใหม่</span>
          </div>

          <NoteCard
            v-for="(note, index) in filteredNotes"
            :key="index"
            :title="note.title"
            :date="note.date"
            :content="note.content"
            :isClassic="isClassic"
            @edit="openModalForEdit(note)"
            @delete="handleDeleteNote(note)"
          />

        </div>

        <div v-if="notes.length > 0 && filteredNotes.length === 0" :class="isClassic ? 'text-white' : 'text-slate-400'" class="text-center py-12 mt-8">
          <span class="text-4xl block mb-4">?</span>
          หาโน้ตไม่เจอเลย ลองพิมพ์คำอื่นดู
        </div>

        <div v-if="notes.length === 0" :class="isClassic ? 'text-white' : 'text-slate-400'" class="text-center py-12 mt-8">
          <span class="text-4xl block mb-4">!</span>
          ยังไม่มีโน้ต กดสร้างโน้ตใหม่ได้เลย
        </div>

      </div>

    </main>

    <NoteModal
      v-if="isModalOpen"
      :initialData="editingNoteData"
      @close="isModalOpen = false"
      @save="handleSaveNote"
    />

  </div>
</template>

<!-- <style>
/* สร้างคลาสพื้นหลังแบบขยับได้ โทนดาร์กนีออน-ไซอัน-ม่วง */
.animated-aurora-bg {
  /* ไล่สี 5 เฉด */
  background: linear-gradient(
    -45deg,
    #0f172a, /* สีกรมท่าดาร์กๆ */
    #3b0764, /* สีม่วงเข้ม */
    #0d9488, /* สีไซอัน (นีออน) */
    #1e1b4b  /* สีน้ำเงินเข้มลึก */
  );
  /* ขยายขนาดพื้นหลังให้ใหญ่ขึ้น 4 เท่า */
  background-size: 400% 400%;
  /* สั่งให้เล่นแอนิเมชันชื่อ moveAurora วนลูปไปเรื่อยๆ รอบละ 12 วินาที */
  animation: moveAurora 12s ease infinite;
}

/* คำสั่งบอกให้พื้นหลังเลื่อนตำแหน่งไปมา */
@keyframes moveAurora {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> -->
