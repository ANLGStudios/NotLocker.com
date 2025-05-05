// Notları kaydetmek için
function saveNote() {
  const noteTitle = document.getElementById('noteTitle').value;
  const notePassword = document.getElementById('notePassword').value;
  const noteContent = document.getElementById('noteContent').value;

  if (!noteTitle || !notePassword || !noteContent) {
    alert("Lütfen tüm alanları doldurun!");
    return;
  }

  const encryptedContent = encryptNoteContent(noteContent, notePassword);
  let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  savedNotes.push({ title: noteTitle, password: notePassword, content: encryptedContent });
  localStorage.setItem('notes', JSON.stringify(savedNotes));

  alert("Not başarıyla kaydedildi!");
  clearNewNoteFields();
  displaySavedNotes();
}

// Not içeriğini şifrelemek için
function encryptNoteContent(content, password) {
  return btoa(content + "::" + password); // Base64 ile şifreleme yapıyoruz
}

// Kaydedilen notları görüntülemek için
function displaySavedNotes() {
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = "";  // Önceki notları temizle

  savedNotes.forEach((note, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<button onclick="viewSavedNote(${index})">${note.title}</button>`;
    notesList.appendChild(listItem);
  });
}

// Kaydedilen notu görüntülemek için
function viewSavedNote(index) {
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = savedNotes[index];

  // Şifreli notu açmak için formu göstermek
  document.getElementById('noteViewer').style.display = 'block';
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('viewPassword').value = "";
  document.getElementById('noteText').innerHTML = "";
}

// Notu şifreyle görüntülemek için
function viewNote() {
  const notePassword = document.getElementById('viewPassword').value;
  const noteTitle = document.getElementById('noteTitle').value;

  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = savedNotes.find(n => n.title === noteTitle); // Notu başlığa göre buluyoruz

  if (note && note.password === notePassword) {
    const decryptedContent = decryptNoteContent(note.content, notePassword);
    document.getElementById('noteText').innerHTML = decryptedContent;
  } else {
    alert("Şifre yanlış veya not bulunamadı.");
  }
}

// Not içeriğini çözmek için
function decryptNoteContent(encryptedContent, password) {
  try {
    const decoded = atob(encryptedContent); // Base64 çözme
    const [content, pass] = decoded.split("::"); // Şifreyi ve içeriği ayırıyoruz

    if (pass === password) {
      return content;  // Eğer şifre doğruysa, not içeriğini döndürüyoruz
    } else {
      return "Şifre yanlış!";
    }
  } catch (e) {
    return "Hata oluştu!";
  }
}

// Yandaki notlar kısmını güncellemek için
function clearNewNoteFields() {
  document.getElementById('noteTitle').value = "";
  document.getElementById('notePassword').value = "";
  document.getElementById('noteContent').value = "";
}

// Sayfa yüklendiğinde kaydedilen notları göster
window.onload = function () {
  displaySavedNotes();
};
