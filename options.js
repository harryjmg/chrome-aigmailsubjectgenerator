document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    document.getElementById('optionsForm').addEventListener('submit', saveOptions);
  });
  
  function saveOptions(e) {
    e.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ apiKey }, () => {
      console.log('Clé API enregistrée');
    });
  }
  
  function restoreOptions() {
    chrome.storage.sync.get('apiKey', (data) => {
      if (data.apiKey) {
        document.getElementById('apiKey').value = data.apiKey;
      }
    });
  }
  